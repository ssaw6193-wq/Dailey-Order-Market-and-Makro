import React from 'react';
import { CatalogItem, ExtraItem, Language } from '../types';
import { t } from '../lib/i18n';
import { ShoppingBasket, Ban, Package, Leaf } from 'lucide-react';

interface SummaryCardProps {
  catalog: CatalogItem[];
  values: Record<string, number | null | undefined>;
  extras: ExtraItem[];
  lang: Language;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ catalog, values, extras, lang }) => {
  const vegOrdered = catalog.filter(
    (c) => c.category === 'veg' && typeof values[c.id] === 'number' && (values[c.id] as number) > 0
  ).length;

  const genOrdered = catalog.filter(
    (c) => c.category === 'gen' && typeof values[c.id] === 'number' && (values[c.id] as number) > 0
  ).length;

  const totalCatalogOrdered = vegOrdered + genOrdered;
  const totalOrdered = totalCatalogOrdered + extras.length;

  const totalSkipped = catalog.filter((c) => values[c.id] === null).length;

  const unitText = lang === 'th' ? 'รายการ' : lang === 'en' ? 'items' : 'မျိုး';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
      <div className="bg-white border border-stone-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
          <ShoppingBasket size={15} />
          <span>{t('totalOrdered', lang)}</span>
        </div>
        <div className="text-xl font-bold font-mono text-stone-900">
          {totalOrdered}{' '}
          <span className="text-xs font-normal text-stone-500 font-sans">{unitText}</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">
          {totalCatalogOrdered} + {extras.length} {t('totalExtras', lang)}
        </p>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
          <Leaf size={15} />
          <span>{t('categoryVeg', lang)}</span>
        </div>
        <div className="text-xl font-bold font-mono text-stone-900">
          {vegOrdered}{' '}
          <span className="text-xs font-normal text-stone-500 font-sans">{unitText}</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">ผัก / ผลไม้สด</p>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold mb-1">
          <Package size={15} />
          <span>{t('categoryGen', lang)}</span>
        </div>
        <div className="text-xl font-bold font-mono text-stone-900">
          {genOrdered}{' '}
          <span className="text-xs font-normal text-stone-500 font-sans">{unitText}</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">ของแห้ง / ของใช้</p>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold mb-1">
          <Ban size={15} />
          <span>{t('categorySkipped', lang)}</span>
        </div>
        <div className="text-xl font-bold font-mono text-stone-900">
          {totalSkipped}{' '}
          <span className="text-xs font-normal text-stone-500 font-sans">{unitText}</span>
        </div>
        <p className="text-[11px] text-stone-500 mt-0.5">❎ Skip</p>
      </div>
    </div>
  );
};
