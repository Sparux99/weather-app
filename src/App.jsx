import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCloudSun, faCloudMoon, faSmog, faCloudRain, faSnowflake, faCloudShowersHeavy, faBolt, faQuestionCircle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from './Loading';
import Notification from './Notification';

export default function App() {

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [selected, setSelected] = useState("latitude=33.5883&longitude=-7.6114");
  const [isOpen, setIsOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleRefresh = () => {
    setIsRotating(isRotating + 1);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?${selected}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,precipitation_probability,rain,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,rain_sum,precipitation_probability_min,sunrise,sunset,weather_code`)
        setData(res.data)
      } catch (err) {
        console.log(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isRotating, selected])

  function weatherCode(code) {
    switch (code) {
      case 0:
      case 1:
      case 2:
        return { status: "Clear", iconD: <FontAwesomeIcon icon={faSun} />, iconN: <FontAwesomeIcon icon={faMoon} /> };
      case 3:
        return { status: "Cloudy", iconD: <FontAwesomeIcon icon={faCloudSun} />, iconN: <FontAwesomeIcon icon={faCloudMoon} /> };
      case 45:
      case 48:
        return { status: 'Fog', iconD: <FontAwesomeIcon icon={faSmog} />, iconN: <FontAwesomeIcon icon={faSmog} /> };
      case 51:
      case 53:
      case 55:
        return { status: 'Drizzle', iconD: <FontAwesomeIcon icon={faCloudRain} />, iconN: <FontAwesomeIcon icon={faCloudRain} /> };
      case 56:
      case 57:
        return { status: 'Freezing Drizzle', iconD: <FontAwesomeIcon icon={faSnowflake} />, iconN: <FontAwesomeIcon icon={faSnowflake} /> };
      case 61:
      case 63:
      case 65:
        return { status: 'Rain', iconD: <FontAwesomeIcon icon={faCloudShowersHeavy} />, iconN: <FontAwesomeIcon icon={faCloudShowersHeavy} /> };
      case 66:
      case 67:
        return { status: 'Freezing Rain', iconD: <FontAwesomeIcon icon={faSnowflake} />, iconN: <FontAwesomeIcon icon={faSnowflake} /> };
      case 71:
      case 73:
      case 75:
        return { status: 'Snow', iconD: <FontAwesomeIcon icon={faSnowflake} />, iconN: <FontAwesomeIcon icon={faSnowflake} /> };
      case 77:
        return { status: 'Snow Grains', iconD: <FontAwesomeIcon icon={faSnowflake} />, iconN: <FontAwesomeIcon icon={faSnowflake} /> };
      case 80:
      case 81:
      case 82:
        return { status: 'Showers', iconD: <FontAwesomeIcon icon={faCloudShowersHeavy} />, iconN: <FontAwesomeIcon icon={faCloudShowersHeavy} /> };
      case 85:
      case 86:
        return { status: 'Snow Showers', iconD: <FontAwesomeIcon icon={faSnowflake} />, iconN: <FontAwesomeIcon icon={faSnowflake} /> };
      case 95:
      case 96:
      case 99:
        return { status: 'Thunderstorm', iconD: <FontAwesomeIcon icon={faBolt} />, iconN: <FontAwesomeIcon icon={faBolt} /> };
      default:
        return { status: 'Unknown', iconD: <FontAwesomeIcon icon={faQuestionCircle} />, iconN: <FontAwesomeIcon icon={faQuestionCircle} /> };
    }
  }

  const weather = data ? weatherCode(data.current.weather_code) : weatherCode(100)

  const is_day = data && data.current.is_day

  const date = data && new Date(data.current.time);
  const sunrise = data && new Date(data.daily.sunrise[1]);
  const sunset = data && new Date(data.daily.sunset[1]);

  return (
    <div  className={darkMode ? 'app dark-mode' : 'app light-mode'}>
      <nav className={` ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <button className={` ${darkMode ? 'dark-mode' : 'light-mode'} toggleMenu`} onClick={handleClick}>☰</button>
        <select className={`${darkMode ? 'dark-mode' : 'light-mode'}`} onChange={(e) => setSelected(e.target.value)} defaultValue={selected}>
          <option value={"latitude=33.5883&longitude=-7.6114"}>Casablanca</option>
          <option value={"latitude=35.7661&longitude=-5.8026"}>Tangier</option>
          <option value={"latitude=31.6295&longitude=-7.9811"}>Marrakech</option>
          <option value={"latitude=30.9334&longitude=-6.8937"}>Ouarzazate</option>
          <option value={"latitude=34.0371&longitude=-4.9998"}>Fes</option>
          <option value={"latitude=34.2621&longitude=-5.5386"}>Meknes</option>
          <option value={"latitude=34.0209&longitude=-6.8416"}>Rabat</option>
          <option value={"latitude=34.6825&longitude=-1.9102"}>Oujda</option>
          <option value={"latitude=30.4278&longitude=-9.5981"}>Agadir</option>
        </select>
        <button className="refresh" onClick={handleRefresh} ><FontAwesomeIcon size='xl' className={`${darkMode ? 'dark-mode' : 'light-mode'}`} icon={faRefresh} /></button>
      </nav>
      <div className={`${isOpen ? 'open' : ""} ${darkMode ? 'dark-mode' : 'light-mode'} side_menu`} >
        <h2>Weather Now</h2>
        <div>Main menu</div>
        <hr />
        <div>dark mood <input className='check' type="checkbox" checked={darkMode} onChange={toggleDarkMode} /></div>
        <hr />
        <div><a href='https://www.facebook.com/profile.php?id=100085585691648&mibextid=ZbWKwL' >Facebook</a></div>
        <div><a href="#https://instagram.com">Instagram</a></div>
        <div><a href="#https://github.com">GitHub</a></div>
      </div>

      <div className='weather_today'>
        <div className='first_info'>
          <h4>{data && date.toDateString() + ", " + date.getHours() + " : " + date.getMinutes()}</h4>

          <hr />
          <div className="top">
            {data && is_day ? weather.iconD : weather.iconN}
            <div className='deg_status'>
              <h2>{data && data.current.temperature_2m + data.current_units.temperature_2m}</h2>
              <div className="status">{data && weather.status}</div>
            </div>
          </div>
        </div>

        <div className="second_info">
          <h3>report</h3>
          <hr />
          <div>wind speed : <span >{data && data.current.wind_speed_10m + data.current_units.wind_speed_10m}</span></div>
          <div>humidity : <span >{data && data.current.relative_humidity_2m + data.current_units.relative_humidity_2m}</span></div>
          <div>pressure : <span >{data && data.current.pressure_msl + data.current_units.pressure_msl}</span></div>
          <div>cloud cover : <span >{data && data.current.cloud_cover + data.current_units.cloud_cover}</span></div>
          <div>precipitation : <span >{data && data.current.precipitation + data.current_units.precipitation}</span></div>
          <div>precipitation probability : <span >{data && data.current.precipitation_probability + data.current_units.precipitation_probability}</span></div>
          <div>sunrise : <span >{data && sunrise.getHours() + " : " + sunrise.getMinutes()}</span></div>
          <div>sunset : <span >{data && sunset.getHours() + " : " + sunset.getMinutes()}</span></div>
        </div>
      </div>
      <center>by AMINE</center>
      {loading && <Loading />}
      {Error && <Notification message={Error.message} />}
    </div>
  );
}
