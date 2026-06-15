import Panel from '../../../components/common/Panel'
import Stat from '../../../components/common/Stat'
import { useStoreSelector } from '../../../app/services'
import { fmt } from '../../../lib/format'

export default function ImuPanel() {
  const imu = useStoreSelector((s) => s.latest?.imu)

  return (
    <Panel title="IMU">
      <div className="stat-grid">
        <Stat label="İvme X" value={fmt(imu?.accel.x, 2)} unit="m/s²" />
        <Stat label="İvme Y" value={fmt(imu?.accel.y, 2)} unit="m/s²" />
        <Stat label="İvme Z" value={fmt(imu?.accel.z, 2)} unit="m/s²" />
        <Stat label="Gyro X" value={fmt(imu?.gyro.x, 2)} unit="°/s" />
        <Stat label="Gyro Y" value={fmt(imu?.gyro.y, 2)} unit="°/s" />
        <Stat label="Gyro Z" value={fmt(imu?.gyro.z, 2)} unit="°/s" />
        <Stat label="Roll" value={fmt(imu?.roll)} unit="°" />
        <Stat label="Pitch" value={fmt(imu?.pitch)} unit="°" />
        <Stat label="Yaw" value={fmt(imu?.yaw)} unit="°" />
      </div>
    </Panel>
  )
}
