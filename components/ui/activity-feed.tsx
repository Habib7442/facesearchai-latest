"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Search, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: 'search' | 'error' | 'subscription';
  description: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-700">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.description}
              </p>
              {activity.details && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activity.details}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(activity.timestamp), 'PPp')}
              </p>
            </div>
          </motion.div>
        ))}

        {activities?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </Card>
  );
} 