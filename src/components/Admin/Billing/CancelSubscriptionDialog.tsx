// src/components/billing/CancelSubscriptionDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (immediately: boolean) => void;
  currentPeriodEnd?: string;
}

const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  currentPeriodEnd,
}) => {
  const [immediately, setImmediately] = useState(false);

  const handleConfirm = () => {
    onConfirm(immediately);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? 
            {currentPeriodEnd && !immediately && (
              <> You will have access until {format(parseISO(currentPeriodEnd), "MMMM d, yyyy")}.</>
            )}
            {immediately && <> This will take effect immediately and you will lose access right away.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="immediately"
              checked={immediately}
              onCheckedChange={(checked) => setImmediately(!!checked)}
            />
            <Label htmlFor="immediately">Cancel immediately (no refund for current period)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button className="cursor-pointer bg-teal-600 border-none text-white" variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button className="cursor-pointer bg-red-600 border-none text-white" variant="destructive" onClick={handleConfirm}>
            Confirm Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;