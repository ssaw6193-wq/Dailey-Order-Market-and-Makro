import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { t } from '../lib/i18n';
import { Monitor, Download, X, Check, Laptop, Pin, ArrowRight } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, lang, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const [showManualNotice, setShowManualNotice] = useState<boolean>(false);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowManualNotice(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1F5D50] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Monitor size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base">{t('installAppTitle', lang)}</h3>
              <p className="text-xs text-emerald-100 opacity-90">Chrome / Edge / Desktop PWA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-stone-800 text-xs sm:text-sm">
          {/* Quick Install Button if available */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>App Installed as Desktop Application!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-stone-900 text-sm">
                  {lang === 'mm'
                    ? 'အမြန်ဆုံး အဝင်အထွက် ရရှိရန် Desktop App အဖြစ် တိုက်ရိုက် Install လုပ်ပါ'
                    : 'Install as standalone desktop app for instant launch'}
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1F5D50] hover:bg-[#18493f] text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95 cursor-pointer"
                >
                  <Download size={18} />
                  <span>{t('installAppBtn', lang)}</span>
                </button>
                {showManualNotice && (
                  <p className="text-xs text-amber-900 bg-amber-100 p-2 rounded-lg font-semibold border border-amber-300 animate-in fade-in">
                    {lang === 'mm'
                      ? 'Chrome / Edge Browser ၏ Address Bar (URL ရိုက်သည့်နေရာ) အစွန်ရှိ Install (⊕ သို့မဟုတ် 💻) Icon ကို နှိပ်၍ ထည့်သွင်းပါ'
                      : 'Please click the Install icon (⊕ or 💻) in your browser address bar above.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step by Step Visual Guide */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500 border-b pb-1">
              {lang === 'mm' ? 'Taskbar တွင် အမြဲထားရှိရန် အဆင့်များ:' : 'Step-by-step instructions:'}
            </h4>

            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg shrink-0 mt-0.5">
                <Laptop size={18} />
              </div>
              <p className="leading-relaxed font-medium text-stone-700">{t('pwaStep1', lang)}</p>
            </div>

            <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="p-2 bg-blue-100 text-blue-900 rounded-lg shrink-0 mt-0.5">
                <Download size={18} />
              </div>
              <p className="leading-relaxed font-medium text-stone-700">{t('pwaStep2', lang)}</p>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
                <Pin size={18} />
              </div>
              <div>
                <p className="leading-relaxed font-bold text-amber-950 mb-1">
                  {lang === 'mm' ? '📌 Taskbar တွင် Pin လုပ်နည်း:' : '📌 Pin to Taskbar:'}
                </p>
                <p className="leading-relaxed text-stone-700 font-medium">{t('pwaStep3', lang)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {t('cancel', lang)} / OK
          </button>
        </div>
      </div>
    </div>
  );
};
