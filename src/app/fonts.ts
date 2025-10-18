import localFont from 'next/font/local';

// Local Font: Example (place your font file in public/fonts/)
export const localGeorama = localFont({
  src: '../../public/fonts/georama_orig.ttf', // Adjust the path and filename as needed
  variable: '--font-local'
});

export const localGotham = localFont({
  src: '../../public/fonts/Gotham Fonts Family/Gotham-Medium.otf', // Adjust the path and filename as needed
  variable: '--font-local'
});

export const localGeorgia = localFont({
  src: '../../public/fonts/georgia.ttf', // Adjust the path and filename as needed
  variable: '--font-local'
});

export const localGeorgiaItalic = localFont({
  src: '../../public/fonts/georgiai.ttf', // Adjust the path and filename as needed
  variable: '--font-local'
});
