import React, { useState } from 'react';
import { ExtraItem, CategoryType, Language } from '../types';
import { t } from '../lib/i18n';
import { Plus, Trash2, PackagePlus, FileText, CheckCircle2, Layers } from 'lucide-react';

interface ExtraItemsSectionProps {
  extras: ExtraItem[];
  lang: Language;
  onAddExtra: (name: string, qty: number, unit: string) => void;
  onRemoveExtra: (id: string) => void;
  onAddCatalogItem?: (th: string, mm: string, en: string, unit: string, category: CategoryType, initialQty?: number) => void;
}

export const ExtraItemsSection: React.FC<ExtraItemsSectionProps> = ({
  extras,
  lang,
  onAddExtra,
  onRemoveExtra,
  onAddCatalogItem,
}) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  
  // Single item state
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('p');
  const [saveToCatalog, setSaveToCatalog] = useState<CategoryType | 'extra'>('extra');

  // Bulk items state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<CategoryType | 'extra'>('extra');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(qty);
    if (!name.trim()) return;
    if (isNaN(num) || num <= 0) return;

    if (saveToCatalog !== 'extra' && onAddCatalogItem) {
      onAddCatalogItem(name.trim(), '', '', unit, saveToCatalog, num);
    } else {
      onAddExtra(name.trim(), num, unit);
    }

    setName('');
    setQty('');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);

    lines.forEach((line) => {
      const match = line.trim().match(/^(.*?)\s+([\d.]+)\s*([a-zA-Zက-အ-်-်\s]*)$/);
      if (match) {
        const itemTitle = match[1].trim();
        const parsedQty = parseFloat(match[2]);
        const parsedUnit = match[3].trim() || 'p';
        if (itemTitle && !isNaN(parsedQty) && parsedQty > 0) {
          if (bulkCategory !== 'extra' && onAddCatalogItem) {
            onAddCatalogItem(itemTitle, '', '', parsedUnit || 'p', bulkCategory, parsedQty);
          } else {
            onAddExtra(itemTitle, parsedQty, parsedUnit || 'p');
          }
          return;
        }
      }

      const itemTitle = line.trim();
      if (itemTitle) {
        if (bulkCategory !== 'extra' && onAddCatalogItem) {
          onAddCatalogItem(itemTitle, '', '', 'p', bulkCategory, 1);
        } else {
          onAddExtra(itemTitle, 1, 'p');
        }
      }
    });

    setBulkText('');
  };

  return (
    <div id="extra-items-section" className="bg-[#FAF7F0] border border-[#D9D2C1] rounded-2xl p-4 mt-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E3DDCB] flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 border border-amber-300 rounded-lg text-amber-800">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              {t('extraSectionTitle', lang)}
            </h3>
            <p className="text-[11px] text-stone-600">
              {t('extraSectionSub', lang)}
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              mode === 'single'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus size={13} />
            <span>{t('singleAdd', lang)}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              mode === 'bulk'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText size={13} />
            <span>{t('bulkAdd', lang)}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Single Item Form */}
      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {t('itemName', lang)}
              </label>
              <input
                type="text"
                placeholder="e.g. มะนาว / Lemon / သံပုရာသီး"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {t('quantity', lang)}
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                placeholder="e.g. 2"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/50"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {t('unit', lang)}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/50 font-medium"
              >
                <option value="p">p (ชิ้น / ခု / pcs)</option>
                <option value="kg">kg (กิโล / ကီလို)</option>
                <option value="pack">pack (แพ็ค)</option>
                <option value="box">box (กล่อง)</option>
                <option value="bottle">bottle (ขวด)</option>
                <option value="bag">bag (ถุง)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-1">
                <Layers size={13} className="text-amber-800" /> {t('addToLocation', lang)}
              </span>
              <select
                value={saveToCatalog}
                onChange={(e) => setSaveToCatalog(e.target.value as any)}
                className="px-2 py-1 text-xs bg-amber-50 border border-amber-300 rounded-md font-semibold text-amber-900 focus:outline-none"
              >
                <option value="extra">{t('todayExtraOnly', lang)}</option>
                <option value="veg">{t('saveToVegCatalog', lang)}</option>
                <option value="gen">{t('saveToGenCatalog', lang)}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !qty}
              className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ml-auto"
            >
              <Plus size={14} /> {t('addBtn', lang)}
            </button>
          </div>
        </form>
      ) : (
        /* Mode 2: Bulk Multi-line Text Area */
        <form onSubmit={handleBulkSubmit} className="space-y-3 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              {t('bulkAdd', lang)} (Paste or type line by line):
            </label>
            <textarea
              rows={4}
              placeholder={t('bulkPlaceholder', lang)}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/50"
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">{t('addToLocation', lang)}</span>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value as any)}
                className="px-2 py-1 text-xs bg-amber-50 border border-amber-300 rounded-md font-semibold text-amber-900 focus:outline-none"
              >
                <option value="extra">{t('todayExtraOnly', lang)}</option>
                <option value="veg">{t('saveToVegCatalog', lang)}</option>
                <option value="gen">{t('saveToGenCatalog', lang)}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!bulkText.trim()}
              className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <CheckCircle2 size={14} /> {t('addAllBtn', lang)}
            </button>
          </div>
        </form>
      )}

      {/* Added Extras List */}
      <div className="border-t border-[#E3DDCB] pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-800">
            {t('addedExtrasTitle', lang)} ({extras.length})
          </span>
        </div>

        {extras.length === 0 ? (
          <p className="text-xs text-stone-500 italic text-center py-2 bg-white/50 rounded-lg border border-dashed border-stone-300">
            {t('noExtras', lang)}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {extras.map((x) => (
              <div
                key={x.id}
                className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-amber-200/80 text-xs shadow-2xs"
              >
                <span className="font-medium text-stone-800 truncate max-w-[180px]" title={x.name}>
                  {x.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    {x.qty} {x.unit === 'kg' ? 'kg' : x.unit === 'p' ? 'pcs' : x.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveExtra(x.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
