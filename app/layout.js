'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Material-UI dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1C83E1',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#0e1117',
      paper: '#262730',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>WA Real Estate AI Analytics</title>
        <meta name="description" content="ML-powered real estate valuation for Washington State" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
