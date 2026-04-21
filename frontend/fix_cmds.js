const fs = require('fs');
const path = require('path');

const pagesDir = 'C:\\Users\\user\\Desktop\\gestion_commande_back_front\\frontend\\src\\pages';
const newFile = path.join(pagesDir, 'AdminCommandes_NEW.jsx');
const oldFile = path.join(pagesDir, 'AdminCommandes.jsx');
const backupFile = path.join(pagesDir, 'AdminCommandes_CORRUPTED.jsx');

try {
  // Read clean content
  const cleanContent = fs.readFileSync(newFile, 'utf-8');
  
  // Backup old
  fs.copyFileSync(oldFile, backupFile);
  console.log('✓ Backed up corrupted file');
  
  // Write clean
  fs.writeFileSync(oldFile, cleanContent, 'utf-8');
  console.log('✓ AdminCommandes.jsx fixed');
} catch (err) {
  console.error('Error:', err.message);
}
