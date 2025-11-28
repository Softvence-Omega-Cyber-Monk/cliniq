// src/components/billing/UpgradePlanDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useUpgradeSubscriptionMutation,
  usePreviewUpgradeMutation, SubscriptionPlan
} from "@/store/api/billingApi";
import { Loader2, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: string;
  currentPrice?: number;
  plans: SubscriptionPlan[];
}

const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({
  open,
  onOpenChange,
  currentPlanId,
  currentPrice = 0,
  plans,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [previewUpgrade, { data: preview, isLoading: previewLoading }] =
    usePreviewUpgradeMutation();
  const [upgradeSubscription, { isLoading: upgrading }] =
    useUpgradeSubscriptionMutation();

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const isUpgrade = selectedPlan && selectedPlan.price > currentPrice;
  const isDowngrade = selectedPlan && selectedPlan.price < currentPrice;

  // Trigger preview when plan selected
  useEffect(() => {
    if (selectedPlanId && currentPlanId) {
      previewUpgrade({
        newSubscriptionPlanId: selectedPlanId,
        prorationBehavior: "create_prorations",
      }).unwrap().catch(() => {
        // Silent fail — user can still proceed
      });
    }
  }, [selectedPlanId, currentPlanId, previewUpgrade]);

  const handleUpgrade = async () => {
    if (!selectedPlanId) return;

    try {
      await upgradeSubscription({
        newSubscriptionPlanId: selectedPlanId,
        prorationBehavior: "create_prorations",
      }).unwrap();

      alert(preview?.description || "Your plan has been updated successfully.")
      onOpenChange(false);
    } catch (err: any) {
      alert("Please try again")
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-screen overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Change Your Plan</DialogTitle>
          <DialogDescription>
            Select a new plan. You’ll be charged or credited prorated amount today.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;

            return (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-teal-500 border-teal-500" : ""
                } ${isCurrent ? "opacity-60" : ""}`}
                onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
              >
                {plan.price > currentPrice && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-emerald-600">Upgrade</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.planName}</CardTitle>
                  <p className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.split(",").map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-teal-600">✓</span>
                        {f.trim()}
                      </li>
                    ))}
                  </ul>
                  {isCurrent && (
                    <Badge className="mt-4 w-full">Current Plan</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Proration Preview Box */}
        {preview && selectedPlan && (
          <Alert className={preview.prorationAmount >= 0 ? "border-green-500" : "border-blue-500"}>
            <CreditCard className="h-5 w-5" />
            <AlertDescription className="space-y-3">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Amount Due Today</span>
                <span className={preview.prorationAmount >= 0 ? "text-green-600" : "text-blue-600"}>
                  {preview.prorationAmount >= 0 ? "+" : "-"}$
                  {Math.abs(preview.prorationAmount).toFixed(2)}
                </span>
              </div>

              <div className="text-sm space-y-1 text-gray-600">
                {preview.creditAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Credit for unused time</span>
                    <span className="text-blue-600">−${preview.creditAmount.toFixed(2)}</span>
                  </div>
                )}
                {preview.chargeAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Prorated charge for {selectedPlan.planName}</span>
                    <span className="text-green-600">+${preview.chargeAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Next billing date</span>
                  <span>{format(new Date(preview.nextBillingDate), "MMMM d, yyyy")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm">
                {isUpgrade ? (
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-blue-600" />
                )}
                <span>
                  {isUpgrade
                    ? `You will be charged $${preview.chargeAmount.toFixed(2)} today`
                    : `You will receive a $${preview.creditAmount.toFixed(2)} credit`}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex sm:justify-between gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleUpgrade}
            disabled={!selectedPlanId || upgrading || previewLoading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {previewLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : upgrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Confirm & Pay Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;