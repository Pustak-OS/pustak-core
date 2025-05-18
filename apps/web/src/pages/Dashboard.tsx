import { useDashboards } from "../hooks/useDashboards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Dashboard = () => {
  const { data: dashboards, isLoading } = useDashboards();
  const [selectedDashboard, setSelectedDashboard] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        Loading...
      </div>
    );
  }

  if (!dashboards?.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 w-full">
        Start by adding a new dashboard
      </div>
    );
  }

  // Set the first dashboard as selected if none is selected
  if (!selectedDashboard && dashboards.length > 0) {
    setSelectedDashboard(dashboards[0].id);
  }

  return (
    <div className="p-4 w-full">
      <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a dashboard" />
        </SelectTrigger>
        <SelectContent>
          {dashboards.map((dashboard) => (
            <SelectItem key={dashboard.id} value={dashboard.id}>
              {dashboard.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dashboard;
