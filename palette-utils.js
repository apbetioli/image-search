import ColorThief from "colorthief";
import sharp from "sharp";
import tinycolor from "tinycolor2";

//await getPaletteImageBuffer64("test.jpg", true);

export async function getPaletteImageBuffer64(src, savePalette = false) {
  const numberOfColors = 4;

  let palette = await ColorThief.getPalette(src, numberOfColors);
  palette = sortColorsByLuminance(palette);
  const flat = palette.flatMap((color) => color);

  const input = Uint8Array.from(flat); // or Uint8ClampedArray
  let image = sharp(input, {
    // because the input does not contain its dimensions or how many channels it has
    // we need to specify it in the constructor options
    raw: {
      width: numberOfColors,
      height: 1,
      channels: 3,
    },
  });
  // Resize to 2 pixels to avoid error with clip model
  image = image.resize({
    height: 2,
    width: numberOfColors,
  });
  if (savePalette) {
    await image.toFile("palette/" + src + ".palette.png");
  }
  const buffer = await image.png().toBuffer();
  return buffer.toString("base64");
}

function step(color, repetitions = 1) {
  const lum = tinycolor(color).getLuminance();

  const { h, s, v } = tinycolor(color).toHsv();

  let h2 = Number(h * repetitions);
  let lum2 = Number(lum * repetitions);
  let v2 = Number(v * repetitions);

  if (h2 % 2 == 1) {
    v2 = repetitions - v2;
    lum2 = repetitions - lum2;
  }

  return [h2, lum2, v2];
}

function getLuminance(color) {
  return tinycolor(`rgb(${color[0]},${color[1]},${color[2]})`).getLuminance();
}

export function sortColors(colors) {
  const rgbColors = colors.map(
    (color) => `rgb(${color[0]},${color[1]},${color[2]})`
  );
  return rgbColors
    .sort((a, b) => {
      const c1 = step(a, 8);
      const c2 = step(b, 8);
      return Math.sqrt(
        Math.pow(c1[0] - c2[0], 2) +
          Math.pow(c1[1] - c2[1], 2) +
          Math.pow(c1[2] - c2[2], 2)
      );
    })
    .map((color) => {
      const [r, g, b] = color.match(/\d+/g).map(Number);
      return [r, g, b];
    });
}

export function sortColorsByLuminance(colors) {
  return colors.sort((a, b) => getLuminance(a) - getLuminance(b));
}

export const getPaletteVector = async (imagePath) => {
  const palette = await ColorThief.getPalette(imagePath, 5);

  const colors = sortColors(palette);

  const vector = colors.flatMap((color) => {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    return [r / 255, g / 255, b / 255];
  });

  return vector;
};
