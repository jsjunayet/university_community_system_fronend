import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import React from "react";

interface LoadingPageProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading content...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white/80 ${
        fullScreen ? "fixed inset-0 z-50" : "min-h-[400px]"
      }`}
    >
      <div className="text-center p-6 max-w-md">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full  flex items-center justify-center mx-auto">
            <Loader className="h-8 w-8  animate-spin" />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-transparent via-street-yellow to-transparent"></div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>

        <div className="space-y-2 max-w-xs mx-auto">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6 mx-auto" />
          <Skeleton className="h-3 w-4/6 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
