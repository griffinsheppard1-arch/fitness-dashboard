"use client";

import { useEffect, useRef, useState } from "react";
import type { RunActivity } from "@/lib/types";

// We dynamically import Leaflet to avoid SSR issues
interface LatLng {
  lat: number;
  lng: number;
}

function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

interface RunRouteMapProps {
  run: RunActivity;
}

export default function RunRouteMap({ run }: RunRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!run.summary_polyline || !mapRef.current || mapInstance) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        // Dynamic import of Leaflet
        const L = (await import("leaflet")).default;

        // Inject Leaflet CSS if not already present
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (cancelled || !mapRef.current) return;

        const points = decodePolyline(run.summary_polyline!);
        if (points.length < 2) return;

        const map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          dragging: false,
          doubleClickZoom: false,
        });

        // Dark tile layer (CartoDB dark_all)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
          }
        ).addTo(map);

        // Draw the route
        const latLngs = points.map((p) => [p.lat, p.lng] as [number, number]);
        const polyline = L.polyline(latLngs, {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.8,
        }).addTo(map);

        // Start marker (green)
        L.circleMarker([points[0].lat, points[0].lng], {
          radius: 5,
          fillColor: "#22c55e",
          color: "#111827",
          weight: 2,
          fillOpacity: 1,
        }).addTo(map);

        // End marker (red)
        const last = points[points.length - 1];
        L.circleMarker([last.lat, last.lng], {
          radius: 5,
          fillColor: "#ef4444",
          color: "#111827",
          weight: 2,
          fillOpacity: 1,
        }).addTo(map);

        // Fit bounds
        map.fitBounds(polyline.getBounds(), { padding: [20, 20] });

        setMapInstance(map);
      } catch {
        setError(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, [run.summary_polyline, mapInstance]);

  if (!run.summary_polyline) return null;
  if (error) return null;

  return (
    <div
      ref={mapRef}
      className="w-full h-[200px] rounded-lg overflow-hidden border border-gray-700"
      style={{ background: "#1a1a2e" }}
    />
  );
}
