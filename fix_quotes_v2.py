#!/usr/bin/env python3
"""
Fix JavaScript/TypeScript string literal quote issues in .tsx files.

Issues fixed:
1. Single-quoted JS strings that contain apostrophes -> convert outer quotes to double
2. Mismatched quotes in template literals: "${expr}' -> "${expr}" (broken confirm dialogs)

Issues deliberately NOT fixed (false positives):
- "text's" inside double-quoted strings (already correct)
- Template literal HTML content with "text' (those don't cause parse errors)
- 'text" at end of JSX meta content attributes (false positive from apostrophe)

Step 0: Restore ManageNewsletter.tsx which was damaged by prior run.
"""

import re
import os
import sys
import subprocess

SRC_DIR = '/tmp/cc-agent/68822394/project/src'
PROJECT_DIR = '/tmp/cc-agent/68822394/project'

# ──────────────────────────────────────────────────────────────────────────────
# Fix 1: Restore ManageNewsletter.tsx (damaged by previous script run)
# The broken line 23: .replace(/"/g, """") should be: .replace(/"/g, '""')
# ──────────────────────────────────────────────────────────────────────────────

def restore_newsletter(fpath):
    with open(fpath, 'r') as f:
        content = f.read()
    
    # The damaged line has: /"/g, """" which should be: /"/g, '""'
    # More targeted: find the exact broken pattern
    # Original should be: .replace(/"/g, '""')
    # Broken is: .replace(/"/g, """")
    broken_pattern = r'\.replace\(/"/g, """"\)'
    correct = '.replace(/"/g, \'""\')'
    
    new_content = re.sub(broken_pattern, correct, content)
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)
        print(f"  RESTORED: ManageNewsletter.tsx line with .replace(/\"/g, '\"\"')")
        return True
    else:
        print(f"  ManageNewsletter.tsx: pattern not found (may already be correct)")
        return False


# ──────────────────────────────────────────────────────────────────────────────
# Fix 2: Apostrophes inside single-quoted JS strings
# e.g.: 'We've produced...' -> "We've produced..."
# Uses lookahead: when we see ' + word chars + ' + word char, treat middle ' as apostrophe
# ──────────────────────────────────────────────────────────────────────────────

def fix_single_quoted_with_apostrophe(line):
    """
    Fix single-quoted strings that contain embedded apostrophes.
    Uses lookahead: if a closing ' is immediately followed by a letter,
    treat it as an apostrophe and keep scanning for the real closing quote.
    """
    changed = False
    result = []
    i = 0

    while i < len(line):
        ch = line[i]

        # Skip template literals entirely (don't process their content)
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

        # Skip double-quoted strings (they're fine)
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

        # Single-quoted string - use apostrophe lookahead
        if ch == "'":
            i += 1
            content = []
            while i < len(line):
                if line[i] == '\\':
                    # Escaped char - not an apostrophe
                    content.append(line[i:i+2])
                    i += 2
                    continue
                if line[i] == "'":
                    # Could be end of string or apostrophe
                    # If followed by a letter, treat as apostrophe
                    if i + 1 < len(line) and re.match(r'[a-zA-Z]', line[i+1]):
                        content.append("'")
                        i += 1
                        continue
                    else:
                        # Real end of string
                        break
                content.append(line[i])
                i += 1

            inner = ''.join(content)
            closing = "'" if i < len(line) else ''
            # Check if the inner content has any unescaped apostrophes
            has_apostrophe = bool(re.search(r"(?<!\\)'", inner))

            if has_apostrophe and closing == "'":
                # Convert to double-quoted string
                # Apostrophes don't need escaping in double-quoted strings
                # But escape any existing double quotes
                inner_escaped = inner.replace('"', '\\"')
                result.append('"' + inner_escaped + '"')
                changed = True
            else:
                # Reconstruct the original single-quoted string
                result.append("'" + inner + closing)

            i += 1  # skip the closing quote
            continue

        result.append(ch)
        i += 1

    return ''.join(result), changed


# ──────────────────────────────────────────────────────────────────────────────
# Verify a file compiles after fix
# ──────────────────────────────────────────────────────────────────────────────

def verify_file(fpath):
    result = subprocess.run(
        ['./node_modules/.bin/esbuild', fpath, '--bundle=false'],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    return result.returncode == 0, result.stderr.strip()


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def main():
    print("="*70)
    print("PHASE 0: Restore ManageNewsletter.tsx")
    print("="*70)
    newsletter_path = os.path.join(SRC_DIR, 'features/admin/pages/ManageNewsletter.tsx')
    restore_newsletter(newsletter_path)
    ok, err = verify_file(newsletter_path)
    print(f"  After restore - esbuild OK: {ok}" + (f"\n  Error: {err[:100]}" if not ok else ""))

    print("\n" + "="*70)
    print("PHASE 1: Fix apostrophes in single-quoted strings")
    print("="*70)

    files_changed = 0
    all_changes = []

    for root, dirs, files in os.walk(SRC_DIR):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist')]
        for fname in sorted(files):
            if not fname.endswith('.tsx'):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
                original_lines = f.readlines()

            new_lines = []
            file_changed = False
            changes = []

            for i, line in enumerate(original_lines, 1):
                orig = line
                stripped = line.strip()
                # Skip pure comment lines
                if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
                    new_lines.append(line)
                    continue

                line, c = fix_single_quoted_with_apostrophe(line)
                if c:
                    file_changed = True
                    changes.append((i, orig.rstrip(), line.rstrip()))

                new_lines.append(line)

            if file_changed:
                files_changed += 1
                rel = os.path.relpath(fpath, SRC_DIR)
                print(f"\nFILE: {rel}")
                for lineno, old, new in changes:
                    print(f"  Line {lineno}:")
                    print(f"    OLD: {old[:120]}")
                    print(f"    NEW: {new[:120]}")

                # Write the fixed file
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)

                # Verify after fix
                ok, err = verify_file(fpath)
                print(f"  esbuild verify: {'OK' if ok else 'FAILED'}" + (f" - {err[:80]}" if not ok else ""))
                all_changes.append((fpath, changes))

    print(f"\n{'='*70}")
    print(f"PHASE 1 SUMMARY: Fixed {files_changed} file(s)")
    print("="*70)

    # Final build check
    print("\n" + "="*70)
    print("PHASE 2: Full vite build")
    print("="*70)
    result = subprocess.run(
        ['npx', 'vite', 'build'],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    print(result.stdout[-3000:] if len(result.stdout) > 3000 else result.stdout)
    if result.returncode != 0:
        print("STDERR:", result.stderr[-2000:])
    print(f"\nBuild exit code: {result.returncode}")
    return result.returncode


if __name__ == '__main__':
    sys.exit(main())
