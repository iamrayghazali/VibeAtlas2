import React, { useEffect, useState } from "react";
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoPath, geoMercator } from "d3-geo";
import worldData from "../assets/map-data.json";

const SingleCountryMap = ({countryName}) => {
    const [countryId, setCountryId] = useState(null);
    const [countryFeature, setCountryFeature] = useState(null);
    const [mapSettings, setMapSettings] = useState({
        center: [0, 0],
        zoom: 1,
    });

    useEffect(() => {
        const geoId = worldData.objects.world.geometries.find(
            g => g.properties.name.toLowerCase() === countryName.toLowerCase()
        )?.id;

        if (!geoId) return;

        setCountryId(geoId);
    }, [countryName]);

    useEffect(() => {
        if (!countryId) return;

        const geoJson = feature(worldData, worldData.objects.world);
        const country = geoJson.features.find((f) => f.id === countryId);
        if (!country) return;

        setCountryFeature(country);

        // Setup a new projection that fits the country inside 800x600
        const projection = geoMercator().fitExtent([[0, 0], [800, 600]], country);

        // Save projection config: we only need the scale and center
        const center = projection.invert([400, 300]); // center of the map
        const scale = projection.scale();

        setMapSettings({
            center,
            zoom: scale,
        });
    }, [countryId]);

    return (
        <div className=" w-max h-60 flex items-center justify-center">
            <ComposableMap
                projection="geoMercator"
                width={800}
                height={600}
                projectionConfig={{
                    center: mapSettings.center,
                    scale: mapSettings.zoom,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies
                    geography={{
                        type: "FeatureCollection",
                        features: countryFeature ? [countryFeature] : [],
                    }}
                >
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                    default: { fill: "#F0EAD6", stroke: "#000" },
                                    hover: { fill: "#F18F01", stroke: "#000" },
                                    pressed: { fill: "#E42" },
                                }}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default SingleCountryMap;