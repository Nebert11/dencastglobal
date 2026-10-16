import { extname } from 'node:path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const DOCUMENT_TYPES: Record<string, string> = {
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
};

export interface ImportedArticleDraft {
  title: string;
  excerpt: string;
  content: string;
}

function normalizeDocumentText(text: string): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.split('\n').map((line) => line.trim()).filter(Boolean).join(' '))
    .filter(Boolean);
}

function firstValue(lines: string[], label: string): string | undefined {
  const matcher = new RegExp(`^${label}\\s*:\\s*(.*)$`, 'i');
  return lines.map((line) => matcher.exec(line)?.[1]?.trim()).find(Boolean);
}

function removeLabelledMetadata(lines: string[]): string[] {
  return lines.filter((line) => !/^(title|excerpt|description|content)\s*:/i.test(line));
}

function createDraft(text: string): ImportedArticleDraft {
  const lines = normalizeDocumentText(text);
  if (!lines.length) throw new Error('This document has no readable text.');

  const labelledTitle = firstValue(lines, 'title');
  const titleLine = labelledTitle ?? lines[0]!.replace(/^#{1,6}\s*/, '').trim();
  const title = titleLine.replace(/^title\s*:\s*/i, '').trim();
  if (!title) throw new Error('Could not find an article title in the document.');

  const description = firstValue(lines, 'description');
  const labelledExcerpt = firstValue(lines, 'excerpt');
  const labelledContent = firstValue(lines, 'content');
  const titleIndex = labelledTitle ? lines.findIndex((line) => /^title\s*:/i.test(line)) : 0;
  const bodyLines = removeLabelledMetadata(lines.slice(titleIndex + 1));
  const body = [labelledContent, ...bodyLines].filter(Boolean).join('\n\n').trim() || description || '';
  const excerptSource = labelledExcerpt || description || body.split(/\n\s*\n/)[0] || body;
  const excerpt = excerptSource.replace(/\s+/g, ' ').trim().slice(0, 320);

  return { title, excerpt, content: body };
}

export async function importArticleDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<ImportedArticleDraft> {
  if (!buffer.length) throw new Error('The uploaded document is empty.');
  if (buffer.length > 10 * 1024 * 1024) throw new Error('Documents must be 10 MB or smaller.');

  const extension = extname(fileName).toLowerCase();
  const expectedMimeType = DOCUMENT_TYPES[extension];
  if (!expectedMimeType || (mimeType && mimeType !== 'application/octet-stream' && mimeType !== expectedMimeType)) {
    throw new Error('Upload a DOCX, PDF, TXT, or Markdown document.');
  }

  let text: string;
  if (extension === '.docx') {
    if (!buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) {
      throw new Error('This DOCX file appears to be invalid.');
    }
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (extension === '.pdf') {
    if (buffer.toString('ascii', 0, 5) !== '%PDF-') throw new Error('This PDF file appears to be invalid.');
    const result = await pdfParse(buffer);
    text = result.text;
  } else {
    text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  }

  return createDraft(text);
}