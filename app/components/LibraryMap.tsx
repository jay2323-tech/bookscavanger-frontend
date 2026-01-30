"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Library = {
  name: string;
  latitude: number;
  longitude: number;
};

interface Props {
  libraries?: Library[];
}

export default function LibraryMap({ libraries = [] }: Props) {
  const center = libraries.length
    ? { lat: libraries[0].latitude, lng: libraries[0].longitude }
    : { lat: 12.9716, lng: 77.5946 }; // fallback (Bangalore)

  return (
    <div className="mt-10 rounded-lg overflow-hidden">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={center}
          zoom={12}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#1f2933" }] },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#0F172A" }],
              },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#D4AF37" }],
              },
            ],
          }}
        >
          {libraries.map((lib, idx) => (
            <Marker
              key={idx}
              position={{ lat: lib.latitude, lng: lib.longitude }}
              title={lib.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
