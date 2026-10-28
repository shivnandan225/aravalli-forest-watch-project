import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Language, EscalationCase } from '../types';
import { MapPin, Layers, Search, Shield, Radio, Camera, AlertCircle, Compass } from 'lucide-react';

interface MapPanelProps {
  language: Language;
  cases: EscalationCase[];
  onSelectCase: (c: EscalationCase) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
}

// Illustrative boundary coordinates near Udaipur, Rajasthan
const DEMO_ZONE_COORDS: [number, number][] = [
  [24.64, 73.58],
  [24.67, 73.75],
  [24.56, 73.82],
  [24.48, 73.74],
  [24.50, 73.59],
  [24.64, 73.58],
];

const PRESET_PLACES: Record<string, [number, number]> = {
  udaipur: [24.58, 73.68],
  kumbhalgarh: [25.15, 73.58],
  'mount abu': [24.59, 72.71],
  ranakpur: [25.11, 73.47],
  alwar: [27.55, 76.63],
  sariska: [27.32, 76.43],
  jodhpur: [26.29, 73.02],
  jaipur: [26.91, 75.78],
};

export const MapPanel: React.FC<MapPanelProps> = ({
  language,
  cases,
  onSelectCase,
  onMapClickCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedCoord, setPinnedCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Basemap tile layers
  const streetsUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [24.58, 73.68],
      zoom: 12,
      zoomControl: true,
    });

    const tileLayer = L.tileLayer(satelliteUrl, {
      attribution: '&copy; Esri &mdash; Earthstar Geographics, OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Draw Illustrative Conservation Zone Polygon
    const zonePolygon = L.polygon(DEMO_ZONE_COORDS, {
      color: '#c9d99f',
      weight: 2,
      opacity: 0.8,
      fillColor: '#34d399',
      fillOpacity: 0.12,
      dashArray: '6, 6',
    }).addTo(map);

    zonePolygon.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #111;">
        <strong style="color: #244232;">Aravalli Conservation Sector 4</strong><br/>
        Status: Active Ecological Monitoring<br/>
        <em>Illustrative polygon near Udaipur</em>
      </div>
    `);

    // Markers layer group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Fixed hardware nodes
    const acousticIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background: #14281d; border: 2px solid #e2be82; border-radius: 50%; width: 28px; height: 28px; display: flex; items-center: center; justify-content: center; box-shadow: 0 0 10px rgba(226,190,130,0.5); color: #e2be82; font-size: 14px; line-height: 24px; text-align: center;">
          🎙
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const cameraIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background: #14281d; border: 2px solid #38bdf8; border-radius: 50%; width: 28px; height: 28px; display: flex; items-center: center; justify-content: center; box-shadow: 0 0 10px rgba(56,189,248,0.5); color: #38bdf8; font-size: 14px; line-height: 24px; text-align: center;">
          📷
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([24.5912, 73.6645], { icon: acousticIcon })
      .addTo(map)
      .bindPopup('<strong>Node ACOUSTIC-NOD-4B</strong><br/>Edge WebAudio processor · Active');

    L.marker([24.5721, 73.7012], { icon: acousticIcon })
      .addTo(map)
      .bindPopup('<strong>Node ACOUSTIC-NOD-7C</strong><br/>Ridge Acoustic Sentinel · Active');

    L.marker([24.5421, 73.6189], { icon: cameraIcon })
      .addTo(map)
      .bindPopup('<strong>Node CAM-OPTICAL-02</strong><br/>Solar Optical Frame Sentinel · Active');

    // Click handler for coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPinnedCoord({ lat, lng });
      if (onMapClickCoordinates) {
        onMapClickCoordinates(Number(lat.toFixed(5)), Number(lng.toFixed(5)));
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update basemap when toggled
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);

    const newUrl = basemap === 'satellite' ? satelliteUrl : streetsUrl;
    const newLayer = L.tileLayer(newUrl, {
      attribution:
        basemap === 'satellite'
          ? '&copy; Esri &mdash; Earthstar Geographics'
          : '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapRef.current);

    tileLayerRef.current = newLayer;
  }, [basemap]);

  // Update dynamic alert markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    cases.forEach((c) => {
      if (c.status === 'Dismissed') return;

      const isPending = c.status === 'Pending review';
      const color = c.level === 3 ? '#ef4444' : c.level === 2 ? '#f59e0b' : '#38bdf8';

      const alertIcon = L.divIcon({
        className: 'custom-alert-icon',
        html: `
          <div style="position: relative; width: 32px; height: 32px; cursor: pointer;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 3px; border-radius: 50%; background: #0c1611; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; color: ${color}; font-weight: bold; font-size: 11px;">
              L${c.level}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: alertIcon }).addTo(
        markersLayerRef.current!
      );

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #111; max-width: 220px;">
          <strong style="color: ${color};">${c.title}</strong><br/>
          <span style="font-size: 11px; color: #555;">Level: ${c.level} · Status: ${c.status}</span><br/>
          <span style="font-size: 11px; color: #777;">Device: ${c.deviceId}</span><br/>
          <button id="view-case-${c.id}" style="margin-top: 6px; padding: 4px 8px; background: #244232; color: #fff; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">
            Open Case Details
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-case-${c.id}`);
        if (btn) {
          btn.onclick = () => onSelectCase(c);
        }
      });
    });
  }, [cases, onSelectCase]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapRef.current || !searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();

    if (PRESET_PLACES[query]) {
      const [lat, lng] = PRESET_PLACES[query];
      mapRef.current.flyTo([lat, lng], 13);
      return;
    }

    // Default: search via OSM Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Rajasthan India')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          mapRef.current?.flyTo([lat, lon], 13);
        }
      })
      .catch(() => {});
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-[#244232] bg-[#0c1611] shadow-2xl flex flex-col">
      {/* Top Search & Controls Bar */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="pointer-events-auto flex items-center shadow-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-[#869e90] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'स्थान खोजें (उदा. Udaipur, Kumbhalgarh)...' : 'Search location (e.g. Udaipur, Kumbhalgarh)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 sm:w-72 pl-9 pr-3 py-1.5 rounded-lg bg-[#0e1913]/90 backdrop-blur-md border border-[#2b4d3a] text-xs font-mono-code text-white placeholder-[#688575] focus:outline-none focus:border-[#c9d99f]"
            />
          </div>
        </form>

        {/* Layer Toggles & Coordinates Display */}
        <div className="pointer-events-auto flex items-center gap-2">
          {pinnedCoord && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1913]/90 backdrop-blur-md border border-[#2b4d3a] text-[11px] font-mono-code text-[#c9d99f]">
              <MapPin className="w-3.5 h-3.5 text-[#e2be82]" />
              <span>{pinnedCoord.lat.toFixed(4)}°N, {pinnedCoord.lng.toFixed(4)}°E</span>
            </div>
          )}

          <div className="flex items-center p-0.5 rounded-lg bg-[#0e1913]/90 backdrop-blur-md border border-[#2b4d3a] text-xs">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                basemap === 'satellite'
                  ? 'bg-[#213d2d] text-[#c9d99f] shadow'
                  : 'text-[#869e90] hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemap('streets')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                basemap === 'streets'
                  ? 'bg-[#213d2d] text-[#c9d99f] shadow'
                  : 'text-[#869e90] hover:text-white'
              }`}
            >
              Terrain / Streets
            </button>
          </div>
        </div>
      </div>

      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend Overlay at Bottom Right */}
      <div className="absolute bottom-3 right-3 z-[1000] p-2.5 rounded-xl bg-[#0c1611]/90 backdrop-blur-md border border-[#223d2e] text-[11px] font-mono-code text-[#a3b8aa] space-y-1 shadow-lg pointer-events-auto">
        <div className="text-[10px] uppercase text-[#6d8a79] font-bold border-b border-[#1e3328] pb-1 mb-1">
          {language === 'hi' ? 'मानचित्र संकेत' : 'Map Layers & Nodes'}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-400"></span>
          <span>Aravalli Sector 4 Boundary</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#e2be82]">🎙</span>
          <span>Acoustic Edge Nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#38bdf8]">📷</span>
          <span>Optical Vision Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span>Active Escalation Alert</span>
        </div>
      </div>

      {/* Instructions Overlay at Bottom Left */}
      <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-[#0c1611]/85 backdrop-blur-md border border-[#223d2e] text-[10px] font-mono-code text-[#869e90] pointer-events-none">
        Click anywhere on map to transfer coordinates to Community Report
      </div>
    </div>
  );
};
