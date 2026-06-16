import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TelemetryProvider } from './app/telemetry'
import './styles/global.css'
import 'uplot/dist/uPlot.min.css'

const root = document.getElementById('root')
if (root === null) throw new Error('#root bulunamadı')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TelemetryProvider>
      <App />
    </TelemetryProvider>
  </React.StrictMode>,
)
