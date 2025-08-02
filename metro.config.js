const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config; 