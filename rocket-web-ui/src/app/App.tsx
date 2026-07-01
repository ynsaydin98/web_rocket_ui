import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { appConfig } from "./appConfig";
import {
  startTelemetryUiPublisher,
  stopTelemetryUiPublisher,
} from "../features/telemetry/services/telemetryUiPublisher";
import { registerRealtimeHandlers } from "../realtime/registerRealtimeHandlers";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../realtime/websocketClient";
import { AppShell } from "../shared/components/AppShell";
import {
  startDebugMessagePublisher,
  stopDebugMessagePublisher,
} from "../features/debug/services/debugMessagePublisher";
import {
  startGnssUiPublisher,
  stopGnssUiPublisher,
} from "../features/gnss/services/gnssUiPublisher";

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

const TelemetryPage = lazy(() =>
  import("../pages/TelemetryPage").then((module) => ({
    default: module.TelemetryPage,
  })),
);

const CommandsPage = lazy(() =>
  import("../pages/CommandsPage").then((module) => ({
    default: module.CommandsPage,
  })),
);

const TablesPage = lazy(() =>
  import("../pages/TablesPage").then((module) => ({
    default: module.TablesPage,
  })),
);

const Unit1TablesPage = lazy(() =>
  import("../pages/Unit1TablesPage").then((module) => ({
    default: module.Unit1TablesPage,
  })),
);

const Unit2TablesPage = lazy(() =>
  import("../pages/Unit2TablesPage").then((module) => ({
    default: module.Unit2TablesPage,
  })),
);

const DebugPage = lazy(() =>
  import("../pages/DebugPage").then((module) => ({
    default: module.DebugPage,
  })),
);

function withPageSuspense(page: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="route-loading">
          <span className="route-loading__dot" />
          Sayfa yükleniyor...
        </div>
      }
    >
      {page}
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    registerRealtimeHandlers();

    startTelemetryUiPublisher(appConfig.telemetryUiPublishIntervalMs);
    startGnssUiPublisher(appConfig.telemetryUiPublishIntervalMs);

    startDebugMessagePublisher({
      intervalMs: appConfig.debugUiPublishIntervalMs,
      rawMessageLimit: appConfig.debugRawMessageLimit,
    });

    connectWebSocket();

    return () => {
      disconnectWebSocket();

      stopTelemetryUiPublisher();
      stopGnssUiPublisher();

      stopDebugMessagePublisher();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={withPageSuspense(<DashboardPage />)} />
          <Route
            path="telemetry"
            element={withPageSuspense(<TelemetryPage />)}
          />
          <Route path="tables" element={withPageSuspense(<TablesPage />)}>
            <Route index element={<Navigate to="unit-1" replace />} />
            <Route
              path="unit-1"
              element={withPageSuspense(<Unit1TablesPage />)}
            />
            <Route
              path="unit-1/:section"
              element={withPageSuspense(<Unit1TablesPage />)}
            />
            <Route
              path="unit-2"
              element={withPageSuspense(<Unit2TablesPage />)}
            />
            <Route
              path="unit-2/:section"
              element={withPageSuspense(<Unit2TablesPage />)}
            />
          </Route>
          <Route path="commands" element={withPageSuspense(<CommandsPage />)} />
          <Route path="debug" element={withPageSuspense(<DebugPage />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
