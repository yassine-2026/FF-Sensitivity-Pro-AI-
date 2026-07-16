import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, MonitorPlay, Zap, Loader2, Search, Laptop, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchDevices } from '../services/deviceDatabase';
import { DeviceSpec } from '../types';

interface DeviceFormProps {
  onAnalyze: (data: { deviceType: string; deviceName: string; ram: string; deviceSpec?: DeviceSpec }) => void;
  isLoading: boolean;
}

export default function DeviceForm({ onAnalyze, isLoading }: DeviceFormProps) {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState('Android');
  const [deviceName, setDeviceName] = useState('');
  const [ram, setRam] = useState('');
  
  // Autocomplete state
  const [searchResults, setSearchResults] = useState<DeviceSpec[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<DeviceSpec | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (deviceName.length > 1 && !selectedSpec) {
        const results = await searchDevices(deviceName);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } else {
        setShowDropdown(false);
      }
    };
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [deviceName, selectedSpec]);

  const handleSelectDevice = (device: DeviceSpec) => {
    setDeviceName(`${device.brand} ${device.model}`);
    setSelectedSpec(device);
    setShowDropdown(false);
    
    // Auto-select type based on category
    if (device.category.includes('iPhone')) setDeviceType('iPhone');
    else if (device.category.includes('iPad') || device.category.includes('Tablet')) setDeviceType('Tablet');
    else if (device.category.includes('Laptop')) setDeviceType('Laptop');
    else if (device.category.includes('Desktop')) setDeviceType('Desktop');
    else setDeviceType('Android');
    
    // If exact RAM match available, maybe preselect but let user choose if multiple
    if (device.ram_variants.length === 1) {
      setRam(device.ram_variants[0].toString());
    } else {
      setRam(''); // reset to make them choose
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceName && ram) {
      onAnalyze({ deviceType, deviceName, ram, deviceSpec: selectedSpec });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Tablet': return <MonitorPlay className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Desktop': return <Monitor className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  // Determine available RAM options
  const ramOptions = selectedSpec 
    ? selectedSpec.ram_variants 
    : [2, 3, 4, 6, 8, 12, 16, 24, 32, 64];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-2xl mx-auto relative z-20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/20 rounded-2xl">
          <Smartphone className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('deviceAnalysis')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">{t('deviceType')}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Android', 'iPhone', 'Tablet', 'Laptop/Desktop'].map((type) => {
              const valType = type === 'Laptop/Desktop' ? 'Laptop' : type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDeviceType(valType)}
                  className={`py-3 px-2 md:px-4 rounded-xl border font-medium text-xs md:text-sm transition-all flex justify-center items-center gap-1.5 md:gap-2 ${
                    deviceType === valType
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'glass-input hover:border-gray-400'
                  }`}
                >
                  {getDeviceIcon(valType)}
                  {t(type.toLowerCase().replace('/', '').replace(' ', '')) || type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 relative" ref={dropdownRef}>
          <label htmlFor="deviceName" className="block text-sm font-medium text-gray-300">
            {t('deviceName')}
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="deviceName"
              type="text"
              required
              value={deviceName}
              onChange={(e) => {
                setDeviceName(e.target.value);
                setSelectedSpec(undefined);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              className="w-full glass-input rounded-xl pl-12 pr-4 py-4 outline-none"
              placeholder="e.g. Samsung Galaxy A54"
              autoComplete="off"
            />
          </div>
          
          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto"
              >
                {searchResults.map((device, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDevice(device)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {device.brand} {device.model}
                      </div>
                      <div className="text-xs text-gray-400">
                        {device.processor} • {device.refresh_rate}Hz • {device.category}
                      </div>
                    </div>
                    <div className="text-xs font-mono bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded">
                      Smart Match
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <label htmlFor="ram" className="block text-sm font-medium text-gray-300">
            {t('ramAmount')}
          </label>
          <select
            id="ram"
            required
            value={ram}
            onChange={(e) => setRam(e.target.value)}
            className="w-full glass-input rounded-xl p-4 outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-gray-900">{t('selectRam')}</option>
            {ramOptions.map((amount) => (
              <option key={amount} value={amount} className="bg-gray-900">
                {amount} GB {selectedSpec && `(Exact Match)`}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !deviceName || !ram}
          className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-4" />
          <div className="flex items-center justify-center gap-2 relative z-10">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('analyzing')}</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>{t('analyzeDevice')}</span>
              </>
            )}
          </div>
        </button>
      </form>
    </motion.div>
  );
}
