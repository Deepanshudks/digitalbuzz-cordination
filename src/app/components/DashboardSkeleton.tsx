import { Skeleton } from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white"
          >
            <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
            <Skeleton variant="text" className="h-4 w-1/2 mb-4" />
            <div className="space-y-2">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <Skeleton variant="text" className="h-4 w-2/3" />
            </div>
            <Skeleton variant="text" className="h-3 w-1/3 mt-4" />
            <Skeleton
              variant="rectangular"
              className="h-10 w-full mt-4 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
