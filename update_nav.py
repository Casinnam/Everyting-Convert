import os
import glob
import re

for filepath in glob.glob('**/*.html', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex 1: find Pricing link followed by search label, insert closing nav and opening div
    pattern = re.compile(r'(<a href="[^"]*pricing\.html"(?: data-language="navPricing")?>Pricing</a>\s*)\n(\s*<label class="ec-tool-search")', re.IGNORECASE)
    new_content = pattern.sub(r'\1\n      </nav>\n      <div class="top-actions">\n\2', content)
    
    # regex 2: find Try Pro link followed by closing nav, replace closing nav with closing div
    pattern2 = re.compile(r'(<a class="ec-try-pro" href="[^"]*pricing\.html">Try Pro</a>\s*)\n(\s*)</nav>', re.IGNORECASE)
    new_content = pattern2.sub(r'\1\n\2</div>', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')
