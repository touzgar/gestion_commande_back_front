#!/usr/bin/env python3
import shutil

frontend_path = r'C:\Users\user\Desktop\gestion_commande_back_front\frontend\src\pages'

# Replace AdminCategories.jsx
shutil.copy(f'{frontend_path}\\AdminCategories.jsx', f'{frontend_path}\\AdminCategories_OLD2.jsx')
shutil.copy(f'{frontend_path}\\AdminCategories_NEW.jsx', f'{frontend_path}\\AdminCategories.jsx')
print('✓ AdminCategories.jsx replaced with modern version')

# Replace AdminCommandes.jsx  
shutil.copy(f'{frontend_path}\\AdminCommandes.jsx', f'{frontend_path}\\AdminCommandes_OLD2.jsx')
shutil.copy(f'{frontend_path}\\AdminCommandes_NEW.jsx', f'{frontend_path}\\AdminCommandes.jsx')
print('✓ AdminCommandes.jsx replaced with modern version')

print('\n✓ Both files have been successfully updated!')
