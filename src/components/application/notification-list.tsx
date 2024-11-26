'use client'
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { Notification } from "@/shared/interfaces/notifications";
import { Bell, CheckCheck, Mail } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { AiOutlineComment } from "react-icons/ai";
import { BsBodyText, BsCalendar2Date } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const NOTIFICATION_TYPES = {
  attachment: { label: 'Anexos', icon: IoDocumentAttachOutline },
  description: { label: 'Descrições', icon: BsBodyText },
  comment: { label: 'Comentários', icon: AiOutlineComment },
  duedate: { label: 'Datas', icon: BsCalendar2Date },
  issue_update: { label: 'Atualizações', icon: GrUpdate },
  generic: { label: 'Geral', icon: IoMdNotificationsOutline }
} as const;

type NotificationType = keyof typeof NOTIFICATION_TYPES;

export const NotificationList: React.FC = () => {
  const {
    notifications,
    markAllAsRead,
    markAsRead,
    fetchNotifications,
    hasMore
  } = useNotifications();

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized grouping of notifications
  const notificationsByType = useMemo(() => {
    return notifications.reduce((acc, notification) => {
      const type = notification.type as NotificationType;
      return {
        ...acc,
        [type]: [...(acc[type] || []), notification]
      };
    }, {} as Record<NotificationType, Notification[]>);
  }, [notifications]);

  // Memoized unread and read notifications
  const [unreadNotifications, readNotifications] = useMemo(() => {
    const unread = notifications.filter(n => !n.readAt);
    const read = notifications.filter(n => n.readAt);
    return [unread, read];
  }, [notifications]);

  // Optimized timestamp formatting
  const formatTimestamp = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      date.setHours(date.getHours() - 3);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return dateString;
    }
  }, []);

  // Fetch notification content with improved error handling
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    const requestTypes = ['attachment', 'description', 'duedate', 'generic'];
    if (!requestTypes.includes(notification.type)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/jira-proxy?url=${encodeURIComponent(notification.content)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedTask(data);
    } catch (error) {
      console.error('Error fetching notification content:', error);
      // Optional: Show user-friendly error toast/message
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized render of notifications with performance optimization
  const renderNotifications = useCallback((notifications: Notification[]) => {
    return notifications.map((notification) => {
      const NotificationIcon = NOTIFICATION_TYPES[notification.type as NotificationType]?.icon || IoMdNotificationsOutline;

      return (
        // <ToggleEditIssue
        //   key={notification.id}
        //   issueKey={selectedTask?.key}
        //   projectKey={selectedTask?.fields?.project?.key}
        // >
        <div
          key={notification.id}
          className="flex items-center p-2 hover:bg-secondary/80 rounded-lg relative group cursor-pointer"
        // onClick={() => handleNotificationClick(notification)}
        >
          {!notification.readAt && (
            <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-red-500" />
          )}

          <div className="flex-shrink-0 ml-4">
            <NotificationIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-grow mx-3 min-w-0">
            <div className="text-sm font-medium truncate">
              {notification.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTimestamp(String(notification.createdAt))}
            </div>
          </div>

          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              {!notification.readAt && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        // </ToggleEditIssue>
      );
    });
  }, [selectedTask, handleNotificationClick, formatTimestamp, markAsRead]);

  // Memoized load more handler
  const handleLoadMore = useCallback(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0 mr-28">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="h-8 text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas como lidas
          </Button>
        </div>

        <Tabs defaultValue="attachment" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4 h-auto">
            {Object.entries(NOTIFICATION_TYPES).map(([type, { label }]) => (
              <TabsTrigger
                key={type}
                value={type}
                className="relative py-2 px-3 text-xs data-[state=active]:border-b-2 border-primary rounded-none"
              >
                {label}
                {notificationsByType[type as NotificationType]?.some(n => !n.readAt) && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(NOTIFICATION_TYPES).map(type => (
            <TabsContent key={type} value={type} className="mt-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-border">
                  {renderNotifications(notificationsByType[type as NotificationType] || [])}
                </div>
                {hasMore && (
                  <Button
                    onClick={handleLoadMore}
                    variant="ghost"
                    className="w-full py-2 text-sm font-medium text-muted-foreground"
                  >
                    Carregar mais
                  </Button>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};