import { useStoreSelector } from '../../app/services'
import LineChart from './LineChart'

export default function ChartsPage() {
  const history = useStoreSelector((s) => s.history)
  const xValues = history.map((p) => p.t)

  return (
    <div className="charts">
      <LineChart
        title="İrtifa / Zaman"
        unit="m"
        xValues={xValues}
        series={[
          {
            label: 'İrtifa',
            color: '#38bdf8',
            accessor: (i) => history[i]?.gnss.altitude ?? 0,
          },
        ]}
      />
      <LineChart
        title="Hız / Zaman"
        unit="m/s"
        xValues={xValues}
        series={[
          {
            label: 'Hız',
            color: '#a78bfa',
            accessor: (i) => history[i]?.gnss.speed ?? 0,
          },
        ]}
      />
      <LineChart
        title="Basınç / Zaman"
        unit="hPa"
        xValues={xValues}
        series={[
          {
            label: 'Basınç',
            color: '#34d399',
            accessor: (i) => history[i]?.barometer.pressure ?? 0,
          },
        ]}
      />
      <LineChart
        title="Sıcaklık / Zaman"
        unit="°C"
        xValues={xValues}
        series={[
          {
            label: 'Sıcaklık',
            color: '#fb923c',
            accessor: (i) => history[i]?.barometer.temperature ?? 0,
          },
        ]}
      />
    </div>
  )
}
