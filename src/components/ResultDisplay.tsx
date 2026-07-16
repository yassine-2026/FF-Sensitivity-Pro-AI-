import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { AnalysisResult } from '../types';
import { Activity, Target, Settings, Cpu, Gauge, Crosshair, HelpCircle, Monitor } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const { t } = useTranslation();

  const renderSensitivityCard = (label: string, value: number, index: number) => (
    <div key={label} className="bg-gray-800/40 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-3xl font-bold text-white text-glow flex items-end gap-1">
        {value}
      </div>
      <div className="w-full bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / 200) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
        />
      </div>
    </div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={item} className="flex items-center gap-3 justify-center mb-8">
        <Activity className="w-8 h-8 text-cyan-400" />
        <h2 className="text-3xl font-bold text-white">{t('results')}</h2>
      </motion.div>

      {/* Sensitivity Section */}
      <motion.div variants={item} className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-semibold">{t('sensitivitySettings')}</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {renderSensitivityCard(t('general'), result.sensitivity.general, 0)}
          {renderSensitivityCard(t('redDot'), result.sensitivity.redDot, 1)}
          {renderSensitivityCard(t('scope2x'), result.sensitivity.scope2x, 2)}
          {renderSensitivityCard(t('scope4x'), result.sensitivity.scope4x, 3)}
          {renderSensitivityCard(t('sniperScope'), result.sensitivity.sniperScope, 4)}
          {renderSensitivityCard(t('freeLook'), result.sensitivity.freeLook, 5)}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Advanced Recommendations */}
        <motion.div variants={item} className="glass-card p-6 md:p-8 rounded-3xl h-full">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Settings className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold">{t('advancedRecommendations')}</h3>
          </div>
          
          <ul className="space-y-4">
            <li className="flex justify-between items-center bg-gray-800/30 p-3 rounded-xl">
              <span className="text-gray-400 flex items-center gap-2"><Crosshair className="w-4 h-4"/> {t('dpi')}</span>
              <span className="font-bold text-cyan-300">{result.recommendations.dpi}</span>
            </li>
            <li className="flex justify-between items-center bg-gray-800/30 p-3 rounded-xl">
              <span className="text-gray-400 flex items-center gap-2"><Target className="w-4 h-4"/> {t('fireButtonSize')}</span>
              <span className="font-bold text-cyan-300">{result.recommendations.fireButtonSize}</span>
            </li>
            <li className="flex justify-between items-center bg-gray-800/30 p-3 rounded-xl">
              <span className="text-gray-400 flex items-center gap-2"><Monitor className="w-4 h-4"/> {t('graphicsSettings')}</span>
              <span className="font-bold text-purple-300">{result.recommendations.graphics}</span>
            </li>
            <li className="flex justify-between items-center bg-gray-800/30 p-3 rounded-xl">
              <span className="text-gray-400 flex items-center gap-2"><Gauge className="w-4 h-4"/> {t('fpsMode')}</span>
              <span className="font-bold text-purple-300">{result.recommendations.fps}</span>
            </li>
          </ul>
        </motion.div>

        {/* System Analysis */}
        <motion.div variants={item} className="glass-card p-6 md:p-8 rounded-3xl h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold">{t('systemAnalysis')}</h3>
          </div>
          
          <div className="space-y-4 flex-grow">
            <div>
              <div className="text-gray-400 text-sm mb-1">{t('cpuPower')}</div>
              <div className="text-gray-200 bg-gray-800/30 p-3 rounded-xl text-sm leading-relaxed">{result.analysis.cpu}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">{t('gpuPower')}</div>
              <div className="text-gray-200 bg-gray-800/30 p-3 rounded-xl text-sm leading-relaxed">{result.analysis.gpu}</div>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-end">
               <div>
                 <div className="text-gray-400 text-sm mb-1">{t('overallRating')}</div>
                 <div className="text-2xl font-bold text-blue-400">{result.analysis.performance}</div>
               </div>
               {result.analysis.category && (
                 <div className="text-right">
                   <div className="text-gray-400 text-sm mb-1">Category</div>
                   <div className="font-semibold text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-lg border border-cyan-500/20">
                     {result.analysis.category}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pro Tips */}
      <motion.div variants={item} className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-gray-900/60 to-purple-900/20">
         <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-pink-400" />
            <h3 className="text-xl font-semibold">{t('proTips')}</h3>
          </div>
          <ul className="grid md:grid-cols-2 gap-4">
            {result.recommendations.tips.map((tip, index) => (
              <li key={index} className="flex gap-3 text-gray-300 bg-black/20 p-4 rounded-xl items-start">
                <span className="text-pink-400 font-bold mt-0.5">{index + 1}.</span>
                <span className="text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
      </motion.div>
    </motion.div>
  );
}
