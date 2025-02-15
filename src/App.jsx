import { useState, useEffect } from "react";
import "./app.css";

function App() {
  const [data, SetData] = useState();
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [cities, setCities] = useState();
  const [suggetion, setSuggetion] = useState(true);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const urlCoords = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${long}`;
  const urlCities = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${debouncedInput}`;

  const GetWeatherCoords = () => {
    if (lat && long) {
      fetch(urlCoords)
        .then((response) => {
          if (!response.ok) {
            throw new error("404");
          }
          return response.json();
        })
        .then((weatherData) => {
          SetData(weatherData);
          console.log(weatherData);
        });
    }
  };

  const GetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lati = position.coords.latitude;
          const longi = position.coords.longitude;

          setLat(lati);
          setLong(longi);

          console.log(position);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("location is not supported by your browser");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const GetCities = () => {
    if (debouncedInput.trim() !== "") {
      fetch(urlCities)
        .then((response) => {
          if (!response.ok) {
            throw new error("404");
          }
          return response.json();
        })
        .then((citiesResponse) => {
          setCities(citiesResponse);
          console.log(citiesResponse);
        });
    }
    return;
  };

  useEffect(() => {
    GetLocation();
  }, []);
  useEffect(() => {
    GetWeatherCoords();
  }, [lat, long]);
  useEffect(() => {
    GetCities();
  }, [debouncedInput]);

  const HandleChange = (e) => {
    setInput(e.target.value);
    setSuggetion(true);
  };
  const HandleClick = (city) => {
    setLat(city.lat);
    setLong(city.lon);
    setInput("");
    setSuggetion(false);
  };

  return (
    <div className="container">
      <input
        type="text"
        onChange={HandleChange}
        value={input}
        placeholder="Enter a location"
      />
      <div className={suggetion ? "cities" : "hide"}>
        {cities
          ? cities.map((city) => {
              return (
                <div
                  className="city"
                  key={city.id}
                  onClick={() => {
                    HandleClick(city);
                  }}
                >
                  {city.name}, {city.region}, {city.country}
                </div>
              );
            })
          : ""}
      </div>

      {data ? (
        <>
          <h1>{data.location.name}</h1>
          <img src={data.current.condition.icon} alt="weather-icon" />
          <h1 className="temp">{Math.floor(data.current.temp_c)}&deg; C</h1>
          <div className="properties">
            <div className="property">
              <h6>WIND</h6>
              <h4>{data.current.wind_kph} km/h</h4>
            </div>
            <div className="property">
              <h6>HUMIDITY</h6>
              <h4>{data.current.humidity} %</h4>
            </div>
            <div className="property">
              <h6>COUNTRY</h6>
              <h4>{data.location.country}</h4>
            </div>
            <div className="property">
              <h6>CLOUD</h6>
              <h4>{data.current.cloud} %</h4>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>Weather By Asim</h1>
        </div>
      )}
    </div>
  );

  {
    /* return <div className="container"></div>;

  return (
    <div className="container">
      <h1>Loading</h1>
    </div>
  ); */
  }
}

export default App;
