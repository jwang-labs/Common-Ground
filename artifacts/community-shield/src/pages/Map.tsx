import { useEffect, useState, useRef } from "react";
import { useGetPrecinctStats } from "@workspace/api-client-react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Activity, ShieldAlert, Award, X, ChevronUp } from "lucide-react";
import type { PrecinctStat } from "@workspace/api-client-react";
import L from "leaflet";
import "leaflet.heat";

declare module "leaflet" {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: Record<string, unknown>
  ): L.Layer;
}

function SetViewOnData({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center[0], center[1], zoom]);
  return null;
}

function HeatmapLayer({ stats }: { stats: PrecinctStat[] }) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    if (!stats || stats.length === 0) return;

    const maxReports = Math.max(...stats.map((s) => s.totalReports), 1);
    const points: [number, number, number][] = stats.map((stat) => [
      stat.latitude,
      stat.longitude,
      stat.totalReports / maxReports,
    ]);

    const heat = L.heatLayer(points, {
      radius: 40,
      blur: 30,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: "#0d9488",
        0.3: "#14b8a6",
        0.5: "#f59e0b",
        0.7: "#f97316",
        0.85: "#ef4444",
        1.0: "#dc2626",
      },
    });

    heat.addTo(map);
    layerRef.current = heat;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [stats, map]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });
  return null;
}

export default function MapPage() {
  const { data: stats, isLoading } = useGetPrecinctStats();
  const [selectedPrecinct, setSelectedPrecinct] = useState<PrecinctStat | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const defaultCenter: [number, number] = [30.2672, -97.7431];
  const mapCenter = stats && stats.length > 0 
    ? [stats[0].latitude, stats[0].longitude] as [number, number]
    : defaultCenter;

  const handleSelectPrecinct = (stat: PrecinctStat) => {
    setSelectedPrecinct(stat);
    setSheetExpanded(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] w-full relative bg-background overflow-hidden animate-in fade-in duration-500">
      
      <div className="absolute top-4 left-4 md:left-8 z-[1000] w-[calc(100%-2rem)] md:w-96 max-h-[80vh] flex flex-col pointer-events-none">
        <div className="bg-card/90 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-none border border-border p-5 pointer-events-auto flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Precinct Data</h1>
              <p className="text-sm text-muted-foreground">Select a hotspot area to view anonymized community statistics.</p>
            </div>
            {selectedPrecinct && (
              <button
                onClick={() => setSelectedPrecinct(null)}
                className="ml-2 mt-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {selectedPrecinct ? (
            <PrecinctDetails precinct={selectedPrecinct} />
          ) : (
            <div className="py-8 text-center border-t border-border">
              <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No precinct selected</p>
            </div>
          )}
        </div>
      </div>

      <div className={`md:hidden absolute bottom-0 left-0 right-0 z-[1000] transition-transform duration-300 ease-out ${sheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
        <div className="bg-card/95 backdrop-blur-xl rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] dark:shadow-none border-t border-border">
          <button 
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-full flex flex-col items-center pt-2 pb-3 px-4"
          >
            <div className="w-10 h-1 bg-muted rounded-full mb-2"></div>
            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                {selectedPrecinct ? selectedPrecinct.precinct : "Precinct Data"}
              </span>
              <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${sheetExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto">
            {selectedPrecinct ? (
              <PrecinctDetails precinct={selectedPrecinct} />
            ) : (
              <div className="py-6 text-center">
                <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm font-medium">Tap a marker to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full w-full relative z-0">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[500] flex items-center justify-center">
            <div className="bg-card px-6 py-4 rounded-full shadow-lg dark:shadow-none border border-border flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium text-foreground">Loading map data...</span>
            </div>
          </div>
        )}
        
        <MapContainer 
          center={mapCenter} 
          zoom={stats && stats.length > 0 ? 12 : 4} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <SetViewOnData center={mapCenter} zoom={stats && stats.length > 0 ? 12 : 10} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {stats && stats.length > 0 && <HeatmapLayer stats={stats} />}
          
          <MapClickHandler onMapClick={() => setSelectedPrecinct(null)} />
          
          {(() => {
            const maxReports = Math.max(...(stats?.map(s => s.totalReports) || [1]), 1);
            return stats?.map((stat) => {
            const intensity = stat.totalReports / maxReports;

            return (
              <CircleMarkerInvisible
                key={stat.precinct}
                stat={stat}
                intensity={intensity}
                onSelect={handleSelectPrecinct}
              />
            );
          });
          })()}
        </MapContainer>
      </div>

      <style>{`
        .map-tiles {
          filter: grayscale(0.8) contrast(1.2) brightness(1.1);
        }
        .dark .map-tiles {
          filter: grayscale(0.8) contrast(1.2) brightness(0.7) invert(1) hue-rotate(180deg);
        }
      `}</style>
    </div>
  );
}

function CircleMarkerInvisible({ stat, intensity, onSelect }: { stat: PrecinctStat; intensity: number; onSelect: (s: PrecinctStat) => void }) {
  const map = useMap();
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    const radius = Math.max(14, Math.min(45, 14 + intensity * 31));

    const marker = L.circleMarker([stat.latitude, stat.longitude], {
      radius,
      fillColor: "transparent",
      color: "transparent",
      weight: 0,
      fillOpacity: 0,
    });

    marker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      onSelect(stat);
    });

    const tooltipEl = document.createElement("div");
    const titleEl = document.createElement("div");
    titleEl.style.cssText = "font-weight:bold;text-align:center";
    titleEl.textContent = stat.precinct;
    const subtitleEl = document.createElement("div");
    subtitleEl.style.cssText = "font-size:11px;text-align:center;color:#94a3b8;margin-top:2px";
    subtitleEl.textContent = "Click to view details";
    tooltipEl.appendChild(titleEl);
    tooltipEl.appendChild(subtitleEl);

    marker.bindTooltip(tooltipEl, { direction: "top", offset: [0, -10] });

    marker.addTo(map);
    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [stat, intensity, map, onSelect]);

  return null;
}

function PrecinctDetails({ precinct }: { precinct: PrecinctStat }) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="py-3 border-t border-border">
        <h2 className="text-lg font-bold text-primary mb-3">{precinct.precinct}</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Reports</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{precinct.totalReports}</span>
          </div>
          
          <div className="bg-muted rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Praises</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{precinct.totalRecognitions}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Politeness Rating</span>
            <span className="text-sm font-bold text-foreground">
              {precinct.avgPoliteness ? `${(precinct.avgPoliteness * 100).toFixed(0)}%` : 'N/A'}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(precinct.avgPoliteness || 0) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">Use of Force Rate</span>
            <span className="text-sm font-bold text-orange-400">
              {precinct.forceRate ? `${(precinct.forceRate * 100).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">Top Incident Type</span>
            <span className="text-sm font-bold text-foreground capitalize">
              {precinct.topIncidentType?.replace('_', ' ') || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
