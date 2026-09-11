import React, { useState } from 'react';
import { CatalogItem, Language } from '../types';
import { t } from '../lib/i18n';
import { Trash2, Edit2, Check, X, Plus, Minus } from 'lucide-react';

interface ItemRowProps {
  item: CatalogItem;
  value: number | null | undefined;
  remainValue: number | null | undefined;
  remainUnit?: string;
  lang: Language;
  onSetQty: (id: string, raw: string | number) => void;
  onSetRemain: (id: string, raw: string | number) => void;
  onSetRemainUnit: (id: string, unit: string) => void;
  onToggleSkip: (id: string) => void;
  onUpdateItem: (id: string, patch: Partial<CatalogItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  value,
  remainValue,
  remainUnit,
  lang,
  onSetQty,
  onSetRemain,
  onSetRemainUnit,
  onToggleSkip,
  onUpdateItem,
  onRemoveItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editTh, setEditTh] = useState(item.th);
  const [editMm, setEditMm] = useState(item.mm);
  const [editEn, setEditEn] = useState(item.en || '');
  const [editUnit, setEditUnit] = useState(item.unit);

  const isSkipped = value === null;
  const qtyNum = typeof value === 'number' ? value : undefined;
  const remainNum = typeof remainValue === 'number' ? remainValue : undefined;

  const handleSaveEdit = () => {
    if (!editTh.trim()) return;
    onUpdateItem(item.id, {
      th: editTh.trim(),
      mm: editMm.trim(),
      en: editEn.trim(),
      unit: editUnit,
    });
    setIsEditing(false);
  };

  const handleQuickAdd = (delta: number) => {
    const current = qtyNum || 0;
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    onSetQty(item.id, next === 0 ? '' : next);
  };

  // Language display logic
  let primaryName = item.th;
  let secondaryName = item.mm;

  if (lang === 'mm') {
    primaryName = item.mm || item.th;
    secondaryName = item.mm ? item.th : '';
  } else if (lang === 'en') {
    primaryName = item.en || item.th;
    secondaryName = item.th;
  } else {
    // th
    primaryName = item.th;
    secondaryName = item.mm || item.en || '';
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 my-1 bg-amber-50/80 border border-amber-200 rounded-lg text-xs">
        <div className="flex items-center justify-between text-amber-900 font-semibold">
          <span>{t('editItem', lang)}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-2 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Check size={12} /> {t('save', lang)}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-stone-200 text-stone-700 rounded hover:bg-stone-300 flex items-center gap-1 cursor-pointer"
            >
              <X size={12} /> {t('cancel', lang)}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div>
            <label className="text-[11px] text-stone-600 block mb-0.5">{t('thaiName', lang)}</label>
            <input
              type="text"
              value={editTh}
              onChange={(e) => setEditTh(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-600 block mb-0.5">{t('myanmarName', lang)}</label>
            <input
              type="text"
              value={editMm}
              onChange={(e) => setEditMm(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-600 block mb-0.5">{t('englishName', lang)}</label>
            <input
              type="text"
              value={editEn}
              onChange={(e) => setEditEn(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-600 block mb-0.5">{t('unit', lang)}</label>
            <select
              value={editUnit}
              onChange={(e) => setEditUnit(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-emerald-600"
            >
              <option value="kg">kg (ကီလို / กิโล)</option>
              <option value="p">p / ခု / ชิ้น (pcs)</option>
              <option value="pack">pack (แพ็ค)</option>
              <option value="box">box (กล่อง)</option>
              <option value="bottle">bottle (ขวด)</option>
              <option value="bag">bag (ထုပ် / ถุง)</option>
              <option value="can">can (ဘူး / กระป๋อง)</option>
              <option value="tray">tray (ဗန်း / ถาด)</option>
              <option value="bundle">bundle (စည်း / มัด)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  const currentRemainUnit = remainUnit || item.unit || 'kg';

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 rounded-xl border transition-all ${
        isSkipped
          ? 'bg-stone-100/60 border-stone-200 opacity-60'
          : (qtyNum && qtyNum > 0) || (remainNum && remainNum > 0)
          ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
          : 'bg-white border-stone-200/80 hover:border-stone-300'
      }`}
    >
      {/* Name and Pronunciation */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`font-bold text-sm ${isSkipped ? 'line-through text-stone-400' : 'text-stone-900'}`}>
            {primaryName}
          </span>
          {secondaryName && (
            <span className="text-xs text-stone-500 font-medium">
              ({secondaryName})
            </span>
          )}
          {lang !== 'th' && item.th !== primaryName && (
            <span className="text-[11px] text-stone-400 font-normal">
              [{item.th}]
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Skip, Remaining Qty & Unit, Order Qty, Item Unit, Actions */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end shrink-0">
        {/* Skip Toggle */}
        <button
          type="button"
          onClick={() => onToggleSkip(item.id)}
          className={`px-2 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isSkipped
              ? 'bg-rose-100 text-rose-700 border-rose-300'
              : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
          }`}
        >
          {isSkipped ? t('skippedLabel', lang) : t('skipBtn', lang)}
        </button>

        {!isSkipped && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 1. Remaining Stock Input & Unit Selector (ကျန် / เหลือ) */}
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border transition-colors ${
                remainNum && remainNum > 0
                  ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[11px] font-bold text-rose-700 shrink-0 select-none">
                {t('remainShort', lang)}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={remainValue === undefined || remainValue === null ? '' : remainValue}
                onChange={(e) => onSetRemain(item.id, e.target.value)}
                className={`w-11 text-center py-0.5 font-mono text-xs font-bold rounded outline-none ${
                  remainNum && remainNum > 0
                    ? 'bg-rose-600 text-white border-rose-700'
                    : 'bg-white text-rose-800 border-rose-300 focus:border-rose-500'
                }`}
              />
              {/* Unit Dropdown for Remaining Quantity */}
              <select
                value={currentRemainUnit}
                onChange={(e) => onSetRemainUnit(item.id, e.target.value)}
                className={`text-[10px] font-bold py-0.5 px-1 rounded border outline-none cursor-pointer transition-colors ${
                  remainNum && remainNum > 0
                    ? 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
                title={lang === 'mm' ? 'ကျန်ပစ္စည်း ယူနစ်ရွေးရန် (kg, pack, ...)' : lang === 'th' ? 'เลือกหน่วยของคงเหลือ' : 'Select unit for remaining stock'}
              >
                <option value="kg">kg</option>
                <option value="p">{lang === 'th' ? 'ชิ้น' : lang === 'mm' ? 'ခု' : 'pcs'}</option>
                <option value="pack">pack</option>
                <option value="box">box</option>
                <option value="bottle">bottle</option>
                <option value="bag">bag</option>
                <option value="can">can</option>
                <option value="tray">tray</option>
                <option value="bundle">bundle</option>
              </select>
            </div>

            {/* 2. Order Quantity Input (မှာ / เบิก) */}
            <div
              className={`flex items-center gap-1 p-0.5 rounded-lg border transition-colors ${
                qtyNum && qtyNum > 0
                  ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[11px] font-bold text-emerald-800 pl-1 shrink-0 select-none">
                {t('orderShort', lang)}
              </span>
              {/* Quick minus */}
              <button
                type="button"
                onClick={() => handleQuickAdd(-0.5)}
                disabled={!qtyNum || qtyNum <= 0}
                className="w-5 h-5 flex items-center justify-center rounded text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="-0.5"
              >
                <Minus size={11} />
              </button>

              {/* Main Qty Input */}
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={value === undefined || value === null ? '' : value}
                onChange={(e) => onSetQty(item.id, e.target.value)}
                className={`w-12 text-center py-0.5 font-mono text-xs font-bold rounded outline-none ${
                  qtyNum && qtyNum > 0
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-stone-800 border-stone-300 focus:border-emerald-500'
                }`}
              />

              {/* Quick plus */}
              <button
                type="button"
                onClick={() => handleQuickAdd(item.unit === 'kg' ? 0.5 : 1)}
                className="w-5 h-5 flex items-center justify-center rounded text-stone-600 hover:bg-stone-200 cursor-pointer"
                title={item.unit === 'kg' ? '+0.5' : '+1'}
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Unit badge */}
        <span className="text-xs font-mono font-semibold text-stone-600 min-w-[24px] text-center shrink-0">
          {item.unit === 'kg' ? 'kg' : item.unit === 'p' ? (lang === 'th' ? 'ชิ้น' : lang === 'mm' ? 'ခု' : 'pcs') : item.unit}
        </span>

        {/* Action icons (Edit & Delete) / Confirmation */}
        {isConfirmingDelete ? (
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-lg text-xs animate-in fade-in shrink-0">
            <span className="font-bold text-rose-800 text-[11px]">
              {lang === 'mm' ? 'ဖျက်မှာလား?' : lang === 'th' ? 'ลบรายการ?' : 'Delete?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsConfirmingDelete(false);
                onRemoveItem(item.id);
              }}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded transition-colors cursor-pointer"
            >
              {lang === 'mm' ? 'ဖျက်မည်' : lang === 'th' ? 'ลบ' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-[11px] rounded transition-colors cursor-pointer"
            >
              {t('cancel', lang)}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditTh(item.th);
                setEditMm(item.mm);
                setEditEn(item.en || '');
                setEditUnit(item.unit);
                setIsEditing(true);
              }}
              title={t('editItem', lang)}
              className="p-1 text-stone-400 hover:text-amber-600 rounded hover:bg-amber-50 cursor-pointer"
            >
              <Edit2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              title="Delete"
              className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
