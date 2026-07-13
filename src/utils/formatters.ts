// ─── Date & Time ─────────────────────────────────────────────────────────────

/**
 * Formats a date string or Date object into a human-readable string.
 * @example formatDate('2024-03-15') → 'March 15, 2024'
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/**
 * Returns a relative time string (e.g. "2 days ago", "just now").
 * @example formatRelativeTime('2024-01-01') → '3 months ago'
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  if (diffHour < 24) return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  if (diffDay < 7) return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
  if (diffWeek < 4) return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
  if (diffMonth < 12) return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
}

// ─── Text ─────────────────────────────────────────────────────────────────────

/**
 * Truncates text to a maximum length and appends an ellipsis.
 * Does not break in the middle of a word.
 * @example truncateText('Hello World', 7) → 'Hello...'
 */
export function truncateText(text: string, maxLength: number, ellipsis = '...'): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength - ellipsis.length).trimEnd();
  // Walk back to last space to avoid mid-word cuts
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + ellipsis;
}

/**
 * Converts a string into a URL-safe slug.
 * @example slugify('Hello World!') → 'hello-world'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                          // split accented characters
    .replace(/[\u0300-\u036f]/g, '')           // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')             // remove non-alphanumeric (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')                  // replace spaces/underscores/hyphens with single hyphen
    .replace(/^-+|-+$/g, '');                  // strip leading/trailing hyphens
}

/**
 * Capitalizes the first character of a string.
 * @example capitalizeFirst('hello world') → 'Hello world'
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Numbers & Sizes ─────────────────────────────────────────────────────────

/**
 * Formats a file size (in bytes) into a human-readable string.
 * @example formatFileSize(1536) → '1.5 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return 'Invalid size';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const exp = Math.min(Math.floor(Math.log2(bytes) / 10), units.length - 1);
  const value = bytes / Math.pow(1024, exp);
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
  return `${formatted} ${units[exp]}`;
}

/**
 * Formats a view/count number with abbreviated suffixes.
 * @example formatViews(1500)   → '1.5K'
 * @example formatViews(2300000) → '2.3M'
 */
export function formatViews(count: number): string {
  if (count < 0) return '0';
  if (count < 1_000) return count.toString();
  if (count < 1_000_000) {
    const k = count / 1_000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
  }
  if (count < 1_000_000_000) {
    const m = count / 1_000_000;
    return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
  }
  const b = count / 1_000_000_000;
  return (b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)) + 'B';
}
