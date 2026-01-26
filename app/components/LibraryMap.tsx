"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
  lat: 12.9716, // Bangalore example
    lng: 77.5946,
};

const libraries = [
    { name: "Central Library", lat: 12.9716, lng: 77.5946 },
    { name: "City Library", lat: 12.9352, lng: 77.6101 },
];

export default function LibraryMap() {
    return (
    <div className="mt-10 rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey="AIzaSyChHmmfbyBFYm9dL9HqIOd26-yvKwv3Klc">
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
            styles: [
                { elementType: "geometry", stylers: [{ color: "#1f2933" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#0F172A" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#D4AF37" }] },
            ],
        }}
        >
            {libraries.map((lib, idx) => (
            <Marker key={idx} position={{ lat: lib.lat, lng: lib.lng }} title={lib.name} />
            ))}
        </GoogleMap>
        </LoadScript>
        </div>
        );
}
