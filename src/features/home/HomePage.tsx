import RocketViewer from './RocketViewer'
import GnssPanel from './panels/GnssPanel'
import BarometerPanel from './panels/BarometerPanel'
import ImuPanel from './panels/ImuPanel'
import Compass from './Compass'

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-grid">
        <aside className="home-col home-left">
          <GnssPanel />
          <Compass />
        </aside>

        <div className="home-center">
          <RocketViewer />
        </div>

        <aside className="home-col home-right">
          <BarometerPanel />
          <ImuPanel />
        </aside>
      </div>
    </div>
  )
}
