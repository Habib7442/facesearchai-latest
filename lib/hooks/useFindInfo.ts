// hooks/useFindInfo.ts
import { useState } from 'react';
import { toast } from 'sonner';
import clientAxios from '@/lib/axios/client';


interface SearchResult {
  adultContent: boolean;
  group: number;
  sourceUrl: string;
  imageUrl: string;
}

interface FindInfoResponse {
  message: string;
  search_history_id: string;
  gpt_result: {
    error?: string;
    details?: string;
  };
  search_results: SearchResult[];
  hasMore: boolean;
  total_groups: number;
}

interface PaginationOptions {
  page: number;
  groupsToLoad: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useFindInfo() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FindInfoResponse | null>(null);

  const findInfo = async (
    searchId: string, 
    selectedImages: string[], 
    pagination?: PaginationOptions,
    retryCount = 0
  ) => {
    try {
      setLoading(true);

      const sources = selectedImages.map(imageUrl => ({
        source_url: imageUrl,
        source_image_url: imageUrl
      }));

      const response = await clientAxios.post<FindInfoResponse>(
        '/api/find_info',
        {
          uuid: searchId,
          sources,
          pagination: pagination || { page: 1, groupsToLoad: 10 }
        },
        {
          timeout: 50000
        }
      );

      setResults(response.data);
      
      if (pagination?.page === 1) {
        toast.success('Information retrieved successfully');
      }
      
      return response.data;

    } catch (error: any) {
      console.error('Find info error:', error);
      
      if ((error.code === 'ECONNABORTED' || error.response?.status === 504) && retryCount < MAX_RETRIES) {
        toast.info(`Request timed out, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return findInfo(searchId, selectedImages, pagination, retryCount + 1);
      }
      
      toast.error(
        error.response?.data?.error || 
        'Failed to get additional information'
      );
      throw error;

    } finally {
      setLoading(false);
    }
  };

  return {
    findInfo,
    loading,
    results
  };
}