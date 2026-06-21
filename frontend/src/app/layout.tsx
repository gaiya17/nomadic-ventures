
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Nomadic Ventures',
  description: 'Creating Meaningful Journeys',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Suppress hydration errors caused by browser extensions (Bitwarden etc.) */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var orig = window.console.error;
            window.console.error = function() {
              var a = arguments[0];
              if (typeof a === 'string' && (
                a.indexOf('bis_skin_checked') > -1 ||
                a.indexOf('crxlauncher') > -1 ||
                a.indexOf('Hydration failed because') > -1 ||
                a.indexOf('server rendered HTML') > -1 ||
                a.indexOf('did not match') > -1
              )) return;
              return orig.apply(this, arguments);
            };
          })();
        `}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
