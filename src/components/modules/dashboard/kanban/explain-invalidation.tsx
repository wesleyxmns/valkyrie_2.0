'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ExplainInvalidationProps {
  showModal: boolean,
  onClose: () => void,
  onConfirm: (reason: string) => void
}

export const ExplainInvalidation = ({ showModal, onClose, onConfirm }: ExplainInvalidationProps) => {
  const [reason, setReason] = useState<string>('');
  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="w-auto h-auto">
        <DialogHeader>
          <DialogTitle>Invalidar relatório</DialogTitle>
          <DialogDescription>
            Descreva o motivo pelo o qual você está invalidando esse relatório.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          className="resize-none"
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Digite o motivo da invalidação...`}
        />
        <div className="flex justify-end">
          <Button onClick={() => onConfirm(reason)}>
            Invalidar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
