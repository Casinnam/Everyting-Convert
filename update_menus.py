import os
import re

mega_pattern = re.compile(
    r'<div class="tools-group">\s*<div class="tools-group-title"><i class="fa-regular fa-file-lines"></i> PDF & Documents</div>.*?</div>',
    re.DOTALL
)

footer_pattern = re.compile(
    r'<div class="footer-group">\s*<h2><i class="fa-regular fa-file-lines"></i> PDF & Documents</h2>.*?</div>',
    re.DOTALL
)

count = 0
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            rel_path = os.path.relpath(root, '.')
            if rel_path == '.':
                prefix = ''
            else:
                depth = len(rel_path.split(os.sep))
                prefix = '../' * depth

            mega_replacement = f"""<div class="tools-group">
                        <div class="tools-group-title"><i class="fa-solid fa-file-export"></i> PDF Convert</div>
                        <a href="{prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
                        <a href="{prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
                        <a href="{prefix}pdf to excel/pdf-to-excel.html">PDF to Excel</a>
                        <a href="{prefix}image to pdf/image-to-pdf.html">Image to PDF</a>
                        <a href="{prefix}excel to pdf/excel-to-pdf.html">Excel to PDF</a>
                        <a href="{prefix}docx to pdf/docx-to-pdf.html">DOCX to PDF</a>
                        <a href="{prefix}pdf to epub/pdf-to-epub.html">PDF to EPUB</a>
                        <a href="{prefix}ebook converter/ebook-converter.html">Ebook Converter</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-title"><i class="fa-solid fa-wrench"></i> PDF Tools</div>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=merge">Merge PDF</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=compress">Compress PDF</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=split">Split PDF</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=rotate">Rotate PDF</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=remove">Remove Pages</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=extract">Extract Pages</a>
                        <a href="{prefix}pdf tools/pdf-tools.html?mode=organize">Organize PDF</a>
                    </div>"""

            footer_replacement = f"""<div class="footer-group">
                <h2><i class="fa-solid fa-file-export"></i> PDF Convert</h2>
                <a href="{prefix}pdf to word/pdf-to-word.html">PDF to Word</a>
                <a href="{prefix}pdf to jpg/pdf-to-jpg.html">PDF to JPG</a>
                <a href="{prefix}pdf to excel/pdf-to-excel.html">PDF to Excel</a>
                <a href="{prefix}image to pdf/image-to-pdf.html">Image to PDF</a>
                <a href="{prefix}excel to pdf/excel-to-pdf.html">Excel to PDF</a>
                <a href="{prefix}docx to pdf/docx-to-pdf.html">DOCX to PDF</a>
                <a href="{prefix}pdf to epub/pdf-to-epub.html">PDF to EPUB</a>
                <a href="{prefix}ebook converter/ebook-converter.html">Ebook Converter</a>
            </div>
            <div class="footer-group">
                <h2><i class="fa-solid fa-wrench"></i> PDF Tools</h2>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=merge">Merge PDF</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=compress">Compress PDF</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=split">Split PDF</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=rotate">Rotate PDF</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=remove">Remove Pages</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=extract">Extract Pages</a>
                <a href="{prefix}pdf tools/pdf-tools.html?mode=organize">Organize PDF</a>
            </div>"""

            orig = content
            content = mega_pattern.sub(mega_replacement, content)
            content = footer_pattern.sub(footer_replacement, content)
            if orig != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1

print(f'Updated {count} HTML files.')
