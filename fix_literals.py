import os
import glob

def fix_literals():
    files = glob.glob('d:/@venky/updates/off completeed/ecommerce/frontend/src/**/*.tsx', recursive=True)
    files.extend(glob.glob('d:/@venky/updates/off completeed/ecommerce/frontend/src/**/*.ts', recursive=True))
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        if '₹{' in content:
            new_content = content.replace('₹{', '${')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Fixed {f}")

if __name__ == '__main__':
    fix_literals()
