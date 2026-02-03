import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import '@workspace/ui/globals.css';
import { ToastProvider } from '@/components/providers/toast-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
const fontRyzes = localFont({
  src: [
    {
      path: '../assets/font/Ryzes-ax92x.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-local-ryzes',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontRyzes.variable} font-sans antialiased `}
      >
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
