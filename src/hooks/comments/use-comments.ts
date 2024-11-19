import { CommentsContext } from "@/contexts/comments/comments-context";
import { useContext } from "react";

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useCommentsContext must be used within a CommentsProvider');
  }
  return context;
};
