"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CustomAlertProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

export function CustomAlert({ 
  title, 
  description, 
  actionLabel, 
  actionPath 
}: CustomAlertProps) {
  const router = useRouter();

  return (
    <Alert variant="destructive" className="max-w-xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between mt-2">
        <span>{description}</span>
        {actionLabel && actionPath && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(actionPath)}
            className="ml-4"
          >
            {actionLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
} 