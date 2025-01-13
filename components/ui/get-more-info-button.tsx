"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectSelectedImages } from "@/store/slices/selectedImagesSlice";
import { selectSearchResults } from "@/store/slices/searchResultsSlice";

export function GetMoreInfoButton() {
  const router = useRouter();
  const selectedImages = useSelector(selectSelectedImages);
  const searchResults = useSelector(selectSearchResults);

  const handleGetMoreInfo = useCallback(async () => {
    try {
      if (selectedImages.length === 0) {
        toast.error("Please select at least one image to analyze");
        return;
      }

      if (!searchResults.searchId) {
        toast.error("No active search session found");
        return;
      }

      // Navigate to the info page with the search ID
      router.push(`/search/${searchResults.searchId}`);

    } catch (error) {
      console.error("Error navigating to info page:", error);
      toast.error("Failed to load detailed analysis");
    }
  }, [selectedImages.length, searchResults.searchId, router]);

  // Only render if there are selected images
  if (selectedImages.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        onClick={handleGetMoreInfo}
        className="btn-primary rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        size="lg"
      >
        <Info className="h-5 w-5" />
        <span>Get More Info</span>
        <span className="ml-1 px-2 py-0.5 bg-white/10 rounded-full text-sm">
          {selectedImages.length}
        </span>
      </Button>
    </motion.div>
  );
} 