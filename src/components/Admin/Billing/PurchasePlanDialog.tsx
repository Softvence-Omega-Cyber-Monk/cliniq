// src/components/billing/PurchasePlanDialog.tsx
import React, { useState } from "react";
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
import {
  usePurchaseSubscriptionMutation,
  SubscriptionPlan,
} from "@/store/api/billingApi";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface PurchasePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: SubscriptionPlan[];
  onSuccess?: () => void;
}

const PurchasePlanDialog: React.FC<PurchasePlanDialogProps> = ({
  open,
  onOpenChange,
  plans,
  onSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [purchase, { isLoading }] = usePurchaseSubscriptionMutation();

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handlePurchase = async () => {
    if (!selectedPlanId) return;

    try {
      await purchase({
        subscriptionPlanId: selectedPlanId,
        // You can add paymentMethodId here later if needed
      }).unwrap();

      toast.success(`Successfully started ${selectedPlan?.planName} plan!`);
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(
        `Failed to purchase plan: ${err?.data?.message || err.message}`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl border-none ">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Start your journey today — 14-day free trial on all plans
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {plans
            .filter((p) => !p.expiredAt)
            .map((plan) => {
              const isSelected = plan.id === selectedPlanId;

              return (
                <Card
                  key={plan.id}
                  className={`cursor-pointer bg-white transition-all hover:shadow-xl ${
                    isSelected ? "ring-2 ring-teal-400 border-teal-500" : ""
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {plan.planName.toLowerCase().includes("professional") && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-website-primary-color text-white">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.planName}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      14-day free trial
                    </p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.split(",").map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          <span className="text-sm">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full mt-6"
                      variant={isSelected ? "default" : "outline"}
                      disabled={isLoading}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <DialogFooter className="flex justify-center">
          <Button
            size="lg"
            className="px-12 bg-website-primary-color hover:bg-teal-700 text-white text-lg"
            onClick={handlePurchase}
            disabled={!selectedPlanId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Free Trial"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchasePlanDialog;
