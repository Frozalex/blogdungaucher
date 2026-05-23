/**
 * Tokens design alignés sur blog-gaucher/src/styles/global.css et
 * remotion/src/theme.ts pour garder une identité visuelle homogène
 * entre le site, les courtes vidéos Remotion et les longues vidéos Motion Canvas.
 */
export const theme = {
  // Fonds (mode clair)
  bg: "#fcfaf6",
  bgWarm: "#f6f1e9",
  surface: "#ffffff",
  surfaceWarm: "rgba(218, 196, 152, 0.12)",

  // Texte
  textMain: "#18181b",
  textMuted: "rgba(24, 24, 27, 0.66)",
  textDim: "rgba(24, 24, 27, 0.42)",

  // Accent principal (signature blog)
  green: "#3d8b37",
  greenLight: "rgba(61, 139, 55, 0.12)",

  // Couleurs rubriques (alignées sur categoryMap dans src/data/site.ts)
  scienceAccent: "#5b9fd4",
  espritAccent: "#f0a050",
  societeAccent: "#a76b9e",
  grandOralAccent: "#d4a85b",

  // Échiquier : palette éditoriale, plus douce que les bois classiques
  boardLight: "#e8d9b8",
  boardDark: "#a98763",
  boardBorder: "#1e1e1e",
  boardHighlight: "rgba(61, 139, 55, 0.45)",

  // Typographie
  fontDisplay: '"Space Grotesk", system-ui, sans-serif',
  fontBody: '"Outfit", system-ui, sans-serif',
  fontSerif: '"Fraunces", Georgia, serif',
  fontPiece: '"DejaVu Sans", "Apple Symbols", system-ui, serif',
} as const;
