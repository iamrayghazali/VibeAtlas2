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

        const projection = geoMercator();
        const pathGenerator = geoPath().projection(projection);
        const bounds = pathGenerator.bounds(country);
        const [[x0, y0], [x1, y1]] = bounds;

        projection.fitExtent([[0, 0], [800, 600]], country);
        const scale = projection.scale();

        setMapSettings({
            center: projection.invert([(x0 + x1) / 2, (y0 + y1) / 2]),
            zoom: scale / 200,
        });
    }, [countryId]);

    return (
        <div className="bg-white w-60 h-80 flex items-center justify-center">
            <ComposableMap
                projection="geoMercator"
                width={800}
                height={600}
                style={{ width: "100%", height: "100%" }}
            >
                <ZoomableGroup
                    center={mapSettings.center}
                    zoom={mapSettings.zoom}
                    disablePanning
                >
                    <Geographies
                        geography={{
                            type: "FeatureCollection",
                            features: [countryFeature],
                        }}
                    >
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={{
                                        default: { fill: "#D6D6DA", stroke: "#000" },
                                        hover: { fill: "#F53", stroke: "#000" },
                                        pressed: { fill: "#E42" },
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