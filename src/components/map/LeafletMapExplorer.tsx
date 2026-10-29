import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Report } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { ThumbsUp, MapPin, Eye } from 'lucide-react';

// Create custom modern SVG pin icon
function createCustomMarkerIcon(status: string, category: string) {
  let color = '#2563eb'; // blue
  if (status === 'Resolved') color = '#059669'; // emerald
  else if (status === 'Rejected') color = '#dc2626'; // red
  else if (category === 'Road Damage') color = '#ea580c'; // orange
  else if (category === 'Garbage') color = '#d97706'; // amber
  else if (category === 'Water Supply' || category === 'Drainage') color = '#0284c7'; // sky
  else if (category === 'Streetlights' || category === 'Electricity') color = '#eab308'; // yellow

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="12" cy="11" r="5" fill="#ffffff"/>
      <circle cx="12" cy="11" r="2.5" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36],
  });
}

// Helper component to auto-pan when reports change
function MapCenterController({ reports }: { reports: Report[] }) {
  const map = useMap();

  useEffect(() => {
    const validReports = reports.filter(
      (r) =>
        r.location &&
        Array.isArray(r.location.coordinates) &&
        r.location.coordinates.length === 2
    );

    if (validReports.length > 0) {
      const bounds = L.latLngBounds(
        validReports.map((r) => [
          r.location!.coordinates[1], // lat
          r.location!.coordinates[0], // lng
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, map]);

  return null;
}

interface LeafletMapExplorerProps {
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  className?: string;
}

export const LeafletMapExplorer: React.FC<LeafletMapExplorerProps> = ({
  reports,
  onSelectReport,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md',
}) => {
  const { t } = useLanguage();

  // Filter reports that have coordinates
  const mappedReports = reports.filter(
    (r) =>
      r.location &&
      Array.isArray(r.location.coordinates) &&
      r.location.coordinates.length === 2 &&
      !isNaN(r.location.coordinates[0]) &&
      !isNaN(r.location.coordinates[1])
  );

  // Default Bozra, Ulipur, Kurigram coordinates: 25.5891 N, 89.5935 E
  /*
 * Default map center now covers the three key areas of the project:
 *   • Gunaigach – 25.5710, 89.5770
 *   • Ulipur (Kurigram) – 25.5775, 89.5960
 *   • Kurigram Town – 25.4567, 89.6420
 * We calculate the average point so the map is nicely centered. The MapCenterController
 * will later fit bounds to actual report markers.
 */
const defaultCenter: [number, number] = [
  // average latitude of the three areas
  (25.5710 + 25.5775 + 25.4567) / 3,
  // average longitude of the three areas
  (89.5770 + 89.5960 + 89.6420) / 3,
];

  return (
    <div className={`relative z-10 ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterController reports={mappedReports} />

        {mappedReports.map((report) => {
          const lat = report.location!.coordinates[1];
          const lng = report.location!.coordinates[0];
          const customIcon = createCustomMarkerIcon(report.status, report.category);

          return (
            <Marker key={report._id} position={[lat, lng]} icon={customIcon}>
              <Popup className="custom-report-popup">
                <div className="p-1 max-w-[260px]">
                  {report.images && report.images.length > 0 && (
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <StatusBadge status={report.status} />
                    <PriorityBadge priority={report.priority} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {report.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{report.area}, {report.address}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {report.upvotesCount || 0}
                    </span>
                    {onSelectReport && (
                      <button
                        onClick={() => onSelectReport(report)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t('viewAll')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      {/* Fixed location markers for the three key areas */}
{[
  { name: 'Gunaigach', coords: [25.5710, 89.5770] as [number, number] },
  { name: 'Ulipur (Kurigram)', coords: [25.5775, 89.5960] as [number, number] },
  { name: 'Kurigram Town', coords: [25.4567, 89.6420] as [number, number] },
].map(loc => (
  <Marker key={loc.name} position={loc.coords}>
    <Popup>{loc.name}</Popup>
  </Marker>
))}
</MapContainer>
    </div>
  );
};
