import { useEffect, useState } from "react"
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Humidity from "./assets/humidity.png"
import Rain from "./assets/rain.png"
import SoilHealth from "./assets/soil-health.png"
import Temp from "./assets/temperature.png"
import Water from "./assets/water.png"
import Test from "./assets/test.png"
import BMKG from "./assets/logo-bmkg.png"
import Metering from "./assets/metering.png"
import { formatToWIB } from "./utils/utils"
import { getSensor, getWatering } from "./services/api"

interface SensorItem {
  id: number,
  soil_moisture_percentage: number,
  humidity_percentage: number,
  temperature_celcius: number,
  createdAt: string,
}

interface WateringResponse {
  id: number,
  score: number,
  total_precipitation: number,
  soil_moisture_percentage: number,
  humidity_percentage: number,
  temperature_celcius: number,
  createdAt: string,
}

function App() {

  const [sensorKelembapanTanah, setSensorKelembapanTanah] = useState(0);
  const [sensorKelembapanUdara, setSensorKelembapanUdara] = useState(0);
  const [sensorSuhuUdara, setSensorSuhuUdara] = useState(0);
  const [sensorLastUpdate, setSensorLastUpdate] = useState("");

  const [wateringScore, setWateringScore] = useState(0);
  const [wateringKelembapanTanah, setWateringKelembapanTanah] = useState(0);
  const [wateringKelembapanUdara, setWateringKelembapanUdara] = useState(0);
  const [wateringSuhuUdara, setWateringSuhuUdara] = useState(0);
  const [wateringVolumeAir, setWateringVolumeAir] = useState(0);
  const [wateringCurahHujan, setWateringCurahHujan] = useState(0);
  const [wateringLastUpdate, setWateringLastUpdate] = useState("");

  const getData = async () => {
    const sensorResult = await getSensor() as { data: SensorItem[] } | undefined;
    let dataSensor = sensorResult?.data[0];
    console.log(dataSensor)
    setSensorKelembapanTanah(dataSensor?.soil_moisture_percentage ?? 0)
    setSensorKelembapanUdara(dataSensor?.humidity_percentage ?? 0)
    setSensorSuhuUdara(dataSensor?.temperature_celcius ?? 0)
    setSensorLastUpdate(formatToWIB(dataSensor?.createdAt ?? ""))

    const wateringResult = await getWatering() as { data: WateringResponse[] } | undefined;
    let dataWatering = wateringResult?.data[0];
    console.log(wateringResult)
    setWateringKelembapanTanah(dataWatering?.soil_moisture_percentage ?? 0)
    setWateringKelembapanUdara(dataWatering?.humidity_percentage ?? 0)
    setWateringSuhuUdara(dataWatering?.temperature_celcius ?? 0)
    setWateringCurahHujan(dataWatering?.total_precipitation ?? 0)
    let scoreApi = dataWatering?.score ?? 0;
    let volAir = 0;
    if (scoreApi <= 0) {
      volAir = 0
    } else if (scoreApi >= 1 && scoreApi <= 3) {
      volAir = 80
    } else if (scoreApi >= 4 && scoreApi <= 6) {
      volAir = 120
    } else if (scoreApi >= 7 && scoreApi <= 9) {
      volAir = 160
    } else {
      volAir = 200
    }
    setWateringVolumeAir(volAir)
    setWateringScore(dataWatering?.score ?? 0)
    setWateringLastUpdate(formatToWIB(dataWatering?.createdAt ?? ""))
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ maxWidth: "900px", margin: "0 auto", marginTop: "24px" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold" style={{ fontSize: "18px" }}>Hasil Pengukuran Sensor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4" style={{ fontSize: "12px" }}>
              Terakhir Update {sensorLastUpdate}
            </p>
            <div style={{ width: "100%", height: "1px", backgroundColor: "oklch(0.92 0.004 286.32)" }} className="mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Metering} alt="Logo" width={65} />
                  <img src={Metering} alt="Logo" width={65} />
                </div>
              </div>
              <div className="rounded-xl border p-4 flex flex-col">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={SoilHealth} alt="Logo" width={30} />
                  Kelembapan Tanah
                </div>
                <p className="text-muted-foreground text-sm mt-3">{sensorKelembapanTanah}%</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Humidity} alt="Logo" width={30} />
                  Kelembapan Udara
                </div>
                <p className="text-muted-foreground text-sm mt-3">{sensorKelembapanUdara}%</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Temp} alt="Logo" width={30} />
                  Suhu Udara
                </div>
                <p className="text-muted-foreground text-sm mt-3">{sensorSuhuUdara}° C</p>
              </div>
            </div>
          </CardContent >
        </div >

        <div style={{ maxWidth: "900px", margin: "0 auto", marginTop: "35px" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold" style={{ fontSize: "18px" }}>Hasil Pencatatan Penyiraman</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4" style={{ fontSize: "12px" }}>
              Terakhir Update {wateringLastUpdate}
            </p>
            <div style={{ width: "100%", height: "1px", backgroundColor: "oklch(0.92 0.004 286.32)" }} className="mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Test} alt="Logo" width={30} />
                  Score
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringScore}</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Water} alt="Logo" width={30} />
                  Volume Penyiraman
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringVolumeAir} mL</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={SoilHealth} alt="Logo" width={30} />
                  Kelembapan Tanah
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringKelembapanTanah}%</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Humidity} alt="Logo" width={30} />
                  Kelembapan Udara
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringKelembapanUdara}%</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Temp} alt="Logo" width={30} />
                  Suhu Udara
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringSuhuUdara}° C</p>
              </div>
              <div className="rounded-xl border p-4 flex flex-col  justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <img src={Rain} alt="Logo" width={30} />
                  Total Curah Hujan
                </div>
                <p className="text-muted-foreground text-sm mt-3">{wateringCurahHujan}</p>
              </div>
            </div>
          </CardContent >
        </div >
        <div style={{ maxWidth: "900px", margin: "0 auto", marginTop: "20px", marginBottom: "40px", marginLeft: "24px", marginRight: "24px" }}>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <img src={BMKG} alt="Logo" width={28} />
              NB: Data Total Curah Hujan didapatkan dari API BMKG dengan Nomor Administrasi 33.19.09.2002
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ width: "100%", height: "30px", backgroundColor: "oklch(0.72 0 0)", fontSize: "12px", display: "flex", alignContent: "center", flexWrap: "wrap", justifyContent: "center" }} className="mb-4 text-sm text-center text-white">
          Copyright © 2025 | KIR SMA Muh Kudus
        </div>
      </div>
    </div>
  )
}

export default App