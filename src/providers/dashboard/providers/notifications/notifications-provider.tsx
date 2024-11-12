'use client'
import { NotificationContext } from "@/contexts/notifications/notifications-context";
import { useAuth } from "@/hooks/auth/use-auth";
import { Notification } from "@/shared/interfaces/notifications";
import { useCallback, useEffect, useState } from "react";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async (page: number) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_JIRA_API}:${process.env.NEXT_PUBLIC_JIRA_API_PORT}/v1/notifications?recipient=${user.getName()}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      if (!data) return;
      const newNotifications = data.map(notification => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
        readAt: notification.readAt ? new Date(notification.readAt) : null
      }));

      setNotifications(newNotifications);
      setHasMore(newNotifications.length === 20);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  }, [user]);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const removeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_JIRA_API}:${process.env.NEXT_PUBLIC_JIRA_API_PORT}/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(notif =>
          notif.id === id ? { ...notif, readAt: new Date() } : notif
        ));
      } else {
        console.error('Erro ao marcar notificação como lida');
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_JIRA_API}:${process.env.NEXT_PUBLIC_JIRA_API_PORT}/v1/notifications/read?recipient=${user.getName()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, readAt: new Date() })));
      } else {
        console.error('Erro ao marcar todas as notificações como lidas');
      }
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications(1);

    const intervalId = setInterval(() => {
      fetchNotifications(1);
    }, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification, removeAllNotifications, markAsRead, markAllAsRead, fetchNotifications, hasMore }}>
      {children}
    </NotificationContext.Provider>
  );
};