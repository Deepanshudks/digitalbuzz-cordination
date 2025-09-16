
import "./globals.css";






export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
            {children}
<footer className="w-full bg-gray-900 text-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center sm:flex-row sm:justify-between text-sm text-center sm:text-left">
        <p className="mb-2 sm:mb-0">
          © 2025 <span className="font-semibold text-white">Anex</span>. All rights reserved.
        </p>
        <p>
          ~ Build by <span className="font-semibold text-white">Anurag</span>
        </p>
      </div>
    </footer>
        </>
  );
}
