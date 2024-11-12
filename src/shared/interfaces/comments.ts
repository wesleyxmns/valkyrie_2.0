import { ReactNode } from "react";

export interface CommentsProviderProps {
  children: ReactNode;
}

export interface CommentsContextProps {
  comment: string;
  attachments: Array<File>
  setComment: (text: string) => void;
  setAttachments: (files: Array<File>) => void;
}
