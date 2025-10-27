import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Check, X, Calendar, Users, Briefcase, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Interview Scheduled',
    message: 'Sarah Wilson has an interview scheduled for tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high',
    icon: <Calendar className="w-4 h-4" />,
    action: {
      label: 'View Calendar',
      onClick: () => toast.success('Opening calendar...')
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'New Application',
    message: '3 new candidates applied for Frontend Developer position',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: 'medium',
    icon: <Users className="w-4 h-4" />,
    action: {
      label: 'Review Applications',
      onClick: () => toast.success('Opening applications...')
    }
  },
  {
    id: '3',
    type: 'success',
    title: 'Candidate Hired',
    message: 'John Doe has accepted the offer for Backend Developer role',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'high',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    id: '4',
    type: 'warning',
    title: 'Pending Review',
    message: '5 candidates are waiting for technical assessment review',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'medium',
    icon: <AlertTriangle className="w-4 h-4" />,
    action: {
      label: 'Review Now',
      onClick: () => toast.success('Opening assessments...')
    }
  },
  {
    id: '5',
    type: 'info',
    title: 'Job Post Expiring',
    message: 'Frontend Developer job posting expires in 3 days',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    icon: <Briefcase className="w-4 h-4" />,
    action: {
      label: 'Extend Posting',
      onClick: () => toast.success('Extending job post...')
    }
  }
];

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50/50';
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50/50';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50/50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50/50';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-white" />
        ) : (
          <Bell className="h-5 w-5 text-white" />
        )}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-[500px] z-50 shadow-2xl border-none bg-white/95 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Smart Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:bg-primary/10"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications
                  .sort((a, b) => {
                    // Sort by priority first, then by timestamp
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    }
                    return b.timestamp.getTime() - a.timestamp.getTime();
                  })
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-slate-50 transition-colors cursor-pointer',
                        getNotificationStyle(notification.type),
                        !notification.read && 'bg-slate-50/80'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-1', getNotificationIcon(notification.type))}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                'font-semibold text-sm text-slate-800',
                                !notification.read && 'font-bold'
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-2 mt-3">
                            {notification.action && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.onClick();
                                  markAsRead(notification.id);
                                }}
                                className="text-xs px-3 py-1 h-7 bg-primary/10 text-primary hover:bg-primary/20 border-none"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs px-2 py-1 h-7 hover:bg-slate-200"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark read
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-xs px-2 py-1 h-7 text-red-600 hover:bg-red-100"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}