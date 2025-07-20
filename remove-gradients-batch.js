#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Comprehensive gradient pattern replacements
const gradientReplacements = [
  // Text gradients - most common patterns from the codebase
  {
    pattern: /bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent/g,
    replacement: 'text-emerald-600'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent/g,
    replacement: 'text-emerald-600'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent/g,
    replacement: 'text-emerald-700'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent/g,
    replacement: 'text-emerald-700'
  },
  
  // Background gradients
  {
    pattern: /bg-gradient-to-r from-emerald-500 to-blue-500/g,
    replacement: 'bg-emerald-600'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-400 to-blue-400/g,
    replacement: 'bg-emerald-500'
  },
  {
    pattern: /bg-gradient-to-r from-blue-500 to-purple-500/g,
    replacement: 'bg-blue-600'
  },
  {
    pattern: /bg-gradient-to-r from-purple-500 to-pink-500/g,
    replacement: 'bg-purple-600'
  },
  {
    pattern: /bg-gradient-to-r from-red-500 to-yellow-500/g,
    replacement: 'bg-red-600'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-500 to-emerald-600/g,
    replacement: 'bg-emerald-600'
  },
  {
    pattern: /bg-gradient-to-r from-blue-500 to-blue-600/g,
    replacement: 'bg-blue-600'
  },
  {
    pattern: /bg-gradient-to-r from-purple-500 to-purple-600/g,
    replacement: 'bg-purple-600'
  },
  {
    pattern: /bg-gradient-to-r from-yellow-500 to-yellow-600/g,
    replacement: 'bg-yellow-600'
  },
  
  // Light background gradients
  {
    pattern: /bg-gradient-to-r from-emerald-500\/20 to-emerald-600\/20/g,
    replacement: 'bg-emerald-100'
  },
  {
    pattern: /bg-gradient-to-r from-blue-500\/20 to-blue-600\/20/g,
    replacement: 'bg-blue-100'
  },
  {
    pattern: /bg-gradient-to-r from-purple-500\/20 to-purple-600\/20/g,
    replacement: 'bg-purple-100'
  },
  {
    pattern: /bg-gradient-to-r from-yellow-500\/20 to-yellow-600\/20/g,
    replacement: 'bg-yellow-100'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-500\/20 to-blue-500\/20/g,
    replacement: 'bg-emerald-100'
  },
  {
    pattern: /bg-gradient-to-r from-emerald-100 to-blue-100/g,
    replacement: 'bg-emerald-100'
  },
  
  // Complex background gradients
  {
    pattern: /bg-gradient-to-br from-gray-50 to-gray-100/g,
    replacement: 'bg-gray-50'
  },
  {
    pattern: /bg-gradient-to-br from-gray-900 to-gray-800/g,
    replacement: 'bg-gray-900'
  },
  {
    pattern: /bg-gradient-futuristic/g,
    replacement: 'bg-slate-900'
  },
  
  // Overlay gradients
  {
    pattern: /bg-gradient-to-t from-black\/60 to-transparent/g,
    replacement: 'bg-black/60'
  },
];

// Files to process
const filesToProcess = [
  'src/pages/Index.tsx',
  'src/pages/About.tsx', 
  'src/pages/Contacts.tsx',
  'src/pages/Media.tsx',
  'src/pages/Blog.tsx',
  'src/components/modals/ChargingStationSelectorModal.tsx',
  'src/components/modals/MenuModal.tsx',
  'src/components/modals/ReservationModal.tsx',
  'src/components/forms/SubmitReviewForm.tsx',
  'src/components/admin/ContactsManager.tsx'
];

async function removeGradientsFromFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let hasChanges = false;
    
    // Apply all gradient replacements
    for (const { pattern, replacement } of gradientReplacements) {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      if (content !== originalContent) {
        hasChanges = true;
        console.log(`✓ Replaced gradient in ${filePath}`);
      }
    }
    
    if (hasChanges) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`ℹ️  No gradients found in ${filePath}`);
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🎨 Starting gradient removal...\n');
  
  let totalFilesChanged = 0;
  
  for (const filePath of filesToProcess) {
    const changed = await removeGradientsFromFile(filePath);
    if (changed) totalFilesChanged++;
  }
  
  console.log(`\n🎉 Gradient removal complete!`);
  console.log(`📊 Files changed: ${totalFilesChanged}/${filesToProcess.length}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { removeGradientsFromFile, gradientReplacements };
