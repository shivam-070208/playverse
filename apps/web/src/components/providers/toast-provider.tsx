import React, { Fragment } from 'react';
import { Toaster } from 'sonner';
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <Toaster position="top-center" />
      {children}
    </Fragment>
  );
};

export { ToastProvider };
