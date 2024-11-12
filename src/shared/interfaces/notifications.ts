export interface Notification {
  id: number;
  title: string;
  content: string;
  recipient: string;
  type: string;
  createdAt: Date;
  readAt: Date | null;
}

export interface NotificationContextProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: (page: number) => Promise<void>;
  removeAllNotifications: () => void;
  hasMore: boolean;
}
