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
import {
  startMKUItkiKomutaPaketUiPublisher,
  stopMKUItkiKomutaPaketUiPublisher,
} from "../storeServices/mku/mkuItkiKomutaPaketUiPublisher";
import {
  startMKUEepromPaketUiPublisher,
  stopMKUEepromPaketUiPublisher,
} from "../storeServices/mku/mkuEepromPaketUiPublisher";
import {
  startModemDeviceIpPaketUiPublisher,
  stopModemDeviceIpPaketUiPublisher,
} from "../storeServices/modem/modemDeviceIpPaketUiPublisher";
import {
  connectVideoWebSocket,
  disconnectVideoWebSocket,
} from "../features/video/services/videoWebSocketClient";
import {
  startVideoStreamUiPublisher,
  stopVideoStreamUiPublisher,
} from "../features/video/services/videoStreamUiPublisher";

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

const GostergelerPage = lazy(() =>
  import("../pages/GostergelerPage").then((module) => ({
    default: module.GostergelerPage,
  })),
);

const VideoPage = lazy(() =>
  import("../pages/VideoPage").then((module) => ({
    default: module.VideoPage,
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
    startMKUItkiKomutaPaketUiPublisher(appConfig.debugUiPublishIntervalMs);
    startMKUEepromPaketUiPublisher(appConfig.debugUiPublishIntervalMs);
    //#endregion

    //#region MODEM
    startModemDeviceIpPaketUiPublisher(appConfig.debugUiPublishIntervalMs);
    //#endregion

    //#region VIDEO
    startVideoStreamUiPublisher(appConfig.videoUiPublishIntervalMs);
    connectVideoWebSocket();
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
      stopMKUItkiKomutaPaketUiPublisher();
      stopMKUEepromPaketUiPublisher();
      //#endregion

      //#region MODEM
      stopModemDeviceIpPaketUiPublisher();
      //#endregion

      //#region VIDEO
      disconnectVideoWebSocket();
      stopVideoStreamUiPublisher();
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
            path="gostergeler"
            element={withPageSuspense(<GostergelerPage />)}
          />
          <Route
            path="flight-termination"
            element={withPageSuspense(<FlightTerminationPage />)}
          />
          <Route path="video" element={withPageSuspense(<VideoPage />)} />
          <Route path="debug" element={withPageSuspense(<DebugPage />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
