import Section from '../../components/common/Section'
import RocketViewer from './RocketViewer'
import GnssPanel from './panels/GnssPanel'
import BarometerPanel from './panels/BarometerPanel'
import ImuPanel from './panels/ImuPanel'
import Compass from './Compass'

export default function HomePage() {
  return (
    <div className="home">
      <Section title="Konum & Yönelim" className="section-location">
        <GnssPanel />
        <Compass />
      </Section>

      <Section title="3D Görünüm & Uçuş İzi" className="section-view">
        <RocketViewer />
      </Section>

      <Section title="Atmosfer & Hareket" className="section-sensors">
        <BarometerPanel />
        <ImuPanel />
      </Section>
    </div>
  )
}
