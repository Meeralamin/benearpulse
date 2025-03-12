import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { CreditCard, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { getUserSubscription, canAddDevice } from "@/lib/supabase-client";

interface SubscriptionStatusProps {
  userId: string;
  onUpgrade?: () => void;
}

const SubscriptionStatus = ({ userId, onUpgrade }: SubscriptionStatusProps) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [deviceUsage, setDeviceUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const subscriptionData = await getUserSubscription(userId);
        setSubscription(subscriptionData);

        const deviceUsageData = await canAddDevice(userId);
        setDeviceUsage(deviceUsageData);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Loading subscription data...</div>;
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You don't have an active subscription. Subscribe to start monitoring
            your child's devices.
          </p>
          <Button onClick={onUpgrade}>View Plans</Button>
        </CardContent>
      </Card>
    );
  }

  // Format dates
  const startDate = new Date(subscription.start_date).toLocaleDateString();
  const endDate = new Date(subscription.end_date).toLocaleDateString();

  // Calculate days remaining
  const now = new Date();
  const end = new Date(subscription.end_date);
  const daysRemaining = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Calculate device usage percentage
  const devicePercentage = deviceUsage
    ? Math.round((deviceUsage.currentCount / deviceUsage.limit) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Subscription Status</CardTitle>
          <Badge className="bg-green-500">{subscription.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{subscription.plan.name} Plan</h3>
          <p className="text-sm text-gray-600">
            {subscription.plan.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>Started: {startDate}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>Renews: {endDate}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Time Remaining</span>
            <span>{daysRemaining} days</span>
          </div>
          <Progress value={(daysRemaining / 30) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Device Usage</span>
            <span>
              {deviceUsage?.currentCount || 0} / {deviceUsage?.limit || 0}{" "}
              devices
            </span>
          </div>
          <Progress value={devicePercentage} className="h-2" />
        </div>

        {deviceUsage && !deviceUsage.canAdd && (
          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-700 flex items-start">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            <p>{deviceUsage.reason}</p>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Payment
          </Button>
          <Button size="sm" onClick={onUpgrade}>
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
