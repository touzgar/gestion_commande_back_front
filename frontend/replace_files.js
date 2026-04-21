const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\user\\Desktop\\gestion_commande_back_front\\frontend\\src\\pages';

// Replace AdminCategories
const categoriesOld = path.join(sourceDir, 'AdminCategories.jsx');
const categoriesNew = path.join(sourceDir, 'AdminCategories_NEW.jsx');
const categoriesBak = path.join(sourceDir, 'AdminCategories_OLD.jsx');

if (fs.existsSync(categoriesOld)) {
  fs.copyFileSync(categoriesOld, categoriesBak);
  console.log('Backed up AdminCategories.jsx');
}
fs.copyFileSync(categoriesNew, categoriesOld);
console.log('Replaced AdminCategories.jsx with modern version');

// Replace AdminCommandes
const commandesOld = path.join(sourceDir, 'AdminCommandes.jsx');
const commandesNew = path.join(sourceDir, 'AdminCommandes_NEW.jsx');
const commandesBak = path.join(sourceDir, 'AdminCommandes_OLD.jsx');

if (fs.existsSync(commandesOld)) {
  fs.copyFileSync(commandesOld, commandesBak);
  console.log('Backed up AdminCommandes.jsx');
}
fs.copyFileSync(commandesNew, commandesOld);
console.log('Replaced AdminCommandes.jsx with modern version');

console.log('Done! Both files have been replaced with modern versions.');
