import { SocketProps } from "@/shared/interfaces/socket";
import { createContext } from "react";

export const SocketContext = createContext<SocketProps | null>(null);