// Utility script to replace gradient classes with solid colors
// This maps common gradient patterns to solid color equivalents

const gradientReplacements = {
  // Background gradients
  'bg-gradient-to-r from-emerald-500 to-blue-500': 'bg-emerald-600',
  'bg-gradient-to-r from-emerald-400 to-blue-400': 'bg-emerald-500',
  'bg-gradient-to-r from-emerald-600 to-blue-600': 'bg-emerald-600',
  'bg-gradient-to-r from-blue-500 to-purple-500': 'bg-blue-600',
  'bg-gradient-to-r from-purple-500 to-pink-500': 'bg-purple-600',
  'bg-gradient-to-r from-red-500 to-yellow-500': 'bg-red-600',
  'bg-gradient-to-r from-emerald-500 to-emerald-600': 'bg-emerald-600',
  'bg-gradient-to-r from-blue-500 to-blue-600': 'bg-blue-600',
  'bg-gradient-to-r from-purple-500 to-purple-600': 'bg-purple-600',
  'bg-gradient-to-r from-yellow-500 to-yellow-600': 'bg-yellow-600',
  'bg-gradient-to-br from-gray-50 to-gray-100': 'bg-gray-50',
  'bg-gradient-futuristic': 'bg-slate-900',
  
  // Light background gradients
  'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20': 'bg-emerald-100',
  'bg-gradient-to-r from-blue-500/20 to-blue-600/20': 'bg-blue-100',
  'bg-gradient-to-r from-purple-500/20 to-purple-600/20': 'bg-purple-100',
  'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20': 'bg-yellow-100',
  'bg-gradient-to-r from-emerald-500/20 to-blue-500/20': 'bg-emerald-100',
  'bg-gradient-to-r from-emerald-100 to-blue-100': 'bg-emerald-100',
  
  // Text gradients - remove bg-clip-text and use solid colors
  'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent': 'text-emerald-600',
  'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent': 'text-emerald-700',
  'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent': 'text-emerald-700',
  'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent': 'text-emerald-600',
  
  // Overlay gradients
  'bg-gradient-to-t from-black/60 to-transparent': 'bg-black/60',
  'bg-gradient-to-br from-gray-900 to-gray-800': 'bg-gray-900',
};

// Function to replace gradients in a text string
function replaceGradients(content) {
  let updatedContent = content;
  
  for (const [gradient, replacement] of Object.entries(gradientReplacements)) {
    const regex = new RegExp(gradient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    updatedContent = updatedContent.replace(regex, replacement);
  }
  
  return updatedContent;
}

console.log('Gradient replacement utility created');
console.log('Available replacements:', Object.keys(gradientReplacements).length);

module.exports = { gradientReplacements, replaceGradients };
