import { NotificationContextProps } from "@/shared/interfaces/notifications";
import { createContext } from "react";

export const NotificationContext = createContext<NotificationContextProps | null>(null);