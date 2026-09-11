import React, { useState, useEffect, useRef } from "react";
import XLSX from "xlsx-js-style";
import {
  Plus,
  Trash2,
  Download,
  Loader2,
  Save,
  ChevronDown,
  ChevronRight,
  ShoppingBasket,
  Search,
  RotateCcw,
  Sparkles,
  Filter,
  CheckCircle2,
  Ban,
  Globe,
} from "lucide-react";
import { CatalogItem, CategoryType, ExtraItem, UnitType, Language } from "./types";
import { DEFAULT_CATALOG, TODAY_VEG_VALUES } from "./data/defaultCatalog";
import { appStorage, CATALOG_KEY, orderKey } from "./lib/storage";
import { ItemRow } from "./components/ItemRow";
import { ExtraItemsSection } from "./components/ExtraItemsSection";
import { AddCatalogModal } from "./components/AddCatalogModal";
import { InstallGuideModal } from "./components/InstallGuideModal";
import { SummaryCard } from "./components/SummaryCard";
import { t, LANGUAGE_OPTIONS } from "./lib/i18n";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

type FilterView = "all" | "ordered" | "skipped" | "unentered";

export default function DailyOrderApp() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "th" || saved === "mm" || saved === "en") ? saved : "mm";
  });

  const [catalog, setCatalog] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [date, setDate] = useState<string>(todayStr());
  const [values, setValues] = useState<Record<string, number | null | undefined>>({});
  const [remains, setRemains] = useState<Record<string, number | null | undefined>>({});
  const [remainUnits, setRemainUnits] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [openCat, setOpenCat] = useState<Record<string, boolean>>({ veg: true, gen: true });
  const [filter, setFilter] = useState<string>("");
  const [filterView, setFilterView] = useState<FilterView>("all");
  const [excelBranch, setExcelBranch] = useState<string>("Makro");

  const msgTimer = useRef<NodeJS.Timeout | null>(null);

  // Save language preference
  useEffect(() => {
    localStorage.setItem("app_lang", lang);
  }, [lang]);

  // Load catalog on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await appStorage.get(CATALOG_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCatalog(parsed);
          } else {
            await appStorage.set(CATALOG_KEY, JSON.stringify(DEFAULT_CATALOG));
          }
        } else {
          await appStorage.set(CATALOG_KEY, JSON.stringify(DEFAULT_CATALOG));
        }
      } catch (e) {
        console.error("Catalog load error", e);
      }
    })();
  }, []);

  // Load daily order data on date change
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await appStorage.get(orderKey(date));
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setValues(parsed.values || {});
          setRemains(parsed.remains || {});
          setRemainUnits(parsed.remainUnits || {});
          setExtras(parsed.extras || []);
        } else if (date === todayStr()) {
          setValues(TODAY_VEG_VALUES);
          setRemains({});
          setRemainUnits({});
          setExtras([]);
        } else {
          setValues({});
          setRemains({});
          setRemainUnits({});
          setExtras([]);
        }
      } catch (e) {
        setValues(date === todayStr() ? TODAY_VEG_VALUES : {});
        setRemains({});
        setRemainUnits({});
        setExtras([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  const flash = (text: string) => {
    setMsg(text);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(""), 2800);
  };

  const persistCatalog = async (next: CatalogItem[]) => {
    setCatalog(next);
    try {
      await appStorage.set(CATALOG_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to persist catalog", e);
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await appStorage.set(
        orderKey(date),
        JSON.stringify({ values, remains, remainUnits, extras })
      );
      flash(t("msgSaved", lang));
    } catch (e) {
      flash(t("msgSaveFailed", lang));
    } finally {
      setSaving(false);
    }
  };

  const setQty = (id: string, raw: string | number) => {
    if (raw === "" || raw === undefined) {
      setValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const v = typeof raw === "number" ? raw : parseFloat(raw);
    setValues((prev) => ({ ...prev, [id]: isNaN(v) ? undefined : v }));
  };

  const setRemain = (id: string, raw: string | number) => {
    if (raw === "" || raw === undefined) {
      setRemains((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const v = typeof raw === "number" ? raw : parseFloat(raw);
    setRemains((prev) => ({ ...prev, [id]: isNaN(v) ? undefined : v }));
  };

  const setRemainUnit = (id: string, unit: string) => {
    setRemainUnits((prev) => ({ ...prev, [id]: unit }));
  };

  const toggleSkip = (id: string) => {
    setValues((prev) => {
      const cur = prev[id];
      if (cur === null) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: null };
    });
  };

  const addCatalogItem = (
    th: string,
    mm: string,
    en: string,
    unit: UnitType | string,
    category: CategoryType,
    initialQty?: number
  ) => {
    const newItem: CatalogItem = {
      id: `${category}_${Date.now()}`,
      category,
      th: th.trim(),
      mm: mm.trim(),
      en: en.trim(),
      unit,
    };
    const exists = catalog.some(
      (c) => c.th.trim().toLowerCase() === th.trim().toLowerCase()
    );
    if (exists) {
      flash(t("msgItemExists", lang));
      return;
    }
    const next = [...catalog, newItem];
    persistCatalog(next);
    if (initialQty && initialQty > 0) {
      setQty(newItem.id, initialQty);
    }
    flash(t("msgItemAdded", lang));
  };

  const addExtra = (name: string, qty: number, unit: string) => {
    const item: ExtraItem = {
      id: `ex_${Date.now()}`,
      name,
      qty,
      unit,
    };
    setExtras((prev) => [...prev, item]);
  };

  const removeExtra = (id: string) => {
    setExtras((prev) => prev.filter((x) => x.id !== id));
  };

  const removeItem = (id: string) => {
    const next = catalog.filter((c) => c.id !== id);
    persistCatalog(next);
    setValues((prev) => {
      const nextVal = { ...prev };
      delete nextVal[id];
      return nextVal;
    });
    setRemains((prev) => {
      const nextVal = { ...prev };
      delete nextVal[id];
      return nextVal;
    });
    setRemainUnits((prev) => {
      const nextVal = { ...prev };
      delete nextVal[id];
      return nextVal;
    });
    flash(t("msgItemDeleted", lang));
  };

  const updateItem = (id: string, patch: Partial<CatalogItem>) => {
    const next = catalog.map((c) => (c.id === id ? { ...c, ...patch } : c));
    persistCatalog(next);
    flash(t("msgItemUpdated", lang));
  };

  const resetTodayData = () => {
    setConfirmModal({
      isOpen: true,
      title: lang === "mm" ? "ယနေ့စာရင်း ပြန်စမည်" : lang === "th" ? "รีเซ็ตข้อมูลวันนี้" : "Reset Today Data",
      message: t("msgResetConfirm", lang),
      onConfirm: () => {
        setValues({});
        setRemains({});
        setRemainUnits({});
        setExtras([]);
        flash(t("msgResetDone", lang));
      },
    });
  };

  const restoreDefaultCatalog = () => {
    setConfirmModal({
      isOpen: true,
      title: lang === "mm" ? "မူလကုန်ကြမ်းစာရင်း ပြန်ယူမည်" : lang === "th" ? "คืนค่ารายการเริ่มต้น" : "Restore Default Catalog",
      message: lang === "mm" ? "မူလကုန်ကြမ်းစာရင်းများကို ပြန်လည်ရယူမှာ သေချာပါသလား?" : lang === "th" ? "คุณแน่ใจหรือไม่ที่จะคืนค่ารายการเริ่มต้น?" : "Are you sure you want to restore default catalog items?",
      onConfirm: () => {
        persistCatalog(DEFAULT_CATALOG);
        flash("Restored default catalog!");
      },
    });
  };

  const clearCategoryValues = (category: CategoryType) => {
    const catItemIds: string[] = catalog
      .filter((c) => c.category === category)
      .map((c) => c.id);
    setValues((prev) => {
      const next = { ...prev };
      catItemIds.forEach((id) => delete next[id]);
      return next;
    });
    setRemains((prev) => {
      const next = { ...prev };
      catItemIds.forEach((id) => delete next[id]);
      return next;
    });
    setRemainUnits((prev) => {
      const next = { ...prev };
      catItemIds.forEach((id) => delete next[id]);
      return next;
    });
    const label = category === "veg" ? "Veg" : "Grocery";
    flash(`Deselected all ${label} items`);
  };

  const orderOnlyMakro = () => {
    clearCategoryValues("veg");
    flash("Deselected Veg. Ordering Grocery/Makro only!");
  };

  const orderOnlyVeg = () => {
    clearCategoryValues("gen");
    flash("Deselected Grocery. Ordering Veg only!");
  };

  const exportExcel = () => {
    const dParts = date.split("-");
    let dateStr = date;
    if (dParts.length === 3) {
      const y = parseInt(dParts[0], 10);
      const m = parseInt(dParts[1], 10);
      const d = parseInt(dParts[2], 10);
      const thaiYearShort = (y + 543) % 100;
      dateStr = `${d}.${m}.${thaiYearShort}`;
    }

    const isItemActive = (c: CatalogItem) => {
      const v = values[c.id];
      const r = remains[c.id];
      return (typeof v === "number" && v > 0) || (typeof r === "number" && r > 0);
    };

    const orderedVeg = catalog.filter(
      (c) => c.category === "veg" && isItemActive(c)
    );
    const orderedGen = catalog.filter(
      (c) => c.category === "gen" && isItemActive(c)
    );

    if (orderedVeg.length === 0 && orderedGen.length === 0 && extras.length === 0) {
      flash("No ordered items to export!");
      return;
    }

    const wb = XLSX.utils.book_new();

    const headerTitle = `รายการเบิก\nสาขา .${excelBranch}............`;

    const createSheetFromItems = (
      items: { name: string; remain: string | number; qty: string | number }[],
      customHeader: string = headerTitle
    ) => {
      const ws: XLSX.WorkSheet = {};

      const thinBorder = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      // Header Row 1 & 2
      ws["A1"] = {
        v: "No.",
        t: "s",
        s: {
          font: { bold: true, sz: 12, name: "Tahoma" },
          fill: { fgColor: { rgb: "FFE699" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: thinBorder,
        },
      };
      ws["A2"] = {
        v: "",
        t: "s",
        s: { fill: { fgColor: { rgb: "FFE699" } }, border: thinBorder },
      };

      ws["B1"] = {
        v: customHeader,
        t: "s",
        s: {
          font: { bold: true, sz: 12, name: "Tahoma" },
          fill: { fgColor: { rgb: "FFE699" } },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
          border: thinBorder,
        },
      };
      ws["B2"] = {
        v: "",
        t: "s",
        s: { fill: { fgColor: { rgb: "FFE699" } }, border: thinBorder },
      };

      ws["C1"] = {
        v: dateStr,
        t: "s",
        s: {
          font: { bold: true, sz: 12, name: "Tahoma", color: { rgb: "1F4E78" } },
          fill: { fgColor: { rgb: "D9E1F2" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: thinBorder,
        },
      };
      ws["D1"] = {
        v: "",
        t: "s",
        s: { fill: { fgColor: { rgb: "D9E1F2" } }, border: thinBorder },
      };

      ws["C2"] = {
        v: "เหลือ",
        t: "s",
        s: {
          font: { bold: true, sz: 12, name: "Tahoma", color: { rgb: "C00000" } },
          fill: { fgColor: { rgb: "FCE4D6" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: thinBorder,
        },
      };
      ws["D2"] = {
        v: "เบิก",
        t: "s",
        s: {
          font: { bold: true, sz: 12, name: "Tahoma", color: { rgb: "375623" } },
          fill: { fgColor: { rgb: "E2EFDA" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: thinBorder,
        },
      };

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },
      ];

      items.forEach((item, idx) => {
        const rowNum = idx + 3;
        const rowBg = idx % 2 === 0 ? "FFFFFF" : "F2F4F8";

        ws[`A${rowNum}`] = {
          v: idx + 1,
          t: "n",
          s: {
            font: { bold: true, sz: 11, name: "Tahoma" },
            fill: { fgColor: { rgb: rowBg } },
            alignment: { horizontal: "center", vertical: "center" },
            border: thinBorder,
          },
        };

        ws[`B${rowNum}`] = {
          v: item.name,
          t: "s",
          s: {
            font: { bold: true, sz: 11, name: "Tahoma" },
            fill: { fgColor: { rgb: rowBg } },
            alignment: { horizontal: "left", vertical: "center" },
            border: thinBorder,
          },
        };

        const remVal =
          item.remain !== "" && item.remain !== undefined && item.remain !== null
            ? item.remain
            : "";
        ws[`C${rowNum}`] = {
          v: remVal,
          t: typeof remVal === "number" ? "n" : "s",
          s: {
            font: { bold: true, sz: 11, name: "Tahoma", color: { rgb: "C00000" } },
            fill: { fgColor: { rgb: rowBg } },
            alignment: { horizontal: "center", vertical: "center" },
            border: thinBorder,
          },
        };

        const qtyVal =
          item.qty !== "" && item.qty !== undefined && item.qty !== null
            ? item.qty
            : "";
        ws[`D${rowNum}`] = {
          v: qtyVal,
          t: typeof qtyVal === "number" ? "n" : "s",
          s: {
            font: { bold: true, sz: 11, name: "Tahoma", color: { rgb: "000000" } },
            fill: { fgColor: { rgb: rowBg } },
            alignment: { horizontal: "center", vertical: "center" },
            border: thinBorder,
          },
        };
      });

      const totalRows = items.length + 2;
      ws["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: Math.max(1, totalRows - 1), c: 3 },
      });

      ws["!cols"] = [{ wch: 10 }, { wch: 54 }, { wch: 16 }, { wch: 18 }];

      const rowHeights = [{ hpt: 28 }, { hpt: 26 }];
      for (let i = 0; i < items.length; i++) {
        rowHeights.push({ hpt: 24 });
      }
      ws["!rows"] = rowHeights;

      return ws;
    };

    const formatCatalogRow = (c: CatalogItem) => {
      let displayName = c.th;
      if (c.mm) displayName += ` (${c.mm})`;
      if (c.en) displayName += ` [${c.en}]`;

      const defaultUnit = c.unit || "";
      const chosenRemainUnit = remainUnits[c.id] || defaultUnit;
      const remainUnitLabel = chosenRemainUnit ? ` ${chosenRemainUnit}` : "";
      const qtyUnitLabel = defaultUnit ? ` ${defaultUnit}` : "";

      const remVal =
        remains[c.id] !== undefined && remains[c.id] !== null
          ? `${remains[c.id]}${remainUnitLabel}`
          : "";
      const qtyVal =
        values[c.id] !== undefined && values[c.id] !== null
          ? `${values[c.id]}${qtyUnitLabel}`
          : "";

      return {
        name: displayName,
        remain: remVal,
        qty: qtyVal,
      };
    };

    const allOrderedItems = [
      ...orderedVeg.map(formatCatalogRow),
      ...orderedGen.map(formatCatalogRow),
      ...extras.map((x) => ({
        name: `${x.name} (အပို)`,
        remain: "",
        qty: `${x.qty} ${x.unit}`,
      })),
    ];

    if (allOrderedItems.length > 0) {
      const wsAll = createSheetFromItems(allOrderedItems, headerTitle);
      XLSX.utils.book_append_sheet(wb, wsAll, "รายการรวม");
    }

    if (orderedVeg.length > 0) {
      const vegRows = orderedVeg.map(formatCatalogRow);
      const wsVeg = createSheetFromItems(vegRows, "รายการเบิก (ผัก-ผลไม้)");
      XLSX.utils.book_append_sheet(wb, wsVeg, "ผัก-ผลไม้");
    }

    if (orderedGen.length > 0) {
      const genRows = orderedGen.map(formatCatalogRow);
      const wsGen = createSheetFromItems(genRows, headerTitle);
      XLSX.utils.book_append_sheet(wb, wsGen, "ของแห้ง-ของใช้");
    }

    if (extras.length > 0) {
      const exRows = extras.map((x) => ({
        name: x.name,
        remain: "",
        qty: `${x.qty} ${x.unit}`,
      }));
      const wsEx = createSheetFromItems(exRows, "รายการเบิก (Extra Items)");
      XLSX.utils.book_append_sheet(wb, wsEx, "Extra");
    }

    XLSX.writeFile(wb, `order_${excelBranch}_${dateStr.replace(/\./g, "_")}.xlsx`);
    flash(`Excel exported successfully! (${allOrderedItems.length} items)`);
  };

  const filterLower = filter.trim().toLowerCase();

  const filterItemByView = (c: CatalogItem) => {
    const v = values[c.id];
    const isOrdered = typeof v === "number" && v > 0;
    const isSkipped = v === null;
    const isUnentered = v === undefined || v === 0;

    if (filterView === "ordered") return isOrdered;
    if (filterView === "skipped") return isSkipped;
    if (filterView === "unentered") return isUnentered;
    return true;
  };

  const matchesSearch = (c: CatalogItem) =>
    !filterLower ||
    c.th.toLowerCase().includes(filterLower) ||
    (c.mm || "").toLowerCase().includes(filterLower) ||
    (c.en || "").toLowerCase().includes(filterLower);

  return (
    <div className="min-h-screen bg-[#EFE9DD] text-[#2B2A28] font-sans">
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Header Title & Language Selector */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#D9D2C1]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1F5D50] flex items-center justify-center text-[#EFE9DD] shadow-xs">
              <ShoppingBasket size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                {t("appTitle", lang)}
              </h1>
              <p className="text-xs text-stone-600 font-medium">
                {t("appSubTitle", lang)}
              </p>
            </div>
          </div>

          {/* Language Switcher Control */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-[#D9D2C1] shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 px-1.5 flex items-center gap-1">
                <Globe size={13} />
              </span>
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => setLang(opt.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    lang === opt.code
                      ? "bg-[#1F5D50] text-white shadow-2xs"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowInstallModal(true)}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-amber-200 border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Install as Desktop App / Pin to Taskbar"
            >
              💻 <span>Desktop App / Taskbar 📌</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={15} /> {t("addCatalogItem", lang)}
            </button>
          </div>
        </div>

        {/* Action Toolbar & Date Selector */}
        <div className="mt-4 bg-[#FBF9F3] border border-[#D9D2C1] rounded-xl p-3 sm:p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-600">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#D9D2C1] bg-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1F5D50]"
                />
              </div>

              {/* Branch name selector */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-stone-500">Branch:</span>
                <select
                  value={excelBranch}
                  onChange={(e) => setExcelBranch(e.target.value)}
                  className="px-2 py-1 bg-white border border-[#D9D2C1] rounded-lg text-xs font-bold text-stone-800"
                >
                  <option value="Makro">Makro</option>
                  <option value="Big C">Big C</option>
                  <option value="Lotus">Lotus</option>
                  <option value="Market">Fresh Market</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={resetTodayData}
                title={t("resetToday", lang)}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> {t("resetToday", lang)}
              </button>

              <button
                onClick={saveOrder}
                disabled={saving}
                className="px-3.5 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin text-emerald-800" />
                ) : (
                  <Save size={14} strokeWidth={2.5} />
                )}
                {t("saveToday", lang)}
              </button>

              <button
                onClick={exportExcel}
                className="px-3.5 py-1.5 bg-[#1F5D50] hover:bg-[#18493f] text-[#EFE9DD] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download size={14} strokeWidth={2.5} />
                {t("downloadExcel", lang)}
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {msg && (
            <div className="mt-3 px-3 py-2 bg-emerald-100/90 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Sparkles size={14} className="text-emerald-700" />
              <span>{msg}</span>
            </div>
          )}
        </div>

        {/* Summary Breakdown */}
        <SummaryCard catalog={catalog} values={values} extras={extras} lang={lang} />

        {/* Search & Filter View Tabs */}
        <div className="space-y-2 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder", lang)}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9D2C1] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5D50]"
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-500 font-medium px-1 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>
            <button
              onClick={() => setFilterView("all")}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterView === "all"
                  ? "bg-[#1F5D50] text-white border-[#1F5D50]"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
              }`}
            >
              {t("filterAll", lang)} ({catalog.length})
            </button>
            <button
              onClick={() => setFilterView("ordered")}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterView === "ordered"
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
              }`}
            >
              {t("filterOrdered", lang)} (
              {catalog.filter((c) => typeof values[c.id] === "number" && (values[c.id] as number) > 0).length}
              )
            </button>
            <button
              onClick={() => setFilterView("skipped")}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterView === "skipped"
                  ? "bg-rose-700 text-white border-rose-700"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
              }`}
            >
              {t("filterSkipped", lang)} (
              {catalog.filter((c) => values[c.id] === null).length}
              )
            </button>
            <button
              onClick={() => setFilterView("unentered")}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterView === "unentered"
                  ? "bg-amber-700 text-white border-amber-700"
                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
              }`}
            >
              {t("filterUnentered", lang)} (
              {catalog.filter((c) => values[c.id] === undefined || values[c.id] === 0).length}
              )
            </button>
          </div>
        </div>

        {/* Quick Order Selection Modes */}
        <div className="mt-4 p-3 bg-[#FAF7F0] border border-[#D9D2C1] rounded-xl flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
            ⚡ Quick Selection Modes:
          </span>
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
            <button
              onClick={orderOnlyMakro}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              🛒 Makro Only (Deselect Veg)
            </button>
            <button
              onClick={orderOnlyVeg}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              🥦 Veg Only (Deselect Makro)
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("extra-items-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              📝 {t("extraSectionTitle", lang)}
            </button>
          </div>
        </div>

        {/* Item List Grouped By Category */}
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-stone-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[#1F5D50]" />
              <span>Loading...</span>
            </div>
          ) : (
            (["veg", "gen"] as const).map((cat) => {
              const categoryItems = catalog.filter(
                (c) => c.category === cat && matchesSearch(c) && filterItemByView(c)
              );
              const totalCatItems = catalog.filter((c) => c.category === cat).length;
              if (categoryItems.length === 0 && filter) return null;

              const isOpen = openCat[cat] ?? true;
              const titleText = cat === "veg" ? t("catVegTitle", lang) : t("catGenTitle", lang);

              return (
                <div key={cat} className="bg-[#FBF9F3] border border-[#D9D2C1] rounded-2xl overflow-hidden shadow-2xs">
                  {/* Category Header Bar */}
                  <div
                    onClick={() => setOpenCat((p) => ({ ...p, [cat]: !p[cat] }))}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#E3DDCB] hover:bg-[#DAD3BF] text-stone-900 font-bold text-sm transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <span>{titleText}</span>
                      <span className="text-xs font-mono font-normal text-stone-600 bg-white/70 px-2 py-0.5 rounded-full">
                        {categoryItems.length} / {totalCatItems}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => clearCategoryValues(cat)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white/90 hover:bg-rose-100 hover:text-rose-800 border border-stone-300 hover:border-rose-300 rounded-lg flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Ban size={12} className="text-rose-600" />
                        <span>Deselect All ({cat === "veg" ? "Veg" : "Grocery"})</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Item List */}
                  {isOpen && (
                    <div className="p-3 space-y-2">
                      {categoryItems.length === 0 ? (
                        <p className="text-xs text-stone-500 italic text-center py-4">
                          No items found for current filter
                        </p>
                      ) : (
                        categoryItems.map((c) => (
                          <ItemRow
                            key={c.id}
                            item={c}
                            value={values[c.id]}
                            remainValue={remains[c.id]}
                            remainUnit={remainUnits[c.id]}
                            lang={lang}
                            onSetQty={setQty}
                            onSetRemain={setRemain}
                            onSetRemainUnit={setRemainUnit}
                            onToggleSkip={toggleSkip}
                            onUpdateItem={updateItem}
                            onRemoveItem={removeItem}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Extra Daily Items Section */}
        <ExtraItemsSection
          extras={extras}
          lang={lang}
          onAddExtra={addExtra}
          onRemoveExtra={removeExtra}
          onAddCatalogItem={addCatalogItem}
        />

        {/* Footer info & restore catalog option */}
        <div className="mt-8 pt-4 border-t border-stone-300/60 flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2">
          <span>{t("appTitle", lang)} · Multilingual Ordering Assistant</span>
          <button
            onClick={restoreDefaultCatalog}
            className="text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Restore Default Catalog
          </button>
        </div>
      </div>

      {/* Add Catalog Item Modal */}
      <AddCatalogModal
        isOpen={showAddModal}
        lang={lang}
        onClose={() => setShowAddModal(false)}
        onAdd={addCatalogItem}
      />

      {/* Desktop App PWA Install Guide Modal */}
      <InstallGuideModal
        isOpen={showInstallModal}
        lang={lang}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-base text-stone-900">{confirmModal.title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {t("cancel", lang)}
              </button>
              <button
                onClick={() => {
                  const cb = confirmModal.onConfirm;
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  cb();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                OK / Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
