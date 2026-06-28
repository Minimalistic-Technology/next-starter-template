const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/JOBPORTEL/DDTec/ddtec/next-starter-template/src');
let changedFiles = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace all relative imports and @/app imports
    // The regex ensures we catch all depths of ../ and ./
    content = content.replace(/['"](?:\.\.\/)+_context\/([^'"]+)['"]/g, "'@/context/$1'");
    content = content.replace(/['"](?:\.\/)+_context\/([^'"]+)['"]/g, "'@/context/$1'");
    content = content.replace(/['"]@\/app\/_context\/([^'"]+)['"]/g, "'@/context/$1'");

    content = content.replace(/['"](?:\.\.\/)+_components\/([^'"]+)['"]/g, "'@/components/$1'");
    content = content.replace(/['"](?:\.\/)+_components\/([^'"]+)['"]/g, "'@/components/$1'");
    content = content.replace(/['"]@\/app\/_components\/([^'"]+)['"]/g, "'@/components/$1'");

    content = content.replace(/['"](?:\.\.\/)+provider\/([^'"]+)['"]/g, "'@/providers/$1'");
    content = content.replace(/['"](?:\.\/)+provider\/([^'"]+)['"]/g, "'@/providers/$1'");
    content = content.replace(/['"]@\/app\/provider\/([^'"]+)['"]/g, "'@/providers/$1'");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log(`Updated imports in ${changedFiles} files.`);
