/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Billing.tsx
import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  useGetSubscriptionStatusQuery,
  useGetSubscriptionPlansQuery,
  useGetPaymentMethodsQuery,
  useGetPaymentHistoryQuery,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from "@/store/api/billingApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import AddPaymentMethodDialog from "@/components/Admin/Billing/AddPaymentMethodDialog";
import UpgradePlanDialog from "@/components/Admin/Billing/UpgradePlanDialog";
import CancelSubscriptionDialog from "@/components/Admin/Billing/CancelSubscriptionDialog";
import PurchasePlanDialog from "@/components/Admin/Billing/PurchasePlanDialog";

const Billing = () => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // === QUERIES ===
  const {
    data: statusData,
    isLoading: statusLoading,
    error: statusError,
  } = useGetSubscriptionStatusQuery();

  const { data: plans = [], isLoading: plansLoading } =
    useGetSubscriptionPlansQuery();
  const { data: paymentMethods = [], isLoading: pmLoading } =
    useGetPaymentMethodsQuery();
  const { data: paymentsResponse, isLoading: historyLoading } =
    useGetPaymentHistoryQuery({
      page: 1,
      limit: 10,
    });

  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: reactivating }] =
    useReactivateSubscriptionMutation();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();
  const payments = paymentsResponse?.data || [];
  console.log(payments);
  // === NOTIFICATION HELPER ===
  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  if (historyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  // === HELPERS ===
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "trialing":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "past_due":
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      case "canceled":
        return <Badge variant="secondary">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancel = async (immediately: boolean) => {
    try {
      await cancelSubscription({ cancelImmediately: immediately }).unwrap();
      showNotification(
        immediately
          ? "Your subscription has been canceled immediately."
          : "Your subscription will end at the end of the current period."
      );
      setIsCancelOpen(false);
    } catch (err: any) {
      showNotification(
        err.data?.message ||
          "Failed to cancel. Please try again or contact support.",
        "error"
      );
    }
  };

  const handleReactivate = async () => {
    try {
      const result = await reactivateSubscription().unwrap();
      showNotification(
        result.message || "Your subscription has been reactivated!"
      );
    } catch (err: any) {
      showNotification(
        err.data?.message ||
          "Failed to reactivate subscription. Please try again.",
        "error"
      );
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm("Are you sure you want to remove this payment method?"))
      return;

    try {
      await deletePaymentMethod(id).unwrap();
      showNotification("Payment method removed successfully");
    } catch (err: any) {
      showNotification(
        err.data?.message || "Failed to remove payment method",
        "error"
      );
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id).unwrap();
      showNotification("Default payment method updated");
    } catch (err: any) {
      showNotification(
        err.data?.message || "Failed to set default payment method",
        "error"
      );
    }
  };

  if (statusLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (statusError) {
    return (
      <Alert variant="destructive" className="m-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load billing information. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  const {
    hasActiveSubscription,
    subscription: statusSub,
    capabilities,
    warnings,
  } = statusData!;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Notification */}
        {notification && (
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
          >
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <Alert key={i} variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{w}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Current Plan Section */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Current Plan</CardTitle>
            <CardDescription>
              Your subscription status and next billing date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasActiveSubscription && statusSub ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    {statusSub.planName}
                  </h3>
                  <p className="text-3xl font-bold text-teal-600">
                    ${statusSub.price}
                    <span className="text-lg font-normal text-gray-500">
                      /month
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {getStatusBadge(statusSub.status)}
                    {statusSub.cancelAtPeriodEnd && (
                      <Badge variant="destructive">
                        Cancels on{" "}
                        {format(
                          parseISO(statusSub.currentPeriodEnd),
                          "MMM d, yyyy"
                        )}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Next billing:{" "}
                    <strong>
                      {format(
                        parseISO(statusSub.currentPeriodEnd),
                        "MMMM d, yyyy"
                      )}
                    </strong>
                    {statusSub.daysUntilRenewal <= 7 && (
                      <span className="text-orange-600 ml-2">
                        ({statusSub.daysUntilRenewal} days left)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  {capabilities.canUpgrade && (
                    <Button
                      onClick={() => setIsUpgradeOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 cursor-pointer text-white"
                    >
                      Upgrade Plan
                    </Button>
                  )}
                  {capabilities.canCancel && (
                    <Button
                      variant="outline"
                      onClick={() => setIsCancelOpen(true)}
                      className="cursor-pointer"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  {capabilities.canReactivate && (
                    <Button onClick={handleReactivate} disabled={reactivating}>
                      {reactivating ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Active Subscription
                </h3>
                <p className="text-gray-500 mb-6">
                  Choose a plan to get started
                </p>
                <Button
                  onClick={() => setIsPurchaseOpen(true)}
                  size="lg"
                  className="bg-teal-600"
                >
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((p) => !p.expiredAt)
              .map((plan) => {
                const isCurrent = plan.id === statusSub?.planId;
                const canUpgrade =
                  capabilities.canUpgrade &&
                  plan.price > (statusSub?.price || 0);
                const canDowngrade =
                  capabilities.canDowngrade &&
                  plan.price < (statusSub?.price || 0);

                return (
                  <Card
                    key={plan.id}
                    className={`relative bg-white border-gray-200 ${
                      plan.isPopular
                        ? "border-teal-500 ring-2 ring-teal-500"
                        : ""
                    } ${
                      isCurrent
                        ? "opacity-60 bg-green-100 border-green-100"
                        : ""
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-teal-600 text-white">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.planName}</CardTitle>
                      {plan.tagline && (
                        <CardDescription>{plan.tagline}</CardDescription>
                      )}
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {plan.features.split(",").map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm">{f.trim()}</span>
                          </li>
                        ))}
                      </ul>

                      {isCurrent ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : hasActiveSubscription ? (
                        <Button
                          className="w-full text-gray-600 border-gray-600"
                          variant={canUpgrade ? "default" : "outline"}
                          onClick={() => setIsUpgradeOpen(true)}
                        >
                          {canUpgrade
                            ? "Upgrade"
                            : canDowngrade
                            ? "Downgrade"
                            : "Switch Plan"}
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-teal-600 hover:bg-teal-700"
                          onClick={() => setIsPurchaseOpen(true)}
                        >
                          Choose Plan
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Payment Methods */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button onClick={() => setIsAddCardOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardHeader>
          <CardContent>
            {pmLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No payment methods added yet
              </p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-4 border border-green-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 ">
                      <CreditCard className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {pm.cardBrand} •••• {pm.cardLast4}
                          {pm.isDefault && (
                            <Badge className="ml-2">Default</Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {pm.expiryMonth}/{pm.expiryYear.slice(-2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!pm.isDefault && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-600 border-none text-white cursor-pointer"
                            onClick={() => handleSetDefault(pm.id)}
                          >
                            Set Default
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => handleDeletePaymentMethod(pm.id)}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No payments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Invoice</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Amount</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-right py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">Invoice #{p.id.slice(0, 8)}</td>
                        <td className="py-4">{format(parseISO(p.paidAt || p.createdAt), "MMM d, yyyy")}</td>
                        <td className="py-4">${p.amount.toFixed(2)}</td>
                        <td className="py-4">
                          {p.status === "succeeded" ? (
                            <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          ) : p.status === "pending" ? (
                            <Badge variant="secondary">Processing</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Support */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Need Help with Billing?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any subscription or
            payment questions.
          </p>
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddPaymentMethodDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
      />
      <PurchasePlanDialog
        open={isPurchaseOpen}
        onOpenChange={setIsPurchaseOpen}
        plans={plans.filter((p) => !p.expiredAt)}
        onSuccess={() =>
          showNotification("Subscription purchased successfully!")
        }
      />
      <UpgradePlanDialog
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        currentPlanId={statusSub?.planId}
        currentPrice={statusSub?.price}
        plans={plans.filter((p) => !p.expiredAt)}
      />
      <CancelSubscriptionDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onConfirm={handleCancel}
        currentPeriodEnd={statusSub?.currentPeriodEnd}
      />
    </>
  );
};

export default Billing;
