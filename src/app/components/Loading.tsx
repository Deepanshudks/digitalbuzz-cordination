export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-digitalbuzz-yellow mx-auto mb-4"></div>
        <div className="bg-digitalbuzz-yellow text-digitalbuzz-black px-6 py-3 rounded-lg font-bold text-2xl inline-block mb-4">
          digital<span className="font-normal">buzz</span>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
