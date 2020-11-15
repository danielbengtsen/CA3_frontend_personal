import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";


export function Home() {
    return (
        <div>
            <div>
                <h2>Welcome!</h2>
                <hr></hr>
            </div>
            <div>
                <h5>How to use our API?</h5>
                    <ul>
                    <li>For all visitors of the website:</li>
                        <ul>
                            <li>The "Home" tab:</li>
                            <ul>
                                <li>This page!</li>
                            </ul>
                            <li>The "Address Info" tab:</li>
                            <ul>
                                <li>Enter an address and find the nearest postal box as well as a weather report from the city you entered.</li>
                            </ul>
                            <li>The "Login" tab:</li>
                            <ul>
                                <li>Login and gain access to more content!</li>
                            </ul>
                        </ul>

                        <br></br>

                        <li>If you're logged in (more content):</li>
                        <ul>
                            <li>As user:</li>
                            <ul>
                                <li>The "Movies" tab:</li>
                                <ul>
                                    <li>Enter a movie title, and get a corresponding review summary and a link to the full review from the New York Times.</li>
                                </ul>
                            </ul>
                            <li>As admin:</li>
                            <ul>
                                <li>The "Digital Ocean Info" tab:</li>
                                <ul>
                                    <li>Lookup information about the Droplets that the hoster has.</li>
                                </ul>
                            </ul>
                        </ul>

                    </ul>
            </div>

            <div>
                <h5>Personal description:</h5>
                <p>I used the startcode by adding the new endpoint link to "Settings.js". Then I added the fetch function to "apiFacade.js". Then I added the functionality to "Components.js". In the end, I added the navbar and link to "App.js" and the new functionality was implemented.</p>
            </div>
        </div>
    );
}

export function Login({ login }) {

    const init = { username: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
    }
    return (
        <div>
            <h2>Login here</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" />
                <input placeholder="Password" type="password" id="password" />
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )
}

export function LoggedIn({username}) {

const  token = apiFacade.getToken();
const  decoded = jwt_decode(token); // jwt_decode is an external library
console.log(decoded);
    return (
        <div>
            <h2>You are now logged in!</h2>
            <p>Welcome {username}, your role is: {decoded.roles}</p>
        </div>
    )
}

export function DigitalOcean() {

    const [string, setString] = useState('');
    const [droplets, setDroplets] = useState([]);
    const display = droplets.map((droplet, index) => {
        const network = droplet.networks.v4[0];
        return (
            <React.Fragment>
                <tr>
                    <th>Droplet Name</th>
                    <td>{droplet.name}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{droplet.created_at}</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{droplet.memory} MB</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{droplet.status}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>{droplet.region.name}</td>
                </tr>
                <tr>
                    <th>Monthly price</th>
                    <td>${droplet.size.price_monthly}</td>
                </tr>
                <tr>
                    <th>Gateway</th>
                    <td>{network.gateway}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{network.ip_address}</td>
                </tr>
                <tr>
                    <th>Netmask</th>
                    <td>{network.netmask}</td>
                </tr>
            </React.Fragment>
        )
    })
    
    useEffect (() => {
               apiFacade.getDigitalOceanInfo()
               .then(data => setDroplets(data.droplets))
    }, [string])


    return (
        <div>
            <Table striped bordered hover>
                {display}
            </Table>
        </div>
    )
}

export function Movies() {

    const [movieSearchWord, setMovieSearchWord] = useState("");
    const [movieArray, setMovieArray] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getMovieReviews(movieSearchWord)
        .then(data => {
            const array = data.results;
            setMovieArray(array);
        })
      };


      const allMovies = movieArray.map((movie, index)=> (
        <div>
            <ul key={index+1}>
                <li>{movie.display_title} - <a href={movie.link.url}>Details</a></li>
                <p>Review Summary: {movie.summary_short}</p>
            </ul>
            <hr></hr>
        </div>
        )
    );

    return (
        <div>
            <div>
                <input placeholder="Enter movie title" onChange={(event) => setMovieSearchWord(event.target.value)}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <br></br>
            <div>
                {allMovies}
            </div>
        </div>
    );
}

export function Address() {
    const initialWeather = {
        Sunrise: "",
        Sunset: "",
        Datetime: "",
        Cityname: "",
        Temperature: "",
        ApparentTemperature: "",
        Description: ""
      }
      const [weather, setWeather] = useState(initialWeather);
    
      const initialValue = {
        city: "",
        postalCode: "",
        streetName: "",
        streetNumber: ""
      }
    
      const [address, setAddress] = useState(initialValue);
      const [servicePoints, setServicePoints] = useState([]);
      let [isBlocking, setIsBlocking] = useState(false);
    
      const handleChange = event => {
        const { id, value } = event.target;
        setIsBlocking(event.target.value.length > 0);
        setAddress({ ...address, [id]: value })
      };
    
      const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getServicePoints(address)
        .then(data => {
          const temp = data.weather.data[0];
          setServicePoints(data.postnord.servicePointInformationResponse.servicePoints);
          setWeather({
            Sunrise: data.sunrise,
            Sunset: temp.sunset,
            Datetime: temp.datetime,
            Cityname: temp.city_name,
            Temperature: temp.temp,
            ApparentTemperature: temp.app_temp,
            Description: temp.weather.description
          });
        })
      };

      return (
          <div>
            <AddressInfo isBlocking={isBlocking} handleChange={handleChange} handleSubmit={handleSubmit} servicePoints={servicePoints} />
            <hr></hr>
            <WeatherInfo weather={weather} />
          </div>
      )
}

export function SportPredictionOdds()
{
    const [sportPredictions, setSportPredictions] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getSportPredictions()
        .then(data => {
          setSportPredictions(data.data);
        })
    };

    return (
        <div>
            <div>
                <h2>Sport Predictions</h2>
            </div>
            <div>
                <button onClick={handleSubmit}>Show me the predictions!</button>
            </div>
            <hr></hr>
            <div>
            <SportInfo sportPredictions={ sportPredictions } />
            </div>
        </div>
    );
}

export function AddressInfo({isBlocking, handleChange, handleSubmit, servicePoints }) {

    const allServicePoints = servicePoints.map((servicePoint, index) => (
        <div>
            <h5>Pakkeboks: {index+1}</h5>
            <ul key={servicePoint.servicePointId}>
                <li>{servicePoint.servicePointId}</li>
                <li>{servicePoint.name}</li>
            </ul>
        </div>
    ));

    return (
        <div>
            <h2>What's the address?</h2>
            <div>
                <form onChange={handleChange}>
                    <Prompt when={isBlocking} message={() => "You have unsaved data. Press \"Cancel\" to keep your changes."} />
                    <input type="text" id="city" placeholder="City..." />
                    <br></br>
                    <input type="text" id="postalCode" placeholder="Zip..." />
                    <br></br>
                    <input type="text" id="streetName" placeholder="Street..." />
                    <br></br>
                    <input type="text" id="streetNumber" placeholder="Street number..." />
                    <br></br>
                    <input type="submit" value="Enter" onClick={handleSubmit} />
                </form>
            </div>
            <hr></hr>
            <div>
                {allServicePoints}
            </div>
        </div>
    );
}

export function WeatherInfo({ weather }) {
    return (
        <div>
            <h2>Weather at the given address</h2>
            <Log value={weather} />
        </div>
    )
}

export function SportInfo({ sportPredictions })
{
    function isExpired(string)
    {
        if(string == false)
        {
            return "No";
        } else if(string == true)
        {
            return "Yes";
        } else
        {
            return "unknown";
        }
    }

    function hasResult(string)
    {
        if(string === "")
        {
            return "No result yet"
        }
    }

    const allSportPredictions = sportPredictions.map(sportPrediction => (
        <div>
            <h5>Odds id: {sportPrediction.id}</h5>
            <ul key={sportPrediction.id}>
                <li>Home Team: {sportPrediction.home_team}</li>
                <li>Away Team: {sportPrediction.away_team}</li>
                <li>Competition: {sportPrediction.competition_name}</li>
                <li>Prediction: {sportPrediction.prediction}</li>
                <li>Status: {sportPrediction.status}</li>
                <li>Expired: {isExpired(sportPrediction.is_expired)}</li>
                <li>Result: {hasResult(sportPrediction.result)}</li>
                <li>Start date: {sportPrediction.start_date}</li>
                <li>Last updated: {sportPrediction.last_update_at}</li>
                <ul>
                    <li>1: {sportPrediction.odds['1']}</li>
                    <li>X: {sportPrediction.odds['X']}</li>
                    <li>2: {sportPrediction.odds['2']}</li>
                    <li>1X: {sportPrediction.odds['1X']}</li>
                    <li>X2: {sportPrediction.odds['X2']}</li>
                    <li>12: {sportPrediction.odds['12']}</li>
                </ul>
            </ul>
        </div>
        )
    );
    return(
        <div>
            {allSportPredictions}
        </div>
    );
}

const Log = ({ value, replacer = null, space = 2 }) => (
    <pre>
        <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
)

export function NoMatch() {
    return (
        <div>
            <h2>Sorry, we couldn't find that page...</h2>
        </div>
    );
}