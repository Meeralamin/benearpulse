import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, X } from "lucide-react";
import { getSubscriptionPlans } from "@/lib/supabase-client";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: string;
  device_limit: number;
  features: Record<string, any>;
  popular?: boolean;
  displayFeatures?: PlanFeature[];
}

const PricingPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getSubscriptionPlans();
        console.log("Fetched plans:", plansData);

        // Process plans to add display features
        const processedPlans = plansData.map((plan) => {
          // Mark the middle plan as popular
          const isPopular = plan.name.includes("Family");

          // Create display features
          const displayFeatures = [
            {
              name: `Monitor up to ${plan.device_limit} device${plan.device_limit > 1 ? "s" : ""}`,
              included: true,
            },
            {
              name: `${plan.features.videoQuality} video quality`,
              included: true,
            },
            { name: "Two-way communication", included: true },
            {
              name: "Cloud recording",
              included: !!plan.features.cloudRecording,
            },
            {
              name: `${plan.features.historyRetention || "7 days"} history retention`,
              included: true,
            },
            {
              name: "Priority support",
              included: !!plan.features.prioritySupport,
            },
          ];

          return { ...plan, popular: isPopular, displayFeatures };
        });

        setPlans(processedPlans);
      } catch (err: any) {
        setError("Failed to load subscription plans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(
    (plan) => plan.billing_cycle === billingCycle,
  );

  const handleSelectPlan = (planId: string) => {
    navigate(`/subscribe/${planId}`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect monitoring plan for your family's needs. All plans
          include our core features with different device limits.
        </p>

        <div className="flex justify-center mt-8 mb-12 bg-gray-100 p-1 rounded-full w-fit mx-auto">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full ${billingCycle === "monthly" ? "bg-white shadow-sm" : "text-gray-600"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full ${billingCycle === "yearly" ? "bg-white shadow-sm" : "text-gray-600"}`}
          >
            Yearly <span className="text-green-600 text-sm">Save 16%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col h-full ${plan.popular ? "border-blue-500 shadow-lg relative" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.currency === "USD" ? "$" : plan.currency}
                  {plan.price}
                </span>
                <span className="text-gray-500 ml-1">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.displayFeatures?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-gray-400"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
