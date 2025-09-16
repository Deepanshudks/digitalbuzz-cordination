export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}

      <footer className="w-full bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center sm:flex-row sm:justify-between text-sm text-gray-600">
          <p className="mb-2 sm:mb-0">
            © 2025 <span className="font-semibold text-gray-900">Digitalbuzz</span>. All rights reserved.
          </p>
          <p>
            ~ Build by <span className="font-semibold text-gray-900">Anurag</span>
          </p>
        </div>
      </footer>
    </>
  );
}
