import { KanbanContextProps } from "@/shared/types/kanban";
import { createContext } from "react";

export const KanbanContext = createContext<KanbanContextProps>({} as KanbanContextProps);