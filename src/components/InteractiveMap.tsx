import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Accommodation, DestinationItem, NearbyPlace } from '../types';
import { MapPin, Navigation, Compass, Layers, RefreshCw } from 'lucide-react';

interface InteractiveMapProps {
  destination: DestinationItem;
  accommodations: Accommodation[];
  nearbyAttractions: NearbyPlace[];
  selectedHotelId?: string;
  onSelectHotel?: (hotelId: string) => void;
  onSelectPlace?: (placeId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destination,
  accommodations,
  nearbyAttractions,
  selectedHotelId,
  onSelectHotel,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'hotels' | 'transit' | 'attractions'>('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [destination.coordinates.lat, destination.coordinates.lng],
        zoom: 13,
        scrollWheelZoom: false,
      });

      // Standard OSM Tile layer with smooth rendering
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Yatra Saathi Maps',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when destination changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [destination.coordinates.lat, destination.coordinates.lng],
      13
    );
  }, [destination]);

  // Render Markers according to active filter
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    // 1. Destination Marker (Always shown)
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background:#0F172A; color:#5EEAD4; border:2px solid #0D9488; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-size:16px;">
          📍
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const destMarker = L.marker(
      [destination.coordinates.lat, destination.coordinates.lng],
      { icon: destIcon }
    ).bindPopup(`
      <div style="font-family:sans-serif; padding:4px;">
        <div style="font-size:10px; color:#0D9488; font-weight:bold; text-transform:uppercase;">Selected Destination</div>
        <div style="font-size:14px; font-weight:bold; color:#0F172A; margin:2px 0;">${destination.name}</div>
        <div style="font-size:11px; color:#475569;">${destination.state}</div>
      </div>
    `);
    layerGroup.addLayer(destMarker);
    bounds.push([destination.coordinates.lat, destination.coordinates.lng]);

    // 2. Accommodation Markers
    if (activeFilter === 'all' || activeFilter === 'hotels') {
      accommodations.forEach((hotel) => {
        const isSelected = hotel.id === selectedHotelId;
        const hotelIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background:${isSelected ? '#0D9488' : '#FFFFFF'}; color:${
            isSelected ? '#FFFFFF' : '#0F172A'
          }; border:2px solid ${isSelected ? '#0F766E' : '#0D9488'}; border-radius:12px; padding:3px 8px; font-weight:bold; font-size:11px; display:flex; align-items:center; gap:4px; box-shadow:0 3px 8px rgba(0,0,0,0.2); white-space:nowrap;">
              <span>🏨</span>
              <span>₹${hotel.price}</span>
            </div>
          `,
          iconSize: [65, 26],
          iconAnchor: [32, 13],
        });

        const marker = L.marker([hotel.coordinates.lat, hotel.coordinates.lng], {
          icon: hotelIcon,
        }).bindPopup(`
          <div style="font-family:sans-serif; min-width:180px; padding:4px;">
            <div style="font-size:11px; color:#0D9488; font-weight:bold;">${hotel.type}</div>
            <div style="font-size:13px; font-weight:bold; color:#0F172A; margin-bottom:4px;">${hotel.name}</div>
            <div style="font-size:11px; color:#475569; margin-bottom:6px;">📍 ${hotel.address}</div>
            <div style="font-size:12px; font-weight:bold; color:#0F172A;">₹${hotel.price} / night</div>
            <div style="font-size:11px; color:#64748B; margin-top:2px;">⭐ ${hotel.rating} (${hotel.reviewCount} reviews)</div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectHotel) onSelectHotel(hotel.id);
        });

        layerGroup.addLayer(marker);
        bounds.push([hotel.coordinates.lat, hotel.coordinates.lng]);
      });
    }

    // 3. Transit Markers (Railway Station, Bus Stand, Airport)
    if (activeFilter === 'all' || activeFilter === 'transit') {
      const transitOffsets = [
        {
          name: destination.nearestTransit.railwayStation,
          type: 'Railway Station',
          icon: '🚆',
          color: '#2563EB',
          lat: destination.coordinates.lat + 0.012,
          lng: destination.coordinates.lng - 0.015,
        },
        {
          name: destination.nearestTransit.busStand,
          type: 'Bus Stand',
          icon: '🚌',
          color: '#D97706',
          lat: destination.coordinates.lat - 0.008,
          lng: destination.coordinates.lng + 0.011,
        },
        {
          name: destination.nearestTransit.airport,
          type: 'Airport',
          icon: '✈️',
          color: '#7C3AED',
          lat: destination.coordinates.lat - 0.035,
          lng: destination.coordinates.lng - 0.025,
        },
      ];

      transitOffsets.forEach((transit) => {
        const transitIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background:#FFFFFF; color:${transit.color}; border:2px solid ${transit.color}; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.15); font-size:14px;">
              ${transit.icon}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([transit.lat, transit.lng], { icon: transitIcon })
          .bindPopup(`
            <div style="font-family:sans-serif; padding:4px;">
              <div style="font-size:10px; color:${transit.color}; font-weight:bold; text-transform:uppercase;">${transit.type}</div>
              <div style="font-size:13px; font-weight:bold; color:#0F172A;">${transit.name}</div>
              <div style="font-size:11px; color:#475569; margin-top:2px;">Transit Hub Serving ${destination.name}</div>
            </div>
          `);

        layerGroup.addLayer(marker);
        bounds.push([transit.lat, transit.lng]);
      });
    }

    // 4. Nearby Attractions
    if (activeFilter === 'all' || activeFilter === 'attractions') {
      nearbyAttractions.forEach((place) => {
        const placeIcon = L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="background:#059669; color:#FFFFFF; border:2px solid #047857; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.2); font-size:14px;">
              🏔️
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: placeIcon,
        }).bindPopup(`
          <div style="font-family:sans-serif; min-width:180px; padding:4px;">
            <div style="font-size:10px; color:#059669; font-weight:bold; text-transform:uppercase;">${place.category}</div>
            <div style="font-size:13px; font-weight:bold; color:#0F172A; margin:2px 0;">${place.name}</div>
            <div style="font-size:11px; color:#475569; margin-bottom:4px;">⭐ ${place.rating} (${place.reviewCount} reviews)</div>
            <div style="font-size:11px; color:#0F172A; font-weight:bold;">${place.distanceFromDestination}</div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectPlace) onSelectPlace(place.id);
        });

        layerGroup.addLayer(marker);
        bounds.push([place.coordinates.lat, place.coordinates.lng]);
      });
    }

    if (bounds.length > 1) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(bounds), {
        padding: [30, 30],
        maxZoom: 14,
      });
    }
  }, [accommodations, nearbyAttractions, destination, activeFilter, selectedHotelId]);

  const resetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [destination.coordinates.lat, destination.coordinates.lng],
      13
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Map Control Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Interactive Ground & Transit Map
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing verified stays, transit points & attractions near {destination.name}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Points
          </button>
          <button
            onClick={() => setActiveFilter('hotels')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeFilter === 'hotels'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stays ({accommodations.length})
          </button>
          <button
            onClick={() => setActiveFilter('transit')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeFilter === 'transit'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transit Hubs
          </button>
          <button
            onClick={() => setActiveFilter('attractions')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeFilter === 'attractions'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attractions
          </button>
          <button
            onClick={resetView}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-1"
            title="Reset to Destination Center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[380px] sm:h-[440px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/90 shadow-md text-[11px] space-y-1.5 pointer-events-auto z-[400]">
          <div className="font-bold text-slate-900 mb-1">Map Indicators</div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 text-[9px] flex items-center justify-center text-teal-300">📍</span>
            <span>Destination Center</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3.5 h-3.5 rounded bg-teal-600 text-[9px] flex items-center justify-center text-white">🏨</span>
            <span>Verified Accommodation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 text-[9px] flex items-center justify-center text-white">🚆</span>
            <span>Railway Station</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3.5 h-3.5 rounded bg-amber-600 text-[9px] flex items-center justify-center text-white">🚌</span>
            <span>Bus Terminal</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 text-[9px] flex items-center justify-center text-white">🏔️</span>
            <span>Nearby Attraction</span>
          </div>
        </div>
      </div>
    </div>
  );
};
