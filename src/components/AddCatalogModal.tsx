import React, { useState } from 'react';
import { CategoryType, UnitType, Language } from '../types';
import { t } from '../lib/i18n';
import { Plus, X, Leaf, Package } from 'lucide-react';

interface AddCatalogModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onAdd: (th: string, mm: string, en: string, unit: UnitType | string, category: CategoryType) => void;
}

export const AddCatalogModal: React.FC<AddCatalogModalProps> = ({
  isOpen,
  lang,
  onClose,
  onAdd,
}) => {
  const [th, setTh] = useState('');
  const [mm, setMm] = useState('');
  const [en, setEn] = useState('');
  const [unit, setUnit] = useState<string>('p');
  const [category, setCategory] = useState<CategoryType>('gen');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!th.trim()) return;
    onAdd(th.trim(), mm.trim(), en.trim(), unit, category);
    setTh('');
    setMm('');
    setEn('');
    setUnit('p');
    setCategory('gen');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-stone-100/80 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-stone-800 text-base">
              {t('addNewTitle', lang)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('categoryLabel', lang)} *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('veg')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  category === 'veg'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Leaf size={15} className={category === 'veg' ? 'text-emerald-700' : 'text-stone-400'} />
                {t('categoryVeg', lang)}
              </button>
              <button
                type="button"
                onClick={() => setCategory('gen')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  category === 'gen'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Package size={15} className={category === 'gen' ? 'text-emerald-700' : 'text-stone-400'} />
                {t('categoryGen', lang)}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('thaiName', lang)}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ผักกาดขาว"
              value={th}
              onChange={(e) => setTh(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('myanmarName', lang)}
            </label>
            <input
              type="text"
              placeholder="e.g. ဖက်ကတ်ခေါင်"
              value={mm}
              onChange={(e) => setMm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('englishName', lang)}
            </label>
            <input
              type="text"
              placeholder="e.g. Chinese Cabbage"
              value={en}
              onChange={(e) => setEn(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('unit', lang)}
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="kg">kg (กิโล / ကီလို)</option>
              <option value="p">p (ชิ้น / ခု / pcs)</option>
              <option value="pack">pack (แพ็ค)</option>
              <option value="box">box (กล่อง)</option>
              <option value="bottle">bottle (ขวด)</option>
              <option value="bag">bag (ထုပ် / ถุง)</option>
              <option value="can">can (ဘူး / กระป๋อง)</option>
              <option value="tray">tray (ဗန်း / ถาด)</option>
              <option value="bundle">bundle (စည်း / มัด)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
            >
              {t('cancel', lang)}
            </button>
            <button
              type="submit"
              disabled={!th.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 rounded-xl shadow-2xs transition-colors"
            >
              {t('addBtn', lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
