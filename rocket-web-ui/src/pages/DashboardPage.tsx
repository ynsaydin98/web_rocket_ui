import { AtmosphereMotionPanel } from "../features/dashboard/components/AtmosphereMotionPanel";
import { PositionNavigationPanel } from "../features/dashboard/components/PositionNavigationPanel";
import { VehicleOverviewPanel } from "../features/dashboard/components/VehicleOverviewPanel";

export function DashboardPage() {
  return (
    <div className="mission-dashboard">
      <div className="mission-dashboard__main">
        <PositionNavigationPanel />
        <VehicleOverviewPanel />
        <AtmosphereMotionPanel />
      </div>
    </div>
  );
}
