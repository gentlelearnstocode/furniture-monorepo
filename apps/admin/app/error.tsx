"use client";

import { useEffect } from "react";
import { Button } from "@repo/ui/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@repo/ui/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin App Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            An unexpected error has occurred while processing your request.
          </p>
          <div className="bg-red-50 p-3 rounded-md text-left">
             <p className="text-xs font-mono text-red-600 break-all">
                {error.message || "Unknown error"}
             </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-2">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
