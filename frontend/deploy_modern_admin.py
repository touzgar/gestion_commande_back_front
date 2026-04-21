
#!/usr/bin/env python3
"""
Final deployment script to copy all modern admin page designs
"""
import shutil
import os
from pathlib import Path

frontend_path = Path(r'C:\Users\user\Desktop\gestion_commande_back_front\frontend\src\pages')

files_to_update = [
    ('AdminProduits_NEW.jsx', 'AdminProduits.jsx'),
    ('AdminCategories_NEW.jsx', 'AdminCategories.jsx'),
    ('AdminCommandes_NEW.jsx', 'AdminCommandes.jsx'),
]

print('🚀 Deploying modern admin interface designs...\n')

for new_file, target_file in files_to_update:
    new_path = frontend_path / new_file
    target_path = frontend_path / target_file
    backup_path = frontend_path / f'{target_file.replace(".jsx", "_BKUP.jsx")}'
    
    if new_path.exists():
        # Create backup
        if target_path.exists():
            shutil.copy(str(target_path), str(backup_path))
            print(f'  ✓ Backed up {target_file} → {backup_path.name}')
        
        # Deploy new version
        shutil.copy(str(new_path), str(target_path))
        print(f'  ✓ Deployed {new_file} → {target_file}')
    else:
        print(f'  ✗ Warning: {new_file} not found')

print('\n✅ Modern admin interface deployment complete!')
print('\n📋 Summary of changes:')
print('  • AdminProduits.jsx - Dark glassmorphism with emerald accents')
print('  • AdminCategories.jsx - Dark theme with category cards grid')
print('  • AdminCommandes.jsx - Dark table layout with modern modal')
print('\nAll admin pages now feature:')
print('  • Dark slate backgrounds (slate-900/800)')
print('  • Emerald accent colors (emerald-500/400/300)')
print('  • Backdrop blur effects (backdrop-blur-xl)')
print('  • Modern card designs with semi-transparent borders')
print('  • Smooth transitions and hover effects')
print('  • Premium glassmorphism aesthetic')
