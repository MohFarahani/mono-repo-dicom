// ThemeRegistry.tsx
'use client';

import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';

// Create cache outside component to avoid recreating it on each render
const createEmotionCache = () => {
  return createCache({
    key: 'css',
    prepend: true,
  });
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [emotionCache] = useState(createEmotionCache);

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${emotionCache.key} ${Object.keys(emotionCache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(emotionCache.inserted).join(' '),
        }}
      />
    );
  });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}