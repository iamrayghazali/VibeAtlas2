import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {Tooltip} from "react-tooltip";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";

function Home() {
    const navigate = useNavigate();
    const [currentCountry, setCurrentCountry] = useState();
    const user = useAuth();
    return (
        <div>
            <h1>Where are you vibin' today?</h1>

            <Tooltip id="my-tooltip" />
            <ComposableMap data-tip="">
                <Geographies geography="/src/assets/map-data.json">
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo}
                                       onMouseEnter={() => {
                                           const {name} = geo.properties;
                                           setCurrentCountry(`${name}`);
                                       }}
                                       onMouseLeave={() => {
                                           setCurrentCountry("");
                                       }}
                                       onClick={() => { user ? navigate("/recommendations/") : navigate("/login/")}}
                                       data-tooltip-content={geo.properties.name}
                                       data-tooltip-id="my-tooltip"
                                       className="hover:fill-brown  transition-transform duration-200 ease-in-out"                  />
                        ))
                    }
                </Geographies>
            </ComposableMap>
            //TODO add dropdown countries
            //TODO add dropdown city



        </div>
    );
}

export default Home;