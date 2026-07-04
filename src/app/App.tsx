import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { appConfig } from "./appConfig";
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
  startGrafikVeriGecmisi,
  stopGrafikVeriGecmisi,
} from "../features/grafik/services/grafikVeriGecmisi";
import {
  startMKUYoklamaPaketUiPublisher,
  stopMKUYoklamaPaketUiPublisher,
} from "../storeServices/mku/mkuYoklamaPaketUiPublisher";
import {
  startMKUVersiyonPaketUiPublisher,
  stopMKUVersiyonPaketUiPublisher,
} from "../storeServices/mku/mkuVersiyonPaketUiiPublisher";
import {
  startMKUItkiDiagnostikPaketUiPublisher,
  stopMKUItkiDiagnostikPaketUiPublisher,
} from "../storeServices/mku/mkuItkiDiagnostikPaketUiPublisher";

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

const GrafikPage = lazy(() =>
  import("../pages/GrafikPage").then((module) => ({
    default: module.GrafikPage,
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

const MKUPage = lazy(() =>
  import("../pages/mku/mkuPage").then((module) => ({
    default: module.MKUPage,
  })),
);

const FlightTerminationPage = lazy(() =>
  import("../pages/FlightTerminationPage").then((module) => ({
    default: module.FlightTerminationPage,
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

    //#region MKU
    startMKUYoklamaPaketUiPublisher(appConfig.debugUiPublishIntervalMs);
    startMKUVersiyonPaketUiPublisher(appConfig.debugUiPublishIntervalMs);
    // Sürekli akan telemetri paketi; yoklama/versiyon gibi seyrek sorgu
    // cevaplarından farklı olarak telemetri yayın aralığıyla güncellenir.
    startMKUItkiDiagnostikPaketUiPublisher(
      appConfig.telemetryUiPublishIntervalMs,
    );
    //#endregion

    startGrafikVeriGecmisi();

    startDebugMessagePublisher({
      intervalMs: appConfig.debugUiPublishIntervalMs,
      rawMessageLimit: appConfig.debugRawMessageLimit,
    });

    connectWebSocket();

    return () => {
      disconnectWebSocket();

      //#region MKU
      stopMKUYoklamaPaketUiPublisher();
      stopMKUVersiyonPaketUiPublisher();
      stopMKUItkiDiagnostikPaketUiPublisher();
      //#endregion

      stopGrafikVeriGecmisi();

      stopDebugMessagePublisher();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={withPageSuspense(<DashboardPage />)} />
          <Route path="grafik" element={withPageSuspense(<GrafikPage />)} />
          <Route path="tables" element={withPageSuspense(<TablesPage />)}>
            <Route index element={<Navigate to="rku" replace />} />
            <Route path="rku" element={withPageSuspense(<MKUPage />)} />
            <Route
              path="rku/:section"
              element={withPageSuspense(<MKUPage />)}
            />
            <Route index element={<Navigate to="mku" replace />} />
            <Route path="mku" element={withPageSuspense(<MKUPage />)} />
            <Route
              path="mku/:section"
              element={withPageSuspense(<MKUPage />)}
            />
          </Route>
          <Route path="commands" element={withPageSuspense(<CommandsPage />)} />
          <Route
            path="flight-termination"
            element={withPageSuspense(<FlightTerminationPage />)}
          />
          <Route path="debug" element={withPageSuspense(<DebugPage />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
