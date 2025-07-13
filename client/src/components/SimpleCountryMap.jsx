import React, { useEffect, useState } from "react";
import {ComposableMap, Geographies, Geography, ZoomableGroup} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";
import worldData from "../assets/map-data.json";

const SingleCountryMap = ({ countryName }) => {
    const [countryFeature, setCountryFeature] = useState(null);
    const [mapSettings, setMapSettings] = useState({ center: [0, 0], zoom: 1 });

    useEffect(() => {
        const geoJson = feature(worldData, worldData.objects.world);
        const country = geoJson.features.find(
            f => f.properties.name.toLowerCase() === countryName.toLowerCase()
        );

        if (!country) return;
        setCountryFeature(country);

        // Manually compute center
        const [xMin, yMin, xMax, yMax] = country.bbox || computeBBox(country);
        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;

        setMapSettings({
            center: [centerX, centerY],
            zoom: 4.5, // Try 5–8 depending on country size
        });
    }, [countryName]);


    const computeBBox = (feature) => {
        const coords = feature.geometry.coordinates.flat(Infinity);
        const xs = coords.filter((_, i) => i % 2 === 0);
        const ys = coords.filter((_, i) => i % 2 === 1);
        return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    };


    return (
        <div className="w-xl  h-60 flex items-center justify-center">
            <ComposableMap width={800} height={600}>
                <ZoomableGroup center={mapSettings.center} zoom={mapSettings.zoom}>
                    <Geographies geography={{ type: "FeatureCollection", features: [countryFeature] }}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={{
                                        default: { fill: "#f0ead6", outline: "none" },
                                        hover: { fill: "#ffcc80", outline: "none" },
                                        pressed: { fill: "#ffb74d", outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};

export default SingleCountryMap;