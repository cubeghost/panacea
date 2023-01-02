import chroma from 'chroma-js';

const TEXT_COLORS = ['#ffffff', '#000000'];

export const getTextColorForBackground = (backgroundColor: string) => {
  const contrasts = TEXT_COLORS.map((color) => chroma.contrast(backgroundColor, color));
  const winnerIndex = contrasts.indexOf(Math.max(...contrasts));
  return TEXT_COLORS[winnerIndex];
};
