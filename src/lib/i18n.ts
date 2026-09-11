export type Language = 'th' | 'mm' | 'en';

export const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'mm', label: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const translations = {
  appTitle: {
    th: 'ระบบสั่งซื้อวัตถุดิบประจำวัน',
    mm: 'နေ့စဉ် ကုန်ကြမ်းမှာယူမှု စနစ်',
    en: 'Daily Raw Material Ordering System',
  },
  appSubTitle: {
    th: 'สาขา Makro & สั่งของสด / ของแห้งประจำวัน',
    mm: 'Makro ဆိုင်ခွဲ နှင့် နေ့စဉ် သားငါး/ဟင်းသီးဟင်းရွက်/ကုန်စုံ မှာယူရန်',
    en: 'Daily Fresh & Grocery Purchasing List for Branches',
  },
  saveToday: {
    th: 'บันทึกข้อมูลวันนี้',
    mm: 'ယနေ့စာရင်း သိမ်းမည်',
    en: 'Save Today Data',
  },
  saving: {
    th: 'กำลังบันทึก...',
    mm: 'သိမ်းဆည်းနေသည်...',
    en: 'Saving...',
  },
  downloadExcel: {
    th: 'ดาวน์โหลด Excel (.xlsx)',
    mm: 'Excel ထုတ်ယူမည် (.xlsx)',
    en: 'Export Excel (.xlsx)',
  },
  resetToday: {
    th: 'รีเซ็ตข้อมูลวันนี้',
    mm: 'ယနေ့စာရင်း ပြန်စမည်',
    en: 'Reset Today Data',
  },
  addCatalogItem: {
    th: 'เพิ่มวัตถุดิบใหม่',
    mm: 'ကုန်ကြမ်းအသစ် ထည့်မည်',
    en: 'Add New Catalog Item',
  },
  searchPlaceholder: {
    th: 'ค้นหารายการวัตถุดิบ (ไทย / မြန်မာ / English)...',
    mm: 'ကုန်ကြမ်းရှာရန် (ထိုင်း / မြန်မာ / English)...',
    en: 'Search items (Thai / Myanmar / English)...',
  },
  
  // Filters
  filterAll: {
    th: 'ทั้งหมด',
    mm: 'အားလုံး',
    en: 'All Items',
  },
  filterOrdered: {
    th: 'เบิกแล้ว / มีจำนวน',
    mm: 'မှာထားသည်များ',
    en: 'Ordered Items',
  },
  filterSkipped: {
    th: 'ไม่เอา (Skip)',
    mm: 'မလိုသေးပါ',
    en: 'Skipped Items',
  },
  filterUnentered: {
    th: 'ยังไม่ได้ระบุ',
    mm: 'မဖြည့်ရသေးပါ',
    en: 'Unentered',
  },

  // Summary Card
  totalOrdered: {
    th: 'ยอดสั่งซื้อทั้งหมด',
    mm: 'စုစုပေါင်း မှာယူမှု',
    en: 'Total Ordered',
  },
  totalCatalog: {
    th: 'รายการในแคตตาล็อก',
    mm: 'စာရင်းဝင်',
    en: 'Catalog Items',
  },
  totalExtras: {
    th: 'รายการเพิ่มเติม',
    mm: 'အပိုထည့်ထားသည်',
    en: 'Extra Items',
  },
  categoryVeg: {
    th: 'ผัก / ผลไม้',
    mm: 'ဟင်းသီးဟင်းရွက် / သစ်သီး',
    en: 'Vegetables & Fruits',
  },
  categoryGen: {
    th: 'ของแห้ง / ของใช้ (Makro)',
    mm: 'ကုန်စုံ / သုံးကုန်',
    en: 'Grocery & Dry Goods',
  },
  categorySkipped: {
    th: 'ไม่ต้องการสั่ง',
    mm: 'မလိုသေးပါ',
    en: 'Skipped Items',
  },

  // Item row controls
  skipBtn: {
    th: 'ไม่เอา',
    mm: 'မလို',
    en: 'Skip',
  },
  skippedLabel: {
    th: '❎ ไม่เอา',
    mm: '❎ မလို',
    en: '❎ Skipped',
  },
  remainShort: {
    th: 'เหลือ:',
    mm: 'ကျန်:',
    en: 'Remain:',
  },
  orderShort: {
    th: 'เบิก:',
    mm: 'မှာ:',
    en: 'Order:',
  },
  unitKg: {
    th: 'กก. (kg)',
    mm: 'ကီလို (kg)',
    en: 'kg',
  },
  unitPcs: {
    th: 'ชิ้น/ถุง (p)',
    mm: 'ခု/ဘူး (p)',
    en: 'pcs',
  },
  editItem: {
    th: 'แก้ไขรายการ',
    mm: 'ပြင်ဆင်မည်',
    en: 'Edit Item',
  },
  save: {
    th: 'บันทึก',
    mm: 'သိမ်းမည်',
    en: 'Save',
  },
  cancel: {
    th: 'ยกเลิก',
    mm: 'ပယ်ဖျက်',
    en: 'Cancel',
  },

  // Category Sections
  catVegTitle: {
    th: '🥦 หมวดผักและผลไม้สด (Veg/Fruit)',
    mm: '🥦 ဟင်းသီးဟင်းရွက် / သစ်သီး (ผัก/ผลไม้)',
    en: '🥦 Vegetables & Fresh Fruits',
  },
  catGenTitle: {
    th: '🛒 หมวดของแห้งและเครื่องปรุง Makro (Grocery)',
    mm: '🛒 ကုန်စုံ / သုံးကုန် (ของแห้ง/ของใช้)',
    en: '🛒 Grocery & Kitchen Supplies',
  },

  // Extra section
  extraSectionTitle: {
    th: 'เพิ่มรายการเติมนอกเหนือจากแคตตาล็อก',
    mm: 'ကျန်တဲ့ပစ္စည်းများ ရေးထည့်ရန်',
    en: 'Add Extra / Remaining Items',
  },
  extraSectionSub: {
    th: 'สามารถพิมพ์เพิ่มรายการที่ไม่มีในตารางได้ง่ายๆ',
    mm: 'ဇယားတွင် မပါသေးသော ကျန်သည့် ပစ္စည်းများကို အလွယ်တကူ ရေးထည့်နိုင်ပါသည်',
    en: 'Quickly add items not found in the main catalog table',
  },
  singleAdd: {
    th: 'เพิ่มทีละรายการ',
    mm: 'တစ်မျိုးချင်း',
    en: 'Single Item',
  },
  bulkAdd: {
    th: 'เพิ่มทีละหลายบรรทัด',
    mm: 'စာကြောင်းလိုက်',
    en: 'Bulk Text Add',
  },
  itemName: {
    th: 'ชื่อสินค้า',
    mm: 'ပစ္စည်းအမည်',
    en: 'Item Name',
  },
  quantity: {
    th: 'จำนวน',
    mm: 'အရေအတွက်',
    en: 'Quantity',
  },
  unit: {
    th: 'หน่วย',
    mm: 'ယူနစ်',
    en: 'Unit',
  },
  addToLocation: {
    th: 'บันทึกไปยัง:',
    mm: 'ထည့်သွင်းမည့်နေရာ:',
    en: 'Add to location:',
  },
  todayExtraOnly: {
    th: 'รายการเพิ่มเติมวันนี้เท่านั้น (Today Extra)',
    mm: 'ယနေ့ အပို်ပစ္စည်းအဖြစ် (Today Extra)',
    en: 'Today Extra Only',
  },
  saveToVegCatalog: {
    th: '🥦 เพิ่มเข้าแคตตาล็อกผัก (Veg Catalog)',
    mm: '🥦 ဟင်းသီးဟင်းရွက် (Veg Catalog)',
    en: '🥦 Save to Veg Catalog',
  },
  saveToGenCatalog: {
    th: '🛒 เพิ่มเข้าแคตตาล็อกของแห้ง (Grocery Catalog)',
    mm: '🛒 ကုန်စုံ (Makro Grocery Catalog)',
    en: '🛒 Save to Grocery Catalog',
  },
  addBtn: {
    th: 'เพิ่มรายการ',
    mm: 'ထည့်မည်',
    en: 'Add Item',
  },
  addAllBtn: {
    th: 'เพิ่มรายการทั้งหมด',
    mm: 'အကုန်လုံး တစ်ခါတည်း ထည့်မည်',
    en: 'Add All Lines',
  },
  bulkPlaceholder: {
    th: 'ตัวอย่าง:\nมะนาว 2 kg\nน้ำตาล 3\nกระดาษทิชชู่ 1',
    mm: 'ဥပမာ:\nมะนาว 2 kg\nน้ำตาล 3\nกระดาษทิชชู่ 1',
    en: 'Example:\nLemon 2 kg\nSugar 3\nTissue 1',
  },
  addedExtrasTitle: {
    th: 'รายการเพิ่มเติมวันนี้',
    mm: 'ယနေ့ထည့်ထားသော အပို/ကျန်တဲ့ပစ္စည်းများ',
    en: 'Added Extra Items Today',
  },
  noExtras: {
    th: 'ยังไม่มีรายการเพิ่มเติมวันนี้',
    mm: 'ယနေ့အတွက် အပို်/ကျန်တဲ့ပစ္စည်း မရှိသေးပါ',
    en: 'No extra items added for today',
  },

  // Modal
  addNewTitle: {
    th: 'เพิ่มวัตถุดิบใหม่เข้าสู่แคตตาล็อก',
    mm: 'ကုန်ကြမ်းအသစ် ထည့်သွင်းမည်',
    en: 'Add New Catalog Item',
  },
  thaiName: {
    th: 'ชื่อภาษาไทย *',
    mm: 'ထိုင်းအမည် (Thai Name) *',
    en: 'Thai Name *',
  },
  myanmarName: {
    th: 'คำอ่านภาษาเมียนมา / คำแปล',
    mm: 'မြန်မာအသံထွက် (Myanmar Translation)',
    en: 'Myanmar Pronunciation / Translation',
  },
  englishName: {
    th: 'ชื่อภาษาอังกฤษ (English Name)',
    mm: 'အင်္ဂလိပ်အမည် (English Name)',
    en: 'English Name',
  },
  categoryLabel: {
    th: 'หมวดหมู่',
    mm: 'အမျိုးအစား',
    en: 'Category',
  },

  // Excel Title
  excelTitleLabel: {
    th: 'หัวข้อใน Excel:',
    mm: 'Excel ခေါင်းစဉ်:',
    en: 'Excel Sheet Header:',
  },
  defaultExcelHeader: {
    th: 'รายการเบิก\nสาขา .Makro............',
    mm: 'รายการเบิก\nสาขา .Makro............',
    en: 'Ordering List\nBranch: .Makro............',
  },

  // Toast messages
  msgSaved: {
    th: 'บันทึกข้อมูลวันนี้เรียบร้อยแล้ว',
    mm: 'ယနေ့စာရင်း သိမ်းပြီးပါပြီ',
    en: 'Today order saved successfully!',
  },
  msgSaveFailed: {
    th: 'เกิดข้อผิดพลาดในการบันทึก',
    mm: 'သိမ်းရာတွင် အမှားရှိသည်',
    en: 'Failed to save data',
  },
  msgResetConfirm: {
    th: 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลวันนี้?',
    mm: 'ယနေ့ထည့်ထားသော အချက်အလက်များကို ပြန်လည်စတင်မှာ သေချာပါသလား?',
    en: 'Are you sure you want to reset today data?',
  },
  msgResetDone: {
    th: 'รีเซ็ตข้อมูลวันนี้เรียบร้อยแล้ว',
    mm: 'ယနေ့စာရင်း ပြန်စပြီးပါပြီ',
    en: 'Reset today data completed!',
  },
  msgItemExists: {
    th: 'มีรายการนี้ในระบบแล้ว',
    mm: 'ဒီပစ္စည်းအမည် ရှိပြီးသားဖြစ်သည်',
    en: 'This item already exists!',
  },
  msgItemAdded: {
    th: 'เพิ่มวัตถุดิบใหม่เรียบร้อยแล้ว',
    mm: 'ကုန်ကြမ်းအသစ် ထည့်ပြီးပါပြီ',
    en: 'New catalog item added!',
  },
  msgDeleteConfirm: {
    th: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    mm: 'ဒီပစ္စည်းကို ကုန်ကြမ်းစာရင်းမှ ဖျက်မှာ သေချာပါသလား?',
    en: 'Are you sure you want to delete this item?',
  },
  msgItemDeleted: {
    th: 'ลบรายการเรียบร้อยแล้ว',
    mm: 'ပစ္စည်းကို ဖျက်ပြီးပါပြီ',
    en: 'Item deleted!',
  },
  msgItemUpdated: {
    th: 'แก้ไขข้อมูลวัตถุดิบเรียบร้อยแล้ว',
    mm: 'ကုန်ကြမ်းအချက်အလက် ပြင်ซင်ပြီးပါပြီ',
    en: 'Item updated successfully!',
  },

  // Desktop App PWA
  installAppBtn: {
    th: 'ติดตั้งแอปบน Desktop / Taskbar',
    mm: 'Desktop App အဖြစ် ထည့်သွင်းမည် / Taskbar မှာထားမည်',
    en: 'Install Desktop App / Pin to Taskbar',
  },
  installAppTitle: {
    th: 'วิธีติดตั้งแอปบน Desktop และ Taskbar',
    mm: 'Desktop App အဖြစ် ထည့်သွင်းပြီး Taskbar မှာထားနည်း',
    en: 'How to install as Desktop App & Pin to Taskbar',
  },
  pwaStep1: {
    th: '1. คลิกปุ่ม "ติดตั้งแอป" ด้านบน หรือสังเกตไอคอน ⊕ ในแถบ Address bar ของ Google Chrome / Microsoft Edge',
    mm: '1. အထက်ပါ "Install App" ခလုတ်ကို နှိပ်ပါ သို့မဟုတ် Chrome / Edge Browser ၏ Address bar (URL ရိုက်သည့်နေရာ) အစွန်ရှိ ⊕ သို့မဟုတ် 💻 icon ကို နှိပ်ပါ။',
    en: '1. Click the "Install App" button above or look for the ⊕ / 💻 icon in Chrome or Edge address bar.',
  },
  pwaStep2: {
    th: '2. กดยืนยัน "Install" เพื่อสร้างไอคอนแอปบนหน้าจอ Desktop',
    mm: '2. "Install" ကို နှိပ်လိုက်ပါက Computer Desktop ပေါ်တွင် App Icon ပေါ်လာပါမည်။',
    en: '2. Click "Install" to create a standalone application window.',
  },
  pwaStep3: {
    th: '3. เมื่อแอปเปิดขึ้นมา คลิกขวาที่ไอคอนแอปบน Taskbar ด้านล่าง แล้วเลือก "Pin to taskbar" เพื่อเปิดใช้งานได้รวดเร็วทันที!',
    mm: '3. App ပွင့်လာပါက Desktop အောက်ခြေရှိ Taskbar ပေါ်မှ App Icon ကို Right-Click (ညာကလစ်) နှိပ်ပြီး "Pin to taskbar" ကို ရွေးထားပါက အမြဲတမ်း အဝင်အထွက် မြန်ဆန်စွာ သုံးနိုင်ပါပြီ။',
    en: '3. Right-click the app icon on your Windows Taskbar and select "Pin to taskbar" for instant access anytime!',
  },
};

export function t(key: keyof typeof translations, lang: Language): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item.th || key;
}
