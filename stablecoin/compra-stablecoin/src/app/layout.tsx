import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
  <body className="min-h-screen antialiased">
    {children}
    <script src="/metamask-detection.js"></script>
  </body>
</html>
  );
}