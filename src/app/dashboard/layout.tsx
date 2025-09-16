


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
            {children}
<footer className="w-full bg-zinc-300 shadow-lg text-gray-900 py-4">
      <div className="max-w-7xl px-4 flex flex-col items-center sm:flex-row sm:justify-center text-sm text-center sm:text-left">
        <p className="mb-2 text-center sm:mb-0">
          © 2025 <span className="font-semibold text-black">Digitalbuzz</span>. All rights reserved.
        </p>
        <p>
          ~ Build by <span className="font-semibold text-black">Anurag</span>
        </p>
      </div>
    </footer>
        </>
  );
}
