import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { createSubscription } from "@/lib/supabase-client";
import { supabase } from "@/lib/supabase-client";

const CheckoutForm = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) {
        setError("No plan selected");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", planId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Plan not found");

        setPlan(data);
      } catch (err: any) {
        setError(err.message || "Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You must be logged in to subscribe");

      // Create subscription
      await createSubscription(session.user.id, planId!);

      // Redirect to success page
      navigate("/subscription/success");
    } catch (err: any) {
      setError(err.message || "Failed to process payment");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading plan details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 rounded-md text-red-600">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-md mx-auto p-4 bg-amber-50 rounded-md text-amber-600">
        Plan not found. Please select a valid subscription plan.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Subscription
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Enter your payment details to subscribe to the {plan.name} plan
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing
                    ? "Processing..."
                    : `Pay ${plan.currency === "USD" ? "$" : plan.currency}${plan.price}`}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{plan.name} Plan</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Billing Cycle</span>
                  <span className="font-medium capitalize">
                    {plan.billing_cycle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Device Limit</span>
                  <span className="font-medium">
                    {plan.device_limit} devices
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {plan.currency === "USD" ? "$" : plan.currency}
                    {plan.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {plan.currency === "USD" ? "$" : plan.currency}
                  {plan.price}
                </span>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p>
                  By subscribing, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
                <p className="mt-1">
                  You can cancel your subscription at any time from your account
                  settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
