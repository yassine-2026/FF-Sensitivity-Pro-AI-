import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSwitcher from './components/LanguageSwitcher';
import DeviceForm from './components/DeviceForm';
import ResultDisplay from './components/ResultDisplay';
import { AnalysisResult } from './types';
import { Crosshair, AlertCircle } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: { deviceType: string; deviceName: string; ram: string }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze device');
      }

      const responseData: AnalysisResult = await response.json();
      setResult(responseData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Crosshair className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {t('title')}
              </h1>
              <p className="text-cyan-400 text-sm font-medium">{t('subtitle')}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <LanguageSwitcher />
          </motion.div>
        </header>

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
              >
                <DeviceForm onAnalyze={handleAnalyze} isLoading={isLoading} />
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2 max-w-2xl mx-auto"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error === 'GROQ_API_KEY is not configured' ? 'System Error: GROQ_API_KEY is missing. Please configure it in the environment.' : t('error')}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <ResultDisplay result={result} />
                
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setResult(null)}
                    className="text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-gray-600 hover:decoration-white"
                  >
                    Analyze Another Device
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
