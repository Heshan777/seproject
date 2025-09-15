// src/theme/ThemeModeProvider.jsx
import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { deepmerge } from '@mui/utils';

const LIGHT = 'light';
const DARK = 'dark';
const STORAGE_KEY = 'internlink-color-mode';

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
            outline: '3px solid rgba(31,91,255,0.35)',
            outlineOffset: 2,
          },
        },
      },
    },
  },
};

const light = {
  palette: {
    mode: 'light',
    primary: { main: '#1F5BFF' },
    success: { main: '#16A34A' },
    text: { primary: '#0B1020', secondary: 'rgba(11,16,32,0.72)' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    divider: 'rgba(12,20,33,0.10)',
  },
};

const dark = {
  palette: {
    mode: 'dark',
    primary: { main: '#7DA2FF' },
    success: { main: '#4ADE80' },
    text: { primary: '#E8EDF8', secondary: 'rgba(232,237,248,0.74)' },
    background: { default: '#0B1020', paper: '#111827' },
    divider: 'rgba(255,255,255,0.12)',
  },
};

function makeTheme(mode) {
  return createTheme(deepmerge(baseTokens, mode === DARK ? { palette: dark.palette } : { palette: light.palette }));
}

const ThemeModeContext = React.createContext({
  mode: LIGHT,
  toggle: () => {},
  setMode: () => {},
});

export const useThemeMode = () => React.useContext(ThemeModeContext);

export default function ThemeModeProvider({ children }) {
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
