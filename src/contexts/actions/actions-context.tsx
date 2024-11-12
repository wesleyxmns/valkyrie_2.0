import { ActionsProps } from "@/shared/interfaces/actions";
import { createContext } from "react";

export const ActionsContext = createContext<ActionsProps>({} as ActionsProps);