#!/usr/bin/env python3
"""
Fix JavaScript/TypeScript string literal quote issues in .tsx files.

Issues fixed:
1. Single-quoted strings that contain apostrophes -> convert outer quotes to double
2. Mismatched quotes in template literals like `Delete "${x}'?` -> `Delete "${x}"?`
3. Mixed quote patterns in JSX attributes and object values
"""

import re
import os
import sys

SRC_DIR = '/tmp/cc-agent/68822394/project/src'


def fix_template_literal_mixed_quotes_in_line(line):
    """
    Fix patterns inside template literals like:
    `Delete "${x}'?` -> `Delete "${x}"?`
    We scan for template literals and fix mismatched quote pairs within them.
    """
    changed = False
    result = []
    i = 0

    while i < len(line):
        ch = line[i]

        # Skip regular double-quoted strings
        if ch == '"':
            j = i + 1
            while j < len(line) and line[j] != '"':
                if line[j] == '\\':
                    j += 2
                    continue
                j += 1
            result.append(line[i:j+1])
            i = j + 1
            continue

        # Skip regular single-quoted strings
        if ch == "'":
            j = i + 1
            while j < len(line) and line[j] != "'":
                if line[j] == '\\':
                    j += 2
                    continue
                j += 1
            result.append(line[i:j+1])
            i = j + 1
            continue

        # Handle template literals
        if ch == '`':
            # Extract the full template literal content
            j = i + 1
            tl_parts = ['`']
            while j < len(line):
                if line[j] == '\\':
                    tl_parts.append(line[j:j+2])
                    j += 2
                    continue
                if line[j] == '`':
                    tl_parts.append('`')
                    j += 1
                    break
                if line[j] == '$' and j + 1 < len(line) and line[j+1] == '{':
                    # interpolation - copy as-is
                    depth = 1
                    tl_parts.append('${')
                    j += 2
                    while j < len(line) and depth > 0:
                        if line[j] == '{':
                            depth += 1
                        elif line[j] == '}':
                            depth -= 1
                            if depth == 0:
                                tl_parts.append('}')
                                j += 1
                                break
                        tl_parts.append(line[j])
                        j += 1
                    continue
                tl_parts.append(line[j])
                j += 1

            tl_str = ''.join(tl_parts)

            # Now fix mismatched quotes inside the template literal
            # Pattern: "text' or "expr}' should be "text" or "expr}"
            # We do a simple regex fix: inside template literal, "..." where closing is '
            # Fix: "([^"'`${}]*(?:\$\{[^}]*\}[^"'`${}]*)*)' -> "\1"
            fixed_tl = re.sub(
                r'"([^"\'`]*(?:\$\{[^}]*\}[^"\'`]*)*?)\'',
                r'"\1"',
                tl_str
            )
            if fixed_tl != tl_str:
                changed = True
                tl_str = fixed_tl

            result.append(tl_str)
            i = j
            continue

        result.append(ch)
        i += 1

    return ''.join(result), changed


def fix_single_quoted_with_apostrophe(line):
    """
    Fix single-quoted JS strings that contain an apostrophe.
    e.g.: 'We've produced...' -> "We've produced..."
    e.g.: 'don't just produce' -> "don't just produce"

    Only convert when the apostrophe is clearly a word apostrophe (letter'letter).
    """
    changed = False
    result = []
    i = 0

    while i < len(line):
        ch = line[i]

        # Skip template literals entirely
        if ch == '`':
            j = i + 1
            while j < len(line) and line[j] != '`':
                if line[j] == '\\':
                    j += 2
                    continue
                if line[j] == '$' and j + 1 < len(line) and line[j+1] == '{':
                    depth = 1
                    j += 2
                    while j < len(line) and depth > 0:
                        if line[j] == '{':
                            depth += 1
                        elif line[j] == '}':
                            depth -= 1
                        j += 1
                    continue
                j += 1
            result.append(line[i:j+1])
            i = j + 1
            continue

        # Skip double-quoted strings
        if ch == '"':
            j = i + 1
            while j < len(line) and line[j] != '"':
                if line[j] == '\\':
                    j += 2
                    continue
                j += 1
            result.append(line[i:j+1])
            i = j + 1
            continue

        # Single-quoted string
        if ch == "'":
            j = i + 1
            while j < len(line) and line[j] != "'":
                if line[j] == '\\':
                    j += 2
                    continue
                j += 1

            inner = line[i+1:j]
            closing = "'" if j < len(line) else ''

            # Check if inner contains a word apostrophe (letter'letter)
            has_apostrophe = bool(re.search(r"[a-zA-Z]'[a-zA-Z]", inner))

            if has_apostrophe and closing == "'":
                # Convert outer quotes to double quotes
                # Escape any existing double quotes in inner
                inner_escaped = inner.replace('"', '\\"')
                result.append('"' + inner_escaped + '"')
                changed = True
            else:
                result.append(line[i:j+1])

            i = j + 1
            continue

        result.append(ch)
        i += 1

    return ''.join(result), changed


def fix_jsx_mixed_quotes(line):
    """
    Fix JSX attribute mismatched quotes:
    attr="VALUE'  -> attr="VALUE"
    attr='VALUE"  -> attr='VALUE'

    Also fix object property values with mismatched quotes.
    """
    changed = False

    # Fix: ="text' (double open, single close) at end of attribute value
    new_line = re.sub(
        r'="([^"\'<>]*)\'' + r"(?=[\s\n>/{]|$)",
        r'="\1"',
        line
    )
    if new_line != line:
        changed = True
        line = new_line

    # Fix: ='text" (single open, double close) at end of attribute value
    new_line = re.sub(
        r"='([^\"'<>]*)\"" + r'(?=[\s\n>/{]|$)',
        r"='\1'",
        line
    )
    if new_line != line:
        changed = True
        line = new_line

    return line, changed


def fix_object_value_mixed_quotes(line):
    """
    Fix object property value mismatched quotes:
    key: "VALUE'  -> key: "VALUE"
    key: 'VALUE"  -> key: 'VALUE'
    
    Also: { key: "VALUE', key2: ... }
    """
    changed = False

    # Fix: : "text' followed by comma, }, or end
    new_line = re.sub(
        r'(:\s*)"([^"\']*)\'' + r"(?=[,\s})\n]|$)",
        r'\1"\2"',
        line
    )
    if new_line != line:
        changed = True
        line = new_line

    # Fix: : 'text" followed by comma, }, or end
    new_line = re.sub(
        r"(:\s*)'([^\"']*)\"" + r'(?=[,\s})\n]|$)',
        r"\1'\2'",
        line
    )
    if new_line != line:
        changed = True
        line = new_line

    return line, changed


def process_file(fpath):
    """Process a single file and fix quote issues."""
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        original_lines = f.readlines()

    new_lines = []
    file_changed = False
    changes = []

    for i, line in enumerate(original_lines, 1):
        orig = line

        # Skip pure comment lines
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            new_lines.append(line)
            continue

        # Apply fixes in order
        line, c1 = fix_template_literal_mixed_quotes_in_line(line)
        line, c2 = fix_single_quoted_with_apostrophe(line)
        line, c3 = fix_jsx_mixed_quotes(line)
        line, c4 = fix_object_value_mixed_quotes(line)

        if c1 or c2 or c3 or c4:
            file_changed = True
            fix_types = []
            if c1: fix_types.append('template-mismatch')
            if c2: fix_types.append('apostrophe-in-single')
            if c3: fix_types.append('jsx-attr-mixed')
            if c4: fix_types.append('obj-val-mixed')
            changes.append((i, fix_types, orig.rstrip(), line.rstrip()))

        new_lines.append(line)

    return new_lines, file_changed, changes


def main():
    all_changes = []
    files_changed = 0

    for root, dirs, files in os.walk(SRC_DIR):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist')]

        for fname in sorted(files):
            if not fname.endswith('.tsx'):
                continue

            fpath = os.path.join(root, fname)
            new_lines, file_changed, changes = process_file(fpath)

            if file_changed:
                files_changed += 1
                rel = os.path.relpath(fpath, SRC_DIR)
                print(f"\n{'='*70}")
                print(f"FILE: {rel}")
                print(f"{'='*70}")
                for lineno, fix_types, old, new in changes:
                    print(f"  Line {lineno} [{', '.join(fix_types)}]:")
                    print(f"    OLD: {old[:150]}")
                    print(f"    NEW: {new[:150]}")

                with open(fpath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)

                all_changes.append((fpath, changes))

    print(f"\n{'='*70}")
    print(f"SUMMARY: Fixed {files_changed} file(s), total changes:")
    total = sum(len(c) for _, c in all_changes)
    print(f"  {total} line(s) modified across {files_changed} file(s)")
    print(f"{'='*70}")

    return files_changed


if __name__ == '__main__':
    count = main()
    sys.exit(0)
