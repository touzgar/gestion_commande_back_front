#!/usr/bin/env python3
import shutil
import os

frontend_path = r'C:\Users\user\Desktop\gestion_commande_back_front\frontend\src\pages'

# Read the NEW file content
new_commandes_path = os.path.join(frontend_path, 'AdminCommandes_NEW.jsx')
with open(new_commandes_path, 'r', encoding='utf-8') as f:
    new_content = f.read()

# Backup old file
old_commandes_path = os.path.join(frontend_path, 'AdminCommandes.jsx')
backup_path = os.path.join(frontend_path, 'AdminCommandes_BACKUP.jsx')
shutil.copy(old_commandes_path, backup_path)

# Write new content to old file
with open(old_commandes_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✓ AdminCommandes.jsx successfully replaced')
