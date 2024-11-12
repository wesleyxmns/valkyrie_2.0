import { CommentsContextProps } from "@/shared/interfaces/comments";
import { createContext } from "react";

export const CommentsContext = createContext<CommentsContextProps | undefined>(undefined);