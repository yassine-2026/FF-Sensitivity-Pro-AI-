import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'FF Sensitivity Pro AI',
      subtitle: 'The Most Advanced Free Fire Sensitivity Generator',
      deviceAnalysis: 'Device Analysis System',
      deviceType: 'Device Type',
      android: 'Android',
      iphone: 'iPhone',
      tablet: 'Tablet / iPad',
      deviceName: 'Device Name (e.g., iPhone 13, Galaxy S23)',
      ramAmount: 'RAM (GB)',
      analyzeDevice: 'Analyze & Generate Settings',
      analyzing: 'Analyzing System & Generating AI Settings...',
      results: 'AI Analysis Results',
      sensitivitySettings: 'Optimal Sensitivity',
      general: 'General',
      redDot: 'Red Dot',
      scope2x: '2X Scope',
      scope4x: '4X Scope',
      sniperScope: 'Sniper Scope',
      freeLook: 'Free Look',
      advancedRecommendations: 'Advanced Recommendations',
      dpi: 'DPI / Width',
      fireButtonSize: 'Fire Button Size',
      graphicsSettings: 'Graphics Quality',
      fpsMode: 'FPS Mode',
      systemAnalysis: 'System Analysis',
      cpuPower: 'CPU Performance',
      gpuPower: 'GPU Performance',
      overallRating: 'Gaming Rating',
      proTips: 'Pro Aim Tips',
      error: 'Error occurred. Please try again.',
      language: 'Language',
      selectRam: 'Select RAM',
    }
  },
  ar: {
    translation: {
      title: 'FF Sensitivity Pro AI',
      subtitle: 'أداة توليد حساسية فري فاير الأكثر تطوراً بالذكاء الاصطناعي',
      deviceAnalysis: 'نظام تحليل الجهاز',
      deviceType: 'نوع الجهاز',
      android: 'أندرويد',
      iphone: 'آيفون',
      tablet: 'تابلت / آيباد',
      deviceName: 'اسم الجهاز (مثل: iPhone 13, Galaxy S23)',
      ramAmount: 'الرام (GB)',
      analyzeDevice: 'تحليل وتوليد الإعدادات',
      analyzing: 'جاري تحليل النظام وتوليد الإعدادات بالذكاء الاصطناعي...',
      results: 'نتائج تحليل الذكاء الاصطناعي',
      sensitivitySettings: 'الحساسية المثالية',
      general: 'عام',
      redDot: 'نقطة حمراء',
      scope2x: 'عدسة 2X',
      scope4x: 'عدسة 4X',
      sniperScope: 'عدسة القناصة',
      freeLook: 'نظرة حرة',
      advancedRecommendations: 'توصيات متقدمة',
      dpi: 'DPI / العرض',
      fireButtonSize: 'حجم زر الضرب',
      graphicsSettings: 'جودة الجرافيك',
      fpsMode: 'معدل الإطارات',
      systemAnalysis: 'تحليل النظام',
      cpuPower: 'أداء المعالج',
      gpuPower: 'أداء الرسوميات',
      overallRating: 'تقييم الألعاب',
      proTips: 'نصائح احترافية للايم',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      language: 'اللغة',
      selectRam: 'اختر الرام',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
