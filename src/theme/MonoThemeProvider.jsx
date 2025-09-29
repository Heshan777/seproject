// src/theme/MonoThemeProvider.jsx
import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { deepmerge } from '@mui/utils';

const LIGHT = 'light';
const DARK = 'dark';
const STORAGE_KEY = 'internlink-mono-mode';

/** Base tokens shared by both modes */
const baseTokens = {
  shape: { borderRadius: 16 },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '12px 18px',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
          '&.Mui-focusVisible': {
            outline: '3px solid rgba(0,0,0,0.35)',
            outlineOffset: 2,
          },
        },
      },
    },
  },
};

/** Strict black & white palettes (no hues) */
const light = {
  palette: {
    mode: 'light',
    primary: { main: '#000000' }, // black as primary
    secondary: { main: '#000000' },
    text: { primary: '#000000', secondary: 'rgba(0,0,0,0.70)' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    divider: 'rgba(0,0,0,0.12)',
  },
};

const dark = {
  palette: {
    mode: 'dark',
    primary: { main: '#FFFFFF' }, // white as primary
    secondary: { main: '#FFFFFF' },
    text: { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.72)' },
    background: { default: '#000000', paper: '#0D0D0D' },
    divider: 'rgba(255,255,255,0.16)',
  },
};

function makeTheme(mode) {
  return createTheme(deepmerge(baseTokens, mode === DARK ? { palette: dark.palette } : { palette: light.palette }));
}

const ThemeModeContext = React.createContext({ mode: LIGHT, toggle: () => {}, setMode: () => {} });
export const useMonoTheme = () => React.useContext(ThemeModeContext);

export default function MonoThemeProvider({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });

  const [mode, setMode] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === LIGHT || saved === DARK) return saved;
    return prefersDark ? DARK : LIGHT;
  });

  const value = React.useMemo(
    () => ({
      mode,
      setMode: (m) => {
        localStorage.setItem(STORAGE_KEY, m);
        setMode(m);
      },
      toggle: () =>
        setMode((prev) => {
          const next = prev === LIGHT ? DARK : LIGHT;
          localStorage.setItem(STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode]
  );

  const theme = React.useMemo(() => makeTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
