import { LinearProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="min-h-[93vh] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="bg-digitalbuzz-yellow text-digitalbuzz-black px-6 py-3 rounded-lg font-bold text-2xl text-zinc-700 capitalize inline-block mb-4">
          digital<span className="font-normal text-yellow-500">buzz</span>
        </div>
        <p className="text-gray-600">
          <LinearProgress color="inherit" />{" "}
        </p>
      </div>
    </div>
  );
}
