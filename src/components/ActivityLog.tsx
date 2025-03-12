import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Eye, Calendar } from "lucide-react";

type ActivityLogEntry = {
  id: string;
  deviceName: string;
  timestamp: string;
  duration: string;
  status: "completed" | "interrupted" | "ongoing";
};

type ActivityLogProps = {
  entries?: ActivityLogEntry[];
  title?: string;
  maxEntries?: number;
};

const ActivityLog = ({
  entries = [
    {
      id: "1",
      deviceName: "Sarah's iPhone",
      timestamp: "Today, 3:45 PM",
      duration: "5m 23s",
      status: "completed",
    },
    {
      id: "2",
      deviceName: "Tommy's iPad",
      timestamp: "Today, 1:12 PM",
      duration: "2m 10s",
      status: "interrupted",
    },
    {
      id: "3",
      deviceName: "Sarah's iPhone",
      timestamp: "Yesterday, 7:30 PM",
      duration: "8m 45s",
      status: "completed",
    },
    {
      id: "4",
      deviceName: "Tommy's iPad",
      timestamp: "Yesterday, 4:15 PM",
      duration: "3m 22s",
      status: "completed",
    },
  ],
  title = "Recent Activity",
  maxEntries = 10,
}: ActivityLogProps) => {
  const displayEntries = entries.slice(0, maxEntries);

  const getStatusBadge = (status: ActivityLogEntry["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "interrupted":
        return <Badge variant="destructive">Interrupted</Badge>;
      case "ongoing":
        return <Badge variant="default">Ongoing</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEntries.length > 0 ? (
            displayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{entry.deviceName}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {entry.duration}
                    </span>
                  </div>
                  {getStatusBadge(entry.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-32 items-center justify-center">
              <p className="text-gray-500">No activity recorded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
