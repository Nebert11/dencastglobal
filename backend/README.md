# Dencast SQL API

The admin panel is limited to creating blog articles and uploading article images. MySQL credentials stay on the server; do not add them to frontend `VITE_*` variables.
The older `supabase/` SQL files are historical PostgreSQL references only; `sql/schema.mysql.sql` is the active schema. This setup creates the MySQL schema but does not copy existing Supabase rows; export/import those records before switching a live site.

## Local setup

### 1. Prepare the new device

Install Git, a supported Node.js LTS release (Node.js 22 or later recommended), npm, and MySQL 8.0 or later. Start the MySQL service using your operating system's service manager. Make sure the MySQL command-line client is available in your terminal.

Verify the tools are available:

```sh
git --version
node --version
npm --version
mysql --version
```

Clone the backend repository and enter its directory. Replace the placeholder URL with your remote repository URL:

```sh
git clone <BACKEND_REPOSITORY_URL> backend
cd backend
npm install
cp .env.example .env
```

The commands below assume your terminal is in this backend directory. On Windows PowerShell, use `Copy-Item .env.example .env` to copy the environment template.

### 2. Configure MySQL and the admin account

1. Edit `.env`; never commit it. It is ignored by Git. Configure database access using either `MYSQL_URL` or `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`. Leave `MYSQL_URL` blank when using the individual fields. The included schema creates the default `dencast` database. Import it using an account allowed to create databases and tables:

	```sh
	mysql -u root -p < sql/schema.mysql.sql
	```

	Omit `-p` if your local MySQL root account has no password. If you change `MYSQL_DATABASE` from `dencast`, update the database name in `sql/schema.mysql.sql` too. In Windows PowerShell, open `mysql -u root -p` and run `SOURCE sql/schema.mysql.sql;` instead of using shell input redirection.
2. For a passwordless local MySQL `root` account, leave `MYSQL_URL` blank and run `npm run setup-local-mysql`. It creates the least-privilege `dencast_app` user and generates `MYSQL_PASSWORD` and `JWT_SECRET` in `.env`. The helper configures the individual `MYSQL_*` fields and requires the database from the previous step to exist. If your root account requires a password, create an application user yourself and put its matching credentials in `.env`; the helper does not accept a root password. For example, open `mysql -u root -p` and run:

	```sql
	CREATE USER 'dencast_app'@'localhost' IDENTIFIED BY 'choose-a-local-password';
	CREATE USER 'dencast_app'@'127.0.0.1' IDENTIFIED BY 'choose-a-local-password';
	GRANT SELECT, INSERT, UPDATE, DELETE ON dencast.* TO 'dencast_app'@'localhost';
	GRANT SELECT, INSERT, UPDATE, DELETE ON dencast.* TO 'dencast_app'@'127.0.0.1';
	```

	Then set `MYSQL_USER=dencast_app` and `MYSQL_PASSWORD` to the password you chose. Also replace `JWT_SECRET` with a unique random value of at least 32 characters. Generate one with:

	```sh
	node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
	```

3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and optionally `ADMIN_NAME` in `.env`, then run:

	```sh
	npm run create-admin
	```

	This creates the admin account or resets the password and role for an existing account with the same email.

Keep `PORT=3001`, `PUBLIC_API_URL=http://localhost:3001`, and `UPLOAD_DIR=./uploads` for the default local setup. `FRONTEND_ORIGIN` is a comma-separated list of allowed frontend origins; the template allows `http://localhost:5174,http://localhost:5176`. The email settings (`RESEND_API_KEY`, `EMAIL_FROM`, and `CONTACT_NOTIFY_EMAIL`) can remain blank for initial local setup.

### 3. Start and verify the backend

```sh
npm run typecheck
npm run dev
```

In another terminal, check database connectivity:

```sh
curl http://localhost:3001/api/health
```

You can also open that URL in a browser. A successful response confirms that the API can connect to MySQL. If it fails, check that MySQL is running and that the database name and credentials in `.env` match the account you created.

### 4. Run the website and admin (optional)

This backend does not serve the frontend application. To run the full project, also obtain the `dencastglobal` frontend repository and place it beside this repository:

```text
your-projects/
  backend/
  dencastglobal/
```

In `dencastglobal`, install dependencies with `npm install` and configure its local environment with `VITE_API_BASE_URL=http://localhost:3001/api`. Setting this value only in the backend's `.env` does not configure the frontend. Never place MySQL credentials, `JWT_SECRET`, or email API keys in frontend `VITE_*` variables.

From `dencastglobal`, run these commands in two separate terminals, leaving the backend running in its own terminal:

```sh
npm run dev -- --port 5174
```

```sh
npm run dev:admin
```

Local URLs:

- Public website: `http://localhost:5174/`
- Admin login and articles: `http://localhost:5176/#/admin/login`
- Admin article images: `http://localhost:5176/#/admin/media`
- SQL API: `http://localhost:3001/`

After an article is published, the public `/blog` page reads it from MySQL and refreshes its published article list every 30 seconds. Existing static articles remain visible as a fallback.

Uploaded images are stored under `UPLOAD_DIR` (default `uploads/`) and served from `PUBLIC_API_URL`. Use persistent storage for this directory in deployed environments.

## Moving Existing Content

A Git clone includes source code, not your local `.env`, MySQL records, or `uploads/`. Importing `sql/schema.mysql.sql` prepares the schema but does not transfer your existing content.

To move existing MySQL content, export it on the original device using an account with backup permissions:

```sh
mysqldump -u root -p --single-transaction --no-tablespaces dencast > dencast-backup.sql
```

Transfer the dump securely, then restore it on the new device after creating the database and before running `npm run create-admin`:

```sh
mysql -u root -p dencast < dencast-backup.sql
```

These redirection examples use a POSIX shell; on Windows, use Command Prompt or your MySQL backup/restore tool. Replace `dencast` if you use a different database name. Restoring a dump can overwrite existing tables, so use a fresh database or back it up first.

Copy the original `uploads/` directory separately into the new backend directory. Generate new local secrets rather than committing or sharing `.env`. Database dumps may contain private data and password hashes; do not add them to Git, and remove temporary copies once the transfer is complete. If stored image URLs point to the old API origin, keep that origin accessible or update those records to the new `PUBLIC_API_URL`.

## Deployment

For deployment, route `/api` to this server or set the frontend's `VITE_API_BASE_URL` to the API origin. Set `FRONTEND_ORIGIN` to the exact frontend origin(s).

Build and start the compiled API from this directory:

```sh
npm run build
npm start
```

Configure the server's environment and persistent upload storage before starting it.

## Commands

- `npm run dev`: watch-mode API server
- `npm start`: run the compiled API server (run `npm run build` first)
- `npm run setup-local-mysql`: configure local application credentials using a passwordless MySQL root account
- `npm run create-admin`: create or reset the configured admin account
- `npm run typecheck`: check the server TypeScript
- `npm run build`: compile the server to `dist/`