import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const pinIcon = L.divIcon({
  className: 'location-picker-pin',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="44">
      <defs>
        <filter id="p-shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#059669" filter="url(#p-shadow)"/>
      <circle cx="12" cy="11" r="5" fill="#ffffff"/>
      <circle cx="12" cy="11" r="2.5" fill="#059669"/>
    </svg>
  `,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
});

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (coords: { latitude: number; longitude: number }) => void;
}

function ClickHandler({
  onChange,
  setPosition,
}: {
  onChange: (coords: { latitude: number; longitude: number }) => void;
  setPosition: (coords: [number, number]) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onChange,
}) => {
  const { t, language } = useLanguage();

  // Default to Gunaigach, Ulipur, Kurigram if no location is provided.
  const initialPos: [number, number] =
    latitude && longitude ? [latitude, longitude] : [25.5710, 89.5770];

  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );

  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setPosition([lat, lng]);
        onChange({ latitude: lat, longitude: lng });
        setLocating(false);
      },
      (err) => {
        alert(`Location access error: ${err.message}`);
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          {t('mapPickerTitle')}
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
          <span>
            {language === 'bn' ? 'আমার বর্তমান অবস্থান নিন' : 'Use Current GPS'}
          </span>
        </button>
      </div>

      <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner">
        <MapContainer
          center={initialPos}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} setPosition={setPosition} />
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>

        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs text-slate-700 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {position
                ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
                : t('mapPickerHint')}
            </span>
          </div>
          {position && <span className="text-[10px] text-emerald-700 font-bold">✓ Selected</span>}
        </div>
      </div>
    </div>
  );
};
