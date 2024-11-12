'use client'
import { CommentsContext } from "@/contexts/comments/comments-context";
import { CommentsProviderProps } from "@/shared/interfaces/comments";
import { useState } from "react";

export const CommentsProvider: React.FC<CommentsProviderProps> = ({ children }) => {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<Array<File>>([]);

  return (
    <CommentsContext.Provider value={{ comment, attachments, setComment, setAttachments }}>
      {children}
    </CommentsContext.Provider>
  );
};