import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { seedLegalReferencesIfEmpty } from '@/db/seed';
import { router } from './router';
import '@/styles/tokens.css';
import '@/styles/components.css';

seedLegalReferencesIfEmpty().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
