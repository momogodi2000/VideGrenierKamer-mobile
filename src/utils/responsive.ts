import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsive = {
  isSmallDevice: width < 375,
  window: {
    width,
    height,
  },
  isPortrait: height > width,
  
  // Responsive font sizes
  getFontSize: (size: number) => {
    const baseWidth = 375; // iPhone X width
    const scale = width / baseWidth;
    const newSize = size * scale;
    return Math.round(newSize);
  },

  // Responsive spacing
  getSpacing: (space: number) => {
    const baseWidth = 375;
    const scale = width / baseWidth;
    return Math.round(space * scale);
  },

  // Grid layout helpers
  getColumnWidth: (columns: number, spacing: number) => {
    const totalSpacing = (columns - 1) * spacing;
    return (width - totalSpacing) / columns;
  },
};
