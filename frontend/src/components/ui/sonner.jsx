import { Toaster } from 'sonner';

export const AppToaster = () => (
  <Toaster
    closeButton
    expand
    position="top-right"
    richColors
    theme="dark"
    toastOptions={{
      className: 'font-mono-ui',
    }}
  />
);