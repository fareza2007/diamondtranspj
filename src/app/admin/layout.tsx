export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#040404] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
