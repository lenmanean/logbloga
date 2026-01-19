'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Key, Heart, UserCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem } from '@/lib/db/account-stats';

interface ActivityFeedProps {
  activities: ActivityItem[];
  limit?: number;
}

export function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return Package;
      case 'license':
        return Key;
      case 'wishlist':
        return Heart;
      case 'profile':
        return UserCircle;
      default:
        return Package;
    }
  };

  const getActivityColor = (type: ActivityItem['type']): string => {
    switch (type) {
      case 'order':
        return 'text-blue-500';
      case 'license':
        return 'text-green-500';
      case 'wishlist':
        return 'text-red-500';
      case 'profile':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);
            const activityDate = new Date(activity.date);
            const timeAgo = formatDistanceToNow(activityDate, { addSuffix: true });

            return (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={`flex-shrink-0 ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                    </div>
                    {activity.link && (
                      <Link href={activity.link}>
                        <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

