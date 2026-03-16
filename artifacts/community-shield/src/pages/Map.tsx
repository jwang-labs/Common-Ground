import { useEffect, useState } from "react";
import { useGetPrecinctStats } from "@workspace/api-client-react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Activity, ShieldAlert, Award, TrendingUp } from "lucide-react";
import type { PrecinctStat } from "@workspace/api-client-react";

export default function MapPage() {
  const { data: stats, isLoading } = useGetPrecinctStats();
  const [selectedPrecinct, setSelectedPrecinct] = useState<PrecinctStat | null>(null);

  // Fallback center if no data (e.g., center of US)
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const mapCenter = stats && stats.length > 0 
    ? [stats[0].latitude, stats[0].longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-5rem)] md:h-[calc(100vh-4rem)] w-full relative bg-slate-50 overflow-hidden animate-in fade-in duration-500">
      
      {/* Map Overlay Panel */}
      <div className="absolute top-4 left-4 md:left-8 z-[1000] w-[calc(100%-2rem)] md:w-96 max-h-[80vh] flex flex-col pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-5 pointer-events-auto flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Precinct Data</h1>
            <p className="text-sm text-slate-500">Select a precinct marker to view anonymized community statistics.</p>
          </div>

          {selectedPrecinct ? (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="py-3 border-t border-slate-100">
                <h2 className="text-lg font-bold text-primary mb-3">{selectedPrecinct.precinct}</h2>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Reports</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{selectedPrecinct.totalReports}</span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Praises</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{selectedPrecinct.totalRecognitions}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Politeness Rating</span>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedPrecinct.avgPoliteness ? `${(selectedPrecinct.avgPoliteness * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(selectedPrecinct.avgPoliteness || 0) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-600">Use of Force Rate</span>
                    <span className="text-sm font-bold text-orange-600">
                      {selectedPrecinct.forceRate ? `${(selectedPrecinct.forceRate * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-600">Top Incident Type</span>
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {selectedPrecinct.topIncidentType?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center border-t border-slate-100">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No precinct selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full w-full relative z-0">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-sm z-[500] flex items-center justify-center">
            <div className="bg-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium text-slate-700">Loading map data...</span>
            </div>
          </div>
        )}
        
        <MapContainer 
          center={mapCenter} 
          zoom={stats && stats.length > 0 ? 12 : 4} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {stats?.map((stat) => {
            // Calculate color and size based on data
            const ratio = stat.totalRecognitions / Math.max(1, stat.totalReports);
            const isPositive = ratio > 0.5;
            const radius = Math.max(12, Math.min(40, stat.totalReports * 2));
            
            return (
              <CircleMarker
                key={stat.precinct}
                center={[stat.latitude, stat.longitude]}
                radius={radius}
                pathOptions={{ 
                  fillColor: isPositive ? '#0d9488' : '#2563eb', // Teal or Blue
                  color: 'white', 
                  weight: 2,
                  fillOpacity: 0.7 
                }}
                eventHandlers={{
                  click: () => setSelectedPrecinct(stat),
                }}
              >
                <Popup className="custom-popup">
                  <div className="font-bold text-center">{stat.precinct}</div>
                  <div className="text-xs text-center text-slate-500 mt-1">Click to view details</div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <style>{`
        /* Minimalist map styling */
        .map-tiles {
          filter: grayscale(0.8) contrast(1.2) brightness(1.1);
        }
      `}</style>
    </div>
  );
}
