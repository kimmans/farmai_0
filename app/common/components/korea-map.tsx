import { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface FarmLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface KoreaMapProps {
  farms: FarmLocation[];
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 36.5, // South Korea's approximate center
  lng: 127.5,
};

export function KoreaMap({ farms }: KoreaMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (!apiKey) {
    return <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">Google Maps API 키가 필요합니다.</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#444444" }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }],
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: "-100" }, { lightness: "45" }],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#46bcec" }, { visibility: "on" }],
            },
          ],
        }}
      >
        {farms.map((farm) => (
          <Marker
            key={farm.id}
            position={{
              lat: farm.latitude,
              lng: farm.longitude,
            }}
            title={farm.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
} 