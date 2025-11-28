// src/components/billing/AddPaymentMethodDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePaymentMethodMutation } from "@/store/api/billingApi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface AddPaymentMethodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodDialogProps> = ({ onOpenChange }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();

    const [formData, setFormData] = useState({
        cardHolderName: "",
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingCity: "",
        billingState: "",
        billingPostalCode: "",
        billingCountry: "US",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) return;

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    name: formData.cardHolderName,
                    address: {
                        line1: formData.billingAddressLine1,
                        line2: formData.billingAddressLine2,
                        city: formData.billingCity,
                        state: formData.billingState,
                        postal_code: formData.billingPostalCode,
                        country: formData.billingCountry,
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (!paymentMethod) {
                throw new Error("Failed to create payment method");
            }

            // Extract card details from paymentMethod
            const card = paymentMethod.card;
            if (!card) {
                throw new Error("No card details returned");
            }

            const dto = {
                stripePaymentMethodId: paymentMethod.id,
                cardHolderName: formData.cardHolderName,
                cardLast4: card.last4,
                cardBrand: card.brand,
                expiryMonth: card.exp_month.toString().padStart(2, "0"),
                expiryYear: card.exp_year.toString(),
                billingAddressLine1: formData.billingAddressLine1,
                billingAddressLine2: formData.billingAddressLine2,
                billingCity: formData.billingCity,
                billingState: formData.billingState,
                billingPostalCode: formData.billingPostalCode,
                billingCountry: formData.billingCountry,
            };

            await createPaymentMethod(dto).unwrap();
            alert("Payment method added successfully");
            onOpenChange(false);
        } catch (err: any) {
            alert("added successfully");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white">
            <div>
                <Label htmlFor="cardHolderName">Cardholder Name</Label>
                <Input
                    id="cardHolderName"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label>Card Details</Label>
                <div className="border rounded-md p-3">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="billingAddressLine1">Address Line 1</Label>
                    <Input
                        id="billingAddressLine1"
                        name="billingAddressLine1"
                        value={formData.billingAddressLine1}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="billingAddressLine2">Address Line 2</Label>
                    <Input
                        id="billingAddressLine2"
                        name="billingAddressLine2"
                        value={formData.billingAddressLine2}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                        id="billingCity"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="billingState">State</Label>
                    <Input
                        id="billingState"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="billingPostalCode">Postal Code</Label>
                    <Input
                        id="billingPostalCode"
                        name="billingPostalCode"
                        value={formData.billingPostalCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="billingCountry">Country</Label>
                    <Input
                        id="billingCountry"
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <DialogFooter>
                <Button className="py-2 px-5 bg-green-600 text-white cursor-pointer" type="submit" disabled={isLoading || !stripe || !elements}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Add Payment Method
                </Button>
            </DialogFooter>
        </form>
    );
};

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = (props) => (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
                <DialogTitle>Add New Payment Method</DialogTitle>
            </DialogHeader>
            <Elements stripe={stripePromise}>
                <AddPaymentMethodForm {...props} />
            </Elements>
        </DialogContent>
    </Dialog>
);

export default AddPaymentMethodDialog;