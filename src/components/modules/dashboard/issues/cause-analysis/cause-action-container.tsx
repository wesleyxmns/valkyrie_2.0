'use client'
import React from 'react';
import { Label } from "@/components/ui/label";

export const CauseactionContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <div ref={ref} className="flex items-center gap-1">
        <Label>Ações Corretivas</Label>
        {children}
      </div>
    );
  }
);

CauseactionContainer.displayName = 'CauseactionContainer';