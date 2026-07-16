import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, MonitorPlay, Zap, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DeviceFormProps {
  onAnalyze: (data: { deviceType: string; deviceName: string; ram: string }) => void;
  isLoading: boolean;
}

export default function DeviceForm({ onAnalyze, isLoading }: DeviceFormProps) {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState('Android');
  const [deviceName, setDeviceName] = useState('');
  const [ram, setRam] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceName && ram) {
      onAnalyze({ deviceType, deviceName, ram });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-2xl mx-auto"
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
          <div className="grid grid-cols-3 gap-3">
            {['Android', 'iPhone', 'Tablet'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDeviceType(type)}
                className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all flex justify-center items-center gap-2 ${
                  deviceType === type
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'glass-input hover:border-gray-400'
                }`}
              >
                {type === 'Tablet' ? <MonitorPlay className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                {t(type.toLowerCase().replace(' ', ''))}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="deviceName" className="block text-sm font-medium text-gray-300">
            {t('deviceName')}
          </label>
          <input
            id="deviceName"
            type="text"
            required
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full glass-input rounded-xl p-4 outline-none"
            placeholder="e.g. Samsung Galaxy S23 Ultra"
          />
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
            {[2, 3, 4, 6, 8, 12, 16, 24].map((amount) => (
              <option key={amount} value={amount} className="bg-gray-900">
                {amount} GB
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
