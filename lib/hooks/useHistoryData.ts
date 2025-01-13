"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setHistoryLoading, setHistoryItems, setHasMore, appendHistoryItems, clearHistory } from '@/store/slices/historySlice';
import type { DateRange } from 'react-day-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { historyService } from '../history-service';

export function useHistoryData(itemsPerPage: number) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDateRange, setCurrentDateRange] = useState<DateRange | undefined>();
  
  const history = useSelector((state: RootState) => state.history.items);
  const isLoading = useSelector((state: RootState) => state.history.isLoading);
  const hasMore = useSelector((state: RootState) => state.history.hasMore);

  const loadHistory = useCallback(async (
    page: number = currentPage,
    dateRange?: DateRange
  ) => {
    try {
      dispatch(setHistoryLoading(true));
      
      // Call the history service to fetch data
      const response = await historyService.getHistory(page, itemsPerPage, dateRange);
      
      // Use different actions for initial load vs pagination
      if (page === 1) {
        dispatch(setHistoryItems(response.data));
      } else {
        dispatch(appendHistoryItems(response.data));
      }
      
      dispatch(setHasMore(response.hasMore));
      
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      dispatch(setHistoryLoading(false));
    }
  }, [currentPage, dispatch, router, itemsPerPage]);

  // Add useEffect to load initial data
  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  const filterByDate = useCallback(async (range: DateRange) => {
    try {
      setCurrentDateRange(range);
      dispatch(setHistoryLoading(true));
      
      // Clear existing items before loading filtered results
      dispatch(clearHistory());
      
      // Make API call with date range
      const response = await historyService.getHistory(1, itemsPerPage, range);
      
      // Set new filtered results
      dispatch(setHistoryItems(response.data));
      dispatch(setHasMore(response.hasMore));
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Error filtering history by date:', error);
    } finally {
      dispatch(setHistoryLoading(false));
    }
  }, [dispatch, router, itemsPerPage]);

  const clearFilters = useCallback(async () => {
    try {
      setCurrentDateRange(undefined);
      dispatch(setHistoryLoading(true));
      
      // Clear existing items
      dispatch(clearHistory());
      
      // Load fresh history without date range
      const response = await historyService.getHistory(1, itemsPerPage);
      
      dispatch(setHistoryItems(response.data));
      dispatch(setHasMore(response.hasMore));
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      dispatch(setHistoryLoading(false));
    }
  }, [dispatch, router, itemsPerPage]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await loadHistory(nextPage, currentDateRange);
    }
  }, [currentPage, isLoading, hasMore, loadHistory, currentDateRange]);

  return {
    history,
    isLoading,
    hasMore,
    loadMore,
    filterByDate,
    clearFilters,
    currentDateRange
  };
} 