import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Card } from "@mui/material";

export default function TaskCardSkeleton() {
  return (
    <Card className="p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="40%" height={20} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={20} />
        </div>
      </div>

      <div className=" rounded-md p-3 mb-4">
        <Skeleton variant="text" width="50%" height={20} />
        <Skeleton variant="text" width="90%" height={16} />
      </div>

      <Skeleton variant="text" width="40%" height={16} />
    </Card>
  );
}
