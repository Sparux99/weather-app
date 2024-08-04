import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function App() {

  const [data, setData] = useState();
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {

    const coordinates = {
      casablanca: 'latitude=33.5883&longitude=-7.6114',
      tangier: 'latitude=35.7661&longitude=-5.8026',
      marrakech: 'latitude=31.6295&longitude=-7.9811',
      ouarzazate: 'latitude=30.9334&longitude=-6.8937',
      fes: 'latitude=34.0371&longitude=-4.9998',
      meknes: 'latitude=34.2621&longitude=-5.5386',
      rabat: 'latitude=34.0209&longitude=-6.8416',
      oujda: 'latitude=34.6825&longitude=-1.9102',
      agadir: 'latitude=30.4278&longitude=-9.5981'
    };
  
    async function fetchData() {
      setLoading(true)
      try {
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=33.5883&longitude=-7.6114&current=temperature_2m,wind_speed_10m,relative_humidity_2m,pressure_msl,cloud_cover,precipitation,precipitation_probability,rain,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,rain_sum,precipitation_probability_min,sunrise,sunset,weather_code`)
        setData(res.data)
      } catch (err) {
        console.log(err)
        alert(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function weathercode(code){
    
  }
  
  const date = new Date(data.current.time);
  const sunrise = new Date(data.daily.sunrise[1]);
  const sunset = new Date(data.daily.sunset[1]);

  return (
    <div>
      <nav>
        <button className='toggleMenu' onClick={handleClick}>☰</button>
        <select>
          <option>Casablanca</option>
          <option>Tangier</option>
          <option>Marrakech</option>
          <option>Ouarzazate</option>
          <option>Fes</option>
          <option>Meknes</option>
          <option>Rabat</option>
          <option>Oujda</option>
          <option>Agadir</option>
        </select>
      </nav>
      <div className={`${isOpen ? 'open' : ""} side_menu`} >
        <h2>Weather Now</h2>
        <div>Main menu</div>
        <hr />
        <div>dark mood</div>
        <hr />
        <div>About me</div>
        <div><a href='https://facebook.com' >Facebook</a></div>
        <div>Instagram</div>
      </div>

      <div className='weather_today'>
        <div className='first_info'>
          <h4>{ date.toDateString() + ", " + date.getHours() + " : " + date.getMinutes()}</h4>
          
          <hr />
          <div className="top">
            <FontAwesomeIcon className='icon_w' icon={faCloud} />
            <div className='deg_status'>
              <h2>{data.current.temperature_2m} {data.current_units.temperature_2m}</h2>
            <div className="status">clear</div>
            </div>
          </div>
        </div>

        <div className="second_info">
          <h3>report</h3>
          <hr />
          <div>wind speed : <span >{data.current.wind_speed_10m} {data.current_units.wind_speed_10m}</span></div>
          <div>humidity : <span >{data.current.relative_humidity_2m} {data.current_units.relative_humidity_2m}</span></div>
          <div>pressure : <span >{data.current.pressure_msl} {data.current_units.pressure_msl}</span></div>
          <div>cloud cover : <span >{data.current.cloud_cover} {data.current_units.cloud_cover}</span></div>
          <div>precipitation : <span >{data.current.precipitation} {data.current_units.precipitation}</span></div>
          <div>precipitation probability : <span >{data.current.precipitation_probability} {data.current_units.precipitation_probability}</span></div>
          <div>sunrise : <span >{sunrise.getHours() + " : " + sunrise.getMinutes()}</span></div>
          <div>sunset : <span >{sunset.getHours() + " : " + sunset.getMinutes()}</span></div>
        </div>
      </div>
      <center>by AMINE</center>
      <div className="loading">
            <div className="circle"></div>
        </div>
    </div>
  );
}
