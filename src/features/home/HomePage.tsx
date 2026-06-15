import RocketViewer from './RocketViewer'
import GnssPanel from './panels/GnssPanel'
import BarometerPanel from './panels/BarometerPanel'
import ImuPanel from './panels/ImuPanel'

export default function HomePage() {
  return (
    <div className="home">
      <aside className="home-col home-left">
        <GnssPanel />
      </aside>

      <div className="home-center">
        <RocketViewer />
      </div>

      <aside className="home-col home-right">
        <BarometerPanel />
        <ImuPanel />
      </aside>
    </div>
  )
}
