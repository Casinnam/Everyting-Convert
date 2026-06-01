"""
Remove conflicting inline <style> blocks from tool pages.
"""
import os
import re

AFFECTED_FILES = [
    'docx to pdf/docx-to-pdf.html',
    'ebook converter/ebook-converter.html',
    'gif converter/gif-converter.html',
    'media converter/media-converter.html',
    'pdf to epub/pdf-to-epub.html',
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

for rel_path in AFFECTED_FILES:
    filepath = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(filepath):
        print(f'SKIP (not found): {rel_path}')
        continue

    # Try UTF-8 first, fallback to latin-1 (which never fails)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        enc = 'utf-8'
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='latin-1') as f:
            content = f.read()
        enc = 'latin-1'

    original = content

    def remove_conflicting_style(match):
        style_content = match.group(1)
        if '.tools-dropdown' in style_content or '.mode-grid' in style_content or '.mode-btn' in style_content:
            print(f'  Removing conflicting <style> block ({len(style_content)} chars)')
            return ''
        return match.group(0)

    content = re.sub(r'<style>(.*?)</style>', remove_conflicting_style, content, flags=re.DOTALL)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'FIXED: {rel_path}')
    else:
        print(f'NO CHANGE: {rel_path}')
