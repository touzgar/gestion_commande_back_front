#!/usr/bin/env python3
import shutil
from pathlib import Path

frontend_path = Path(r'C:\Users\user\Desktop\gestion_commande_back_front\frontend\src\pages')

# Read the clean NEW file
new_file_path = frontend_path / 'AdminCommandes_NEW.jsx'
with open(new_file_path, 'r', encoding='utf-8') as f:
    clean_content = f.read()

# Backup current corrupted file
old_file_path = frontend_path / 'AdminCommandes.jsx'
backup_path = frontend_path / 'AdminCommandes_CORRUPTED.jsx'
shutil.copy(str(old_file_path), str(backup_path))

# Write clean content
with open(old_file_path, 'w', encoding='utf-8') as f:
    f.write(clean_content)

print('✓ AdminCommandes.jsx fixed')
print('✓ Corrupted version backed up to AdminCommandes_CORRUPTED.jsx')
