import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ServicesProvider } from './app/services'
import './styles/global.css'
import 'uplot/dist/uPlot.min.css'

const root = document.getElementById('root')
if (root === null) throw new Error('#root bulunamadı')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ServicesProvider>
      <App />
    </ServicesProvider>
  </React.StrictMode>,
)
