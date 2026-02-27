import { Code } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <Code className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-green-200 border-t-green-600 rounded-2xl animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            Loading <span className="text-green-600">DevCollab</span>
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
