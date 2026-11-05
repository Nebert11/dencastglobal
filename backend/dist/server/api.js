import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { getPool, getTableColumns, sqlValues } from './db.js';
import { importArticleDocument } from './articleImport.js';
const TABLES = new Set([
    'profiles', 'hero_content', 'site_settings', 'seo_metadata', 'social_links', 'clients',
    'project_categories', 'projects', 'blog_categories', 'blog_posts', 'faqs', 'contact_messages',
    'newsletter_subscribers', 'media_files', 'statistics', 'testimonials', 'team_members',
    'service_categories', 'services',
]);
const PUBLIC_READ = new Set([
    'hero_content', 'site_settings', 'seo_metadata', 'social_links', 'clients', 'project_categories',
    'projects', 'blog_categories', 'blog_posts', 'faqs', 'statistics', 'testimonials', 'team_members',
    'service_categories', 'services', 'media_files',
]);
const PUBLIC_INSERT = new Set(['contact_messages', 'newsletter_subscribers']);
const RELATIONS = {
    services: {
        category: { table: 'service_categories', on: 't.category_id = category.id', fields: ['id', 'name', 'slug', 'description', 'sort_order'] },
    },
    projects: {
        category: { table: 'project_categories', on: 't.category_id = category.id', fields: ['id', 'name', 'slug', 'description', 'sort_order'] },
    },
    blog_posts: {
        category: { table: 'blog_categories', on: 't.category_id = category.id', fields: ['id', 'name', 'slug', 'description', 'color'] },
        author: { table: 'profiles', on: 't.author_id = author.id', fields: ['id', 'full_name', 'avatar_url'] },
    },
};
const IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const JWT_SECRET = process.env.JWT_SECRET;
const UPLOAD_DIRECTORY = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));
const IMAGE_TYPES = {
    'image/jpeg': { extension: 'jpg', signature: (file) => file.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) },
    'image/png': { extension: 'png', signature: (file) => file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
    'image/gif': { extension: 'gif', signature: (file) => ['GIF87a', 'GIF89a'].includes(file.toString('ascii', 0, 6)) },
    'image/webp': { extension: 'webp', signature: (file) => file.toString('ascii', 0, 4) === 'RIFF' && file.toString('ascii', 8, 12) === 'WEBP' },
    'image/avif': { extension: 'avif', signature: (file) => file.toString('ascii', 4, 8) === 'ftyp' && /^(avif|avis)$/.test(file.toString('ascii', 8, 12)) },
};
function identifier(value) {
    if (!IDENTIFIER.test(value))
        throw new Error('Invalid SQL identifier.');
    return `\`${value}\``;
}
function respondError(response, error, status = 400) {
    const message = error instanceof Error ? error.message : 'Request failed.';
    response.status(status).json({ data: null, error: { message }, count: null });
}
function errorStatus(error, fallback = 400) {
    if (error instanceof Error && error.message.startsWith('Set MYSQL_URL'))
        return 503;
    return fallback;
}
function readToken(request) {
    const authorization = request.header('authorization');
    return authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
}
function authenticate(request, response, next) {
    if (!JWT_SECRET) {
        respondError(response, new Error('JWT_SECRET is not configured.'), 500);
        return;
    }
    const token = readToken(request);
    if (!token) {
        respondError(response, new Error('Authentication required.'), 401);
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        request.authUser = { id: payload.id, email: payload.email, full_name: payload.full_name, role: payload.role };
        next();
    }
    catch {
        respondError(response, new Error('Session expired. Please sign in again.'), 401);
    }
}
function optionalAuth(request) {
    const token = readToken(request);
    if (!token || !JWT_SECRET)
        return;
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        request.authUser = { id: payload.id, email: payload.email, full_name: payload.full_name, role: payload.role };
    }
    catch {
        // Public reads remain available when an old browser session has expired.
    }
}
function isAdmin(user) {
    return !!user && ['super_admin', 'admin', 'editor'].includes(user.role);
}
function relationFor(table, alias) {
    return RELATIONS[table]?.[alias];
}
async function notifyContactMessage(message) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const to = process.env.CONTACT_NOTIFY_EMAIL;
    if (!apiKey || !from || !to)
        return;
    try {
        const result = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: message.email,
                subject: `New contact message: ${message.subject || 'Website inquiry'}`,
                text: `From: ${message.name} <${message.email}>\n\n${message.message}`,
            }),
        });
        if (!result.ok)
            console.error(`Contact notification failed (${result.status}).`);
    }
    catch (error) {
        console.error('Contact notification failed.', error);
    }
}
async function buildJoins(table, filters, columns = '*') {
    const aliases = new Set();
    for (const filter of filters) {
        if (filter.column.includes('.'))
            aliases.add(filter.column.split('.')[0]);
    }
    for (const match of columns.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*):[a-zA-Z_][a-zA-Z0-9_]*\(/g)) {
        aliases.add(match[1]);
    }
    const joins = [];
    const selections = [];
    for (const alias of aliases) {
        const relation = relationFor(table, alias);
        if (!relation)
            throw new Error(`Unsupported relation: ${alias}.`);
        joins.push(`LEFT JOIN ${identifier(relation.table)} ${identifier(alias)} ON ${relation.on}`);
        const fields = relation.fields.map((field) => `'${field}', ${identifier(alias)}.${identifier(field)}`).join(', ');
        selections.push(`IF(${identifier(alias)}.id IS NULL, NULL, JSON_OBJECT(${fields})) AS ${identifier(alias)}`);
    }
    return { joins: joins.join(' '), selections };
}
function fieldSql(table, column, joinedAliases) {
    const [alias = 't', field] = column.includes('.') ? column.split('.', 2) : ['t', column];
    if (!field || !IDENTIFIER.test(field))
        throw new Error('Invalid column name.');
    if (alias !== 't' && !joinedAliases.has(alias))
        throw new Error(`Unsupported relation: ${alias}.`);
    return `${identifier(alias)}.${identifier(field)}`;
}
async function buildWhere(table, filters, search, joinedAliases) {
    const clauses = [];
    const values = [];
    for (const filter of filters) {
        const field = fieldSql(table, filter.column, joinedAliases);
        if (filter.column.startsWith('t.') || !filter.column.includes('.')) {
            const columns = await getTableColumns(table);
            if (!columns.has(filter.column.replace(/^t\./, '')))
                throw new Error(`Unknown column: ${filter.column}.`);
        }
        switch (filter.operator) {
            case 'eq':
                clauses.push(filter.value === null ? `${field} IS NULL` : `${field} = ?`);
                if (filter.value !== null)
                    values.push(filter.value);
                break;
            case 'neq':
                clauses.push(filter.value === null ? `${field} IS NOT NULL` : `${field} <> ?`);
                if (filter.value !== null)
                    values.push(filter.value);
                break;
            case 'gte':
                clauses.push(`${field} >= ?`);
                values.push(filter.value);
                break;
            case 'lte':
                clauses.push(`${field} <= ?`);
                values.push(filter.value);
                break;
            case 'ilike':
                clauses.push(`LOWER(${field}) LIKE LOWER(?)`);
                values.push(filter.value);
                break;
            case 'not_is_null':
                clauses.push(`${field} IS NOT NULL`);
                break;
            default: throw new Error(`Unsupported filter operator: ${filter.operator}.`);
        }
    }
    if (search) {
        const searchClauses = [];
        const matcher = /(?:^|,)([a-zA-Z_][a-zA-Z0-9_]*)\.ilike\.(.*?)(?=,[a-zA-Z_][a-zA-Z0-9_]*\.ilike\.|$)/g;
        for (const match of search.matchAll(matcher)) {
            const column = match[1];
            if (!(await getTableColumns(table)).has(column))
                throw new Error(`Unknown column: ${column}.`);
            searchClauses.push(`LOWER(${identifier('t')}.${identifier(column)}) LIKE LOWER(?)`);
            values.push(match[2]);
        }
        if (searchClauses.length)
            clauses.push(`(${searchClauses.join(' OR ')})`);
    }
    return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values };
}
async function queryData(request, response) {
    const body = request.body;
    const table = body.table ?? '';
    const action = body.action ?? 'select';
    if (!TABLES.has(table))
        throw new Error('Unknown table.');
    const admin = isAdmin(request.authUser);
    if (action === 'select') {
        if (admin && !['blog_posts', 'blog_categories', 'media_files', 'profiles'].includes(table)) {
            throw new Error('Admin access is limited to article and image content.');
        }
        if (!admin && !PUBLIC_READ.has(table) && table !== 'profiles')
            throw new Error('Not authorized to read this table.');
        if (table === 'profiles' && !admin)
            throw new Error('Not authorized to read profiles.');
        const filters = body.filters ?? [];
        const { joins, selections } = await buildJoins(table, filters, body.columns);
        const aliases = new Set([
            ...filters.flatMap((filter) => filter.column.includes('.') ? [filter.column.split('.')[0]] : []),
            ...Array.from(body.columns?.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*):[a-zA-Z_][a-zA-Z0-9_]*\(/g) ?? [], (match) => match[1]),
        ]);
        const where = await buildWhere(table, filters, body.search, aliases);
        let publicRestrictions = '';
        const publicValues = [];
        if (!admin && table === 'blog_posts') {
            publicRestrictions = `${where.sql ? ' AND' : ' WHERE'} t.is_published = 1 AND t.published_at IS NOT NULL`;
        }
        else if (!admin && table === 'projects') {
            publicRestrictions = `${where.sql ? ' AND' : ' WHERE'} t.is_active = 1 AND t.published_at IS NOT NULL`;
        }
        else if (!admin && ['team_members', 'services'].includes(table)) {
            publicRestrictions = `${where.sql ? ' AND' : ' WHERE'} t.is_active = 1`;
        }
        const whereSql = `${where.sql}${publicRestrictions}`;
        const pool = getPool();
        let count = null;
        if (body.count) {
            const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM ${identifier(table)} t ${joins} ${whereSql}`, sqlValues([...where.values, ...publicValues]));
            count = Number(countRows[0]?.total ?? 0);
        }
        if (body.head) {
            response.json({ data: null, error: null, count });
            return;
        }
        const orders = (body.orders ?? []).map((order) => {
            const column = fieldSql(table, order.column, aliases);
            return `${column} ${order.ascending ? 'ASC' : 'DESC'}`;
        });
        const orderSql = orders.length ? `ORDER BY ${orders.join(', ')}` : '';
        const limit = Math.min(Math.max(Number(body.limit ?? 100), 1), 500);
        const offset = Math.max(Number(body.offset ?? 0), 0);
        const baseSelection = table === 'profiles'
            ? 't.id, t.email, t.full_name, t.avatar_url, t.role, t.is_active, t.created_at, t.updated_at'
            : 't.*';
        const selectedRelations = selections.length ? `, ${selections.join(', ')}` : '';
        const [rows] = await pool.query(`SELECT ${baseSelection}${selectedRelations} FROM ${identifier(table)} t ${joins} ${whereSql} ${orderSql} LIMIT ? OFFSET ?`, sqlValues([...where.values, ...publicValues, limit, offset]));
        const data = rows.map((row) => {
            for (const alias of aliases) {
                if (typeof row[alias] === 'string') {
                    try {
                        row[alias] = JSON.parse(row[alias]);
                    }
                    catch { /* Keep driver value. */ }
                }
            }
            return row;
        });
        if (body.single) {
            if (data.length > 1 || (body.single === 'single' && data.length === 0)) {
                respondError(response, new Error('Expected one row but received a different number.'), 406);
                return;
            }
            response.json({ data: data[0] ?? null, error: null, count });
            return;
        }
        response.json({ data, error: null, count });
        return;
    }
    const filters = body.filters ?? [];
    if (!filters.length && action !== 'insert' && action !== 'upsert')
        throw new Error('Mutations require at least one filter.');
    const rawValues = body.values;
    const entries = (Array.isArray(rawValues) ? rawValues : rawValues ? [rawValues] : []);
    const allowedAdminArticleChange = table === 'blog_posts'
        && ['insert', 'update', 'delete'].includes(action);
    if (admin && !allowedAdminArticleChange) {
        throw new Error('Admin changes are limited to article creation, editing, and deletion.');
    }
    const guestAllowed = !admin && ((action === 'insert' && PUBLIC_INSERT.has(table))
        || (action === 'upsert' && table === 'newsletter_subscribers'));
    const guestViewIncrement = !admin && action === 'update' && table === 'blog_posts'
        && entries.length === 1 && Object.keys(entries[0]).length === 1 && 'views' in entries[0];
    if (!admin && !guestAllowed && !guestViewIncrement)
        throw new Error('Admin access is required for this change.');
    if (table === 'profiles') {
        if (!request.authUser || action === 'insert')
            throw new Error('Not authorized to change profiles.');
        if (entries.some((entry) => 'role' in entry || 'password_hash' in entry))
            throw new Error('Role and password fields cannot be changed here.');
        if (filters.some((filter) => filter.column !== 'id' || filter.value !== request.authUser.id)) {
            throw new Error('You can only update your own profile.');
        }
    }
    const columns = await getTableColumns(table);
    const validateEntries = (entry) => {
        for (const key of Object.keys(entry)) {
            if (!IDENTIFIER.test(key) || !columns.has(key))
                throw new Error(`Unknown column: ${key}.`);
            if (table === 'profiles' && ['role', 'password_hash'].includes(key))
                throw new Error(`Cannot update ${key}.`);
            if (!admin && guestAllowed) {
                const permitted = table === 'contact_messages'
                    ? ['name', 'email', 'phone', 'company', 'service_interest', 'subject', 'message']
                    : ['email', 'name'];
                if (!permitted.includes(key))
                    throw new Error(`Cannot set ${key} from a public form.`);
            }
        }
    };
    entries.forEach(validateEntries);
    const aliases = new Set();
    const where = await buildWhere(table, filters, undefined, aliases);
    const writeWhereSql = where.sql.replace(/`t`\./g, '');
    const pool = getPool();
    if (guestViewIncrement) {
        await pool.execute(`UPDATE ${identifier(table)} SET views = COALESCE(views, 0) + 1 WHERE ${writeWhereSql.replace(/^WHERE /, '')}`, sqlValues(where.values));
        response.json({ data: null, error: null, count: null });
        return;
    }
    if (action === 'insert' || action === 'upsert') {
        if (!entries.length)
            throw new Error('At least one row is required.');
        const inserted = [];
        for (const entry of entries) {
            const values = { ...entry };
            if (!admin && table === 'contact_messages')
                values.status = 'new';
            if (!admin && table === 'newsletter_subscribers') {
                values.is_active = true;
                values.source = 'website';
                values.subscribed_at = new Date();
                values.unsubscribed_at = null;
            }
            if (columns.has('id') && values.id === undefined)
                values.id = randomUUID();
            const keys = Object.keys(values);
            if (!keys.length)
                throw new Error('Cannot insert an empty row.');
            const fields = keys.map(identifier).join(', ');
            const placeholders = keys.map(() => '?').join(', ');
            let suffix = '';
            if (action === 'upsert') {
                const conflict = body.conflict;
                if (!conflict || !columns.has(conflict))
                    throw new Error('Invalid upsert conflict column.');
                const updates = keys.filter((key) => key !== conflict && key !== 'id').map((key) => `${identifier(key)} = VALUES(${identifier(key)})`);
                suffix = ` ON DUPLICATE KEY UPDATE ${updates.length ? updates.join(', ') : `${identifier(conflict)} = VALUES(${identifier(conflict)})`}`;
            }
            await pool.execute(`INSERT INTO ${identifier(table)} (${fields}) VALUES (${placeholders})${suffix}`, sqlValues(keys.map((key) => values[key])));
            if (!admin && action === 'insert' && table === 'contact_messages') {
                void notifyContactMessage(values);
            }
            if (body.single) {
                const lookupKey = body.conflict && action === 'upsert' ? body.conflict : 'id';
                const [found] = await pool.execute(`SELECT * FROM ${identifier(table)} WHERE ${identifier(lookupKey)} = ? LIMIT 1`, sqlValues([values[lookupKey] ?? entries[0][lookupKey]]));
                if (found[0])
                    inserted.push(found[0]);
            }
        }
        response.json({ data: body.single ? inserted[0] ?? null : null, error: null, count: null });
        return;
    }
    if (action === 'update') {
        if (entries.length !== 1)
            throw new Error('Update requires one values object.');
        const values = { ...entries[0] };
        if (columns.has('updated_at') && !('updated_at' in values))
            values.updated_at = new Date();
        const keys = Object.keys(values);
        if (!keys.length)
            throw new Error('No update values were provided.');
        const assignments = keys.map((key) => `${identifier(key)} = ?`).join(', ');
        await pool.execute(`UPDATE ${identifier(table)} SET ${assignments} ${writeWhereSql}`, sqlValues([...keys.map((key) => values[key]), ...where.values]));
        let data = null;
        if (body.single) {
            const [rows] = await pool.query(`SELECT * FROM ${identifier(table)} ${writeWhereSql} LIMIT 1`, sqlValues(where.values));
            data = rows;
        }
        response.json({ data: body.single ? data?.[0] ?? null : null, error: null, count: null });
        return;
    }
    if (action === 'delete') {
        await pool.execute(`DELETE FROM ${identifier(table)} ${writeWhereSql}`, sqlValues(where.values));
        response.json({ data: null, error: null, count: null });
        return;
    }
    throw new Error('Unsupported database operation.');
}
export function registerApi(app) {
    app.get('/api/health', async (_request, response) => {
        try {
            await getPool().query('SELECT 1');
            response.json({ status: 'ok', database: 'connected' });
        }
        catch (error) {
            respondError(response, error, 503);
        }
    });
    app.post('/api/auth/login', async (request, response) => {
        try {
            if (!JWT_SECRET)
                throw new Error('JWT_SECRET is not configured.');
            const email = String(request.body?.email ?? '').trim().toLowerCase();
            const password = String(request.body?.password ?? '');
            if (!email || !password)
                throw new Error('Email and password are required.');
            const [rows] = await getPool().execute('SELECT id, email, full_name, role, is_active, password_hash FROM profiles WHERE LOWER(email) = ? LIMIT 1', [email]);
            const profile = rows[0];
            if (!profile || !profile.is_active || !profile.password_hash || !(await bcrypt.compare(password, profile.password_hash))) {
                respondError(response, new Error('Email or password is incorrect.'), 401);
                return;
            }
            if (!['super_admin', 'admin', 'editor'].includes(String(profile.role))) {
                respondError(response, new Error('This account cannot access the admin portal.'), 403);
                return;
            }
            const user = { id: String(profile.id), email: String(profile.email), full_name: profile.full_name ?? null, role: String(profile.role) };
            const token = jwt.sign(user, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '8h') });
            response.json({ data: { user, session: { access_token: token, token_type: 'bearer' } }, error: null });
        }
        catch (error) {
            respondError(response, error, errorStatus(error));
        }
    });
    app.get('/api/auth/me', authenticate, (request, response) => {
        response.json({ data: { user: request.authUser }, error: null });
    });
    app.post('/api/articles/import', authenticate, express.raw({ type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown', 'application/octet-stream'], limit: '10mb' }), async (request, response) => {
        try {
            const fileName = path.basename(decodeURIComponent(request.header('x-file-name') || ''));
            const mimeType = request.header('content-type')?.split(';')[0]?.trim().toLowerCase() ?? '';
            if (!Buffer.isBuffer(request.body) || !fileName)
                throw new Error('Choose an article document to import.');
            const data = await importArticleDocument(request.body, fileName, mimeType);
            response.json({ data, error: null });
        }
        catch (error) {
            respondError(response, error, errorStatus(error));
        }
    });
    app.post('/api/media/images', authenticate, express.raw({ type: Object.keys(IMAGE_TYPES), limit: '10mb' }), async (request, response) => {
        let savedPath;
        try {
            const mimeType = request.header('content-type')?.split(';')[0]?.trim().toLowerCase() ?? '';
            const imageType = IMAGE_TYPES[mimeType];
            const image = request.body;
            if (!imageType || !Buffer.isBuffer(image) || !image.length || !imageType.signature(image)) {
                throw new Error('Upload a valid JPEG, PNG, GIF, WebP, or AVIF image under 10 MB.');
            }
            const id = randomUUID();
            const name = `${id}.${imageType.extension}`;
            savedPath = path.join(UPLOAD_DIRECTORY, name);
            await mkdir(UPLOAD_DIRECTORY, { recursive: true });
            await writeFile(savedPath, image, { flag: 'wx' });
            const publicApiUrl = (process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/$/, '');
            const url = `${publicApiUrl}/uploads/${name}`;
            const originalName = path.basename(decodeURIComponent(request.header('x-file-name') || 'image'));
            await getPool().execute(`INSERT INTO media_files (id, name, original_name, url, type, size, file_url, file_type, mime_type, file_size, uploaded_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'image', ?, ?, ?)`, sqlValues([id, originalName, originalName, url, mimeType, image.length, url, mimeType, image.length, request.authUser?.id ?? null]));
            response.status(201).json({
                data: {
                    id,
                    name: originalName,
                    original_name: originalName,
                    url,
                    file_url: url,
                    type: mimeType,
                    file_type: 'image',
                    size: image.length,
                    file_size: image.length,
                    mime_type: mimeType,
                    uploaded_by: request.authUser?.id ?? null,
                    created_at: new Date().toISOString(),
                },
                error: null,
            });
        }
        catch (error) {
            if (savedPath)
                await unlink(savedPath).catch(() => undefined);
            respondError(response, error, errorStatus(error));
        }
    });
    app.post('/api/data', async (request, response) => {
        optionalAuth(request);
        try {
            await queryData(request, response);
        }
        catch (error) {
            const forbidden = error instanceof Error && /^(Admin access|Admin changes|You can only|Not authorized)/.test(error.message);
            respondError(response, error, forbidden ? 403 : errorStatus(error));
        }
    });
}
