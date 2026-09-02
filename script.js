/* ============================================================
   ส่วนที่ 2: ตั้งค่าการเชื่อมต่อ Supabase
   ⚠️ แก้ไข SUPABASE_URL และ SUPABASE_ANON_KEY เป็นของโปรเจกต์คุณ
   หาได้จาก Supabase Dashboard > Project Settings > API
   ============================================================ */
const SUPABASE_URL = "https://pynixspbqytddfzhttse.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pps6JY5DBhbkFaqOLw86NA_1GDEjWlM";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = "product-images";
const TABLE_NAME = "products";

// ------------------- หมวดหมู่ MacBook แยกตามปี (2015 - ปีล่าสุด) -------------------
const MACBOOK_YEAR_START = 2015;
const MACBOOK_YEAR_END = new Date().getFullYear();
const MACBOOK_YEAR_KEYS = [];
for (let y = MACBOOK_YEAR_END; y >= MACBOOK_YEAR_START; y--) {
  MACBOOK_YEAR_KEYS.push(`macbook_${y}`);
}

// กลุ่ม "ส่วนประกอบคอมพิวเตอร์" ที่จะถูกยุบรวมเป็นปุ่มเดียวในแถบหมวดหมู่ด่วน (storefront quick-nav)
// หมายเหตุ: "คอม All In One" และ "คอมชุด" แยกออกมาเป็นหมวดเดี่ยวข้างนอก ไม่รวมอยู่ในกลุ่มนี้ตามที่แจ้ง
const COMPONENT_CATEGORY_KEYS = [
  "ram", "ssd", "hdd", "cpu", "motherboard", "gpu", "psu", "case", "monitor",
];

const CATEGORY_KEYS = [
  ...COMPONENT_CATEGORY_KEYS,
  "all_in_one", "comset", "notebook",
  ...MACBOOK_YEAR_KEYS,
  "mouse", "keyboard", "mousepad", "audio", "peripheral", "other",
];

// กลุ่ม option สำหรับ dropdown เลือกหมวดหมู่ (ส่วนประกอบคอม + MacBook พับเป็นกลุ่มย่อยแบบเลื่อนลง)
// "คอม All In One" และ "คอมชุด" อยู่นอกกลุ่มส่วนประกอบ เป็นหมวดเดี่ยวเหมือน notebook
const CATEGORY_GROUPS = {
  th: [
    { label: "ส่วนประกอบคอมพิวเตอร์", keys: COMPONENT_CATEGORY_KEYS },
    { label: null, keys: ["all_in_one", "comset", "notebook"] },
    { label: "MacBook", keys: MACBOOK_YEAR_KEYS },
    { label: null, keys: ["mouse", "keyboard", "mousepad", "audio", "peripheral", "other"] },
  ],
  en: [
    { label: "Computer Components", keys: COMPONENT_CATEGORY_KEYS },
    { label: null, keys: ["all_in_one", "comset", "notebook"] },
    { label: "MacBook", keys: MACBOOK_YEAR_KEYS },
    { label: null, keys: ["mouse", "keyboard", "mousepad", "audio", "peripheral", "other"] },
  ],
  zh: [
    { label: "电脑配件", keys: COMPONENT_CATEGORY_KEYS },
    { label: null, keys: ["all_in_one", "comset", "notebook"] },
    { label: "MacBook", keys: MACBOOK_YEAR_KEYS },
    { label: null, keys: ["mouse", "keyboard", "mousepad", "audio", "peripheral", "other"] },
  ],
};

const CATEGORY_LABELS = {
  th: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "เมนบอร์ด", gpu: "การ์ดจอ", psu: "เพาเวอร์ซัพพลาย", case: "เคสคอมพิวเตอร์", monitor: "จอมอนิเตอร์", all_in_one: "คอมพิวเตอร์ All In One", comset: "คอมชุด (จัดสเปค)", notebook: "โน้ตบุ๊ก", mouse: "เมาส์", keyboard: "คีย์บอร์ด", mousepad: "แผ่นรองเมาส์", audio: "หูฟัง & ลำโพง", peripheral: "อุปกรณ์ต่อพ่วง", other: "อื่นๆ" },
  en: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "Motherboard", gpu: "Graphics Card", psu: "Power Supply", case: "Computer Case", monitor: "Monitor", all_in_one: "All-in-One PC", comset: "PC Bundle Set", notebook: "Notebook", mouse: "Mouse", keyboard: "Keyboard", mousepad: "Mouse Pad", audio: "Headphones & Speakers", peripheral: "Peripherals", other: "Other" },
  zh: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "主板", gpu: "显卡", psu: "电源", case: "机箱", monitor: "显示器", all_in_one: "一体机", comset: "组装套装", notebook: "笔记本电脑", mouse: "鼠标", keyboard: "键盘", mousepad: "鼠标垫", audio: "耳机 & 音箱", peripheral: "外围设备", other: "其他" },
};
// ป้ายชื่อรุ่นปีของ MacBook (เหมือนกันทุกภาษา ใช้ตัวเลขปี)
MACBOOK_YEAR_KEYS.forEach((key) => {
  const year = key.replace("macbook_", "");
  CATEGORY_LABELS.th[key] = `MacBook (${year})`;
  CATEGORY_LABELS.en[key] = `MacBook (${year})`;
  CATEGORY_LABELS.zh[key] = `MacBook (${year})`;
});
// รองรับสินค้าเดิมที่เคยบันทึกหมวดหมู่เป็นข้อความภาษาไทยไว้ก่อนเปลี่ยนมาใช้ key
const LEGACY_CATEGORY_MAP = {
  "RAM": "ram", "SSD": "ssd", "HDD": "hdd", "CPU": "cpu",
  "เมนบอร์ด": "motherboard", "การ์ดจอ": "gpu", "เพาเวอร์ซัพพลาย": "psu",
  "เคสคอมพิวเตอร์": "case", "จอมอนิเตอร์": "monitor", "อุปกรณ์ต่อพ่วง": "peripheral", "อื่นๆ": "other",
  // เดิมเคยแยก "แบตเตอรี่ & แผ่นรองเมาส์" เป็นหมวดของตัวเอง ตอนนี้แยกเป็นเมาส์/คีย์บอร์ด/แผ่นรองเมาส์แล้ว
  "mousepad_battery": "mouse",
  // เดิมรวม "เมาส์ คีย์บอร์ด & แผ่นรองเมาส์" ไว้หมวดเดียว ตอนนี้แยกเป็น 3 หมวดย่อย
  // (สินค้าเก่าจะถูกจัดเข้าเมาส์ไปก่อน ผู้ใช้แก้ไขภายหลังได้ตามจริง)
  "mouse_keyboard": "mouse",
};
function normalizeCategoryKey(cat) {
  if (!cat) return "";
  if (CATEGORY_KEYS.includes(cat)) return cat;
  if (LEGACY_CATEGORY_MAP[cat]) return LEGACY_CATEGORY_MAP[cat];
  return cat;
}
function getCategoryLabel(cat, lang) {
  const key = normalizeCategoryKey(cat);
  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.th;
  return labels[key] || cat || "";
}
const LOW_STOCK_THRESHOLD = 3;

let allProducts = [];

const translations = {
  th: {
    pageTitle: "CompStock Manager - ระบบจัดการสินค้าอุปกรณ์คอมพิวเตอร์",
    addProductButton: "เพิ่มสินค้าใหม่",
    sectionTitle: "รายการสินค้าอุปกรณ์คอมพิวเตอร์",
    searchPlaceholder: "ค้นหาสินค้า... เช่น RAM, SSD, CPU",
    loadingText: "กำลังโหลดข้อมูลสินค้า...",
    emptyTitle: "ยังไม่มีสินค้าในระบบ",
    emptyHelp: "กดปุ่ม \"เพิ่มสินค้าใหม่\" เพื่อเริ่มบันทึกข้อมูล",
    modalTitle: "เพิ่มสินค้าใหม่",
    labelProductName: "ชื่อสินค้า",
    labelProductDesc: "รายละเอียดสินค้า",
    labelProductPrice: "ราคา (กีบ)",
    labelProductImage: "รูปภาพสินค้า",
    imageHelperText: "เพิ่มได้หลายรูป เลือกไฟล์หรือถ่ายจากกล้องมือถือได้",
    addImageBtn: "เพิ่มรูปภาพ",
    actionCamera: "ถ่ายภาพใหม่",
    actionGallery: "เลือกจากคลังภาพ",
    actionCancel: "ยกเลิก",
    placeholderProductName: "เช่น RAM DDR4 16GB",
    placeholderProductDesc: "รายละเอียด สเปค หรือหมายเหตุเพิ่มเติม",
    cancelButton: "ยกเลิก",
    saveButton: "บันทึกสินค้า",
    editModalTitle: "แก้ไขสินค้า",
    countLabel: (count) => `${count} รายการ`,
    noDescription: "ไม่มีรายละเอียด",
    loadError: "ไม่สามารถโหลดข้อมูลสินค้าได้: ",
    requireFields: "กรุณากรอกชื่อสินค้าและราคาให้ครบถ้วน",
    saved: "บันทึกสินค้าเรียบร้อยแล้ว",
    saveError: "เกิดข้อผิดพลาดในการบันทึก: ",
    confirmDelete: "ยืนยันการลบสินค้านี้หรือไม่?",
    deleted: "ลบสินค้าเรียบร้อยแล้ว",
    deleteError: "เกิดข้อผิดพลาดในการลบสินค้า: ",
    updateNoRows: "ไม่พบสินค้าที่จะอัปเดต หรือคุณไม่มีสิทธิ์แก้ไข",
    labelProductCategory: "หมวดหมู่",
    labelProductQty: "จำนวนคงเหลือ",
    qtyLabel: "คงเหลือ",
    outOfStock: "สินค้าหมด",
    statTypesLabel: "ชนิดสินค้า",
    statQuantityLabel: "จำนวนรวม (ชิ้น)",
    statValueLabel: "มูลค่าสต๊อกรวม",
    statLowLabel: "สินค้าใกล้หมด",
    allCategories: "ทุกหมวดหมู่",
    categorySidebarTitle: "หมวดหมู่สินค้า",
    stockButton: "สต๊อกสินค้า",
    stockModalTitle: "สรุปข้อมูลสต๊อกสินค้า",
    viewEditButton: "แก้ไข",
    viewDeleteButton: "ลบ",
    sortNewest: "ใหม่ล่าสุด",
    sortOldest: "เก่าสุด",
    sortPriceAsc: "ราคา: น้อย → มาก",
    sortPriceDesc: "ราคา: มาก → น้อย",
    sortNameAsc: "ชื่อ: ก → ฮ",
    deleteButton: "ลบ",
    backButton: "กลับ",
    notFoundText: "ไม่พบสินค้านี้ อาจถูกลบไปแล้ว",
    topBarTagline: "ตัวแทนจำหน่ายอุปกรณ์คอมพิวเตอร์ครบวงจร",
    heroEyebrow1: "CompStock Manager", heroTitle1: "จัดการสต๊อกสินค้าคอมพิวเตอร์ ง่ายในที่เดียว", heroDesc1: "เพิ่ม แก้ไข และติดตามสินค้าอุปกรณ์คอมพิวเตอร์ทั้งหมดของคุณแบบเรียลไทม์",
    heroEyebrow2: "สต๊อกเรียลไทม์", heroTitle2: "รู้ทันสินค้าใกล้หมดก่อนใคร", heroDesc2: "ระบบแจ้งเตือนสินค้าใกล้หมดสต๊อก พร้อมสรุปมูลค่าสินค้าคงเหลือทั้งหมด",
    heroEyebrow3: "รูปภาพหลายรูป", heroTitle3: "ถ่ายภาพหรืออัปโหลดได้จากมือถือ", heroDesc3: "แนบรูปสินค้าได้หลายรูปต่อรายการ พร้อมย่อขนาดไฟล์อัตโนมัติ",
    footerDesc: "ระบบจัดการสต๊อกสินค้าอุปกรณ์คอมพิวเตอร์ ใช้งานง่าย รองรับหลายภาษา",
    footerContactTitle: "ติดต่อเรา", footerFollowTitle: "ติดตามเรา", footerAddress: "เวียงจันทน์, สปป.ลาว",
    footerBottom: "© 2026 CompStock Manager. สงวนลิขสิทธิ์.",
  },
  en: {
    pageTitle: "CompStock Manager - Product Inventory",
    addProductButton: "Add Product",
    sectionTitle: "Computer Parts Inventory",
    searchPlaceholder: "Search products... e.g. RAM, SSD, CPU",
    loadingText: "Loading products...",
    emptyTitle: "No products yet",
    emptyHelp: "Click \"Add Product\" to start adding items",
    modalTitle: "Add New Product",
    labelProductName: "Product Name",
    labelProductDesc: "Product Description",
    labelProductPrice: "Price (KIP)",
    labelProductImage: "Product Image",
    imageHelperText: "Add multiple photos. Use your camera or choose files.",
    addImageBtn: "Add Photo",
    actionCamera: "Take a New Photo",
    actionGallery: "Choose from Library",
    actionCancel: "Cancel",
    placeholderProductName: "e.g. RAM DDR4 16GB",
    placeholderProductDesc: "Specifications, notes or additional details",
    cancelButton: "Cancel",
    saveButton: "Save Product",
    editModalTitle: "Edit Product",
    countLabel: (count) => `${count} items`,
    noDescription: "No description",
    loadError: "Unable to load products: ",
    requireFields: "Please enter product name and price",
    saved: "Product saved successfully",
    saveError: "Error saving product: ",
    updateNoRows: "No product was updated or you don't have permission to edit it",
    confirmDelete: "Delete this product?",
    deleted: "Product deleted",
    deleteError: "Error deleting product: ",
    labelProductCategory: "Category",
    labelProductQty: "Quantity in stock",
    qtyLabel: "In stock:",
    outOfStock: "Out of stock",
    statTypesLabel: "Product types",
    statQuantityLabel: "Total quantity",
    statValueLabel: "Total stock value",
    statLowLabel: "Low stock",
    allCategories: "All categories",
    categorySidebarTitle: "Product Categories",
    stockButton: "Stock Summary",
    stockModalTitle: "Stock Summary",
    viewEditButton: "Edit",
    viewDeleteButton: "Delete",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortNameAsc: "Name: A to Z",
    deleteButton: "Delete",
    backButton: "Back",
    notFoundText: "Product not found. It may have been deleted.",
    topBarTagline: "Your one-stop computer parts supplier",
    heroEyebrow1: "CompStock Manager", heroTitle1: "Manage your computer inventory in one place", heroDesc1: "Add, edit, and track all your computer hardware in real time",
    heroEyebrow2: "Real-time stock", heroTitle2: "Stay ahead of low stock", heroDesc2: "Get notified when items run low, with a full summary of your stock value",
    heroEyebrow3: "Multiple photos", heroTitle3: "Snap or upload photos from your phone", heroDesc3: "Attach multiple photos per product, automatically compressed",
    footerDesc: "An easy-to-use, multilingual computer parts inventory system.",
    footerContactTitle: "Contact Us", footerFollowTitle: "Follow Us", footerAddress: "Vientiane, Laos",
    footerBottom: "© 2026 CompStock Manager. All rights reserved.",
  },
  zh: {
    pageTitle: "CompStock Manager - 产品库存",
    addProductButton: "添加产品",
    sectionTitle: "电脑配件库存",
    searchPlaceholder: "搜索产品... 如 RAM、SSD、CPU",
    loadingText: "正在加载商品...",
    emptyTitle: "暂无商品",
    emptyHelp: "点击\"添加产品\"开始添加商品",
    modalTitle: "添加新商品",
    labelProductName: "商品名称",
    labelProductDesc: "商品描述",
    labelProductPrice: "价格 (基普)",
    labelProductImage: "产品图片",
    imageHelperText: "可添加多张图片，使用手机摄像头或选择本地图片。",
    addImageBtn: "添加图片",
    actionCamera: "拍摄新照片",
    actionGallery: "从相册选择",
    actionCancel: "取消",
    placeholderProductName: "例如 RAM DDR4 16GB",
    placeholderProductDesc: "规格、备注或其他说明",
    cancelButton: "取消",
    saveButton: "保存商品",
    editModalTitle: "编辑商品",
    countLabel: (count) => `${count} 件`,
    noDescription: "暂无描述",
    loadError: "无法加载商品: ",
    requireFields: "请填写商品名称和价格",
    saved: "商品保存成功",
    saveError: "保存商品时出错: ",
    updateNoRows: "未更新任何商品，或您没有编辑权限",
    confirmDelete: "确认删除此商品？",
    deleted: "商品已删除",
    deleteError: "删除商品时出错: ",
    labelProductCategory: "分类",
    labelProductQty: "库存数量",
    qtyLabel: "库存:",
    outOfStock: "缺货",
    statTypesLabel: "商品种类",
    statQuantityLabel: "总数量",
    statValueLabel: "库存总价值",
    statLowLabel: "库存不足",
    allCategories: "所有分类",
    categorySidebarTitle: "商品分类",
    stockButton: "库存汇总",
    stockModalTitle: "库存汇总",
    viewEditButton: "编辑",
    viewDeleteButton: "删除",
    sortNewest: "最新",
    sortOldest: "最早",
    sortPriceAsc: "价格：低到高",
    sortPriceDesc: "价格：高到低",
    sortNameAsc: "名称：A到Z",
    deleteButton: "删除",
    backButton: "返回",
    notFoundText: "未找到该商品，可能已被删除",
    topBarTagline: "一站式电脑配件供应商",
    heroEyebrow1: "CompStock Manager", heroTitle1: "一站式管理您的电脑库存", heroDesc1: "实时添加、编辑和跟踪您的所有电脑配件",
    heroEyebrow2: "实时库存", heroTitle2: "提前掌握库存不足商品", heroDesc2: "库存不足自动提醒，并汇总库存总价值",
    heroEyebrow3: "多张图片", heroTitle3: "手机拍照或上传图片", heroDesc3: "每件商品可添加多张图片，并自动压缩",
    footerDesc: "简单易用、支持多语言的电脑配件库存管理系统。",
    footerContactTitle: "联系我们", footerFollowTitle: "关注我们", footerAddress: "老挝万象",
    footerBottom: "© 2026 CompStock Manager. 保留所有权利。",
  },
};

// ------------------- DOM Elements -------------------
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const productCount = document.getElementById("productCount");
const currentLangFlag = document.getElementById("currentLangFlag");
const currentLangCode = document.getElementById("currentLangCode");
const langOptionButtons = document.querySelectorAll(".lang-option");
const addProductButton = document.getElementById("addProductButton");
const stockButtonLabel = document.getElementById("stockButtonLabel");
const stockModalTitle = document.getElementById("stockModalTitle");
const loadingText = document.getElementById("loadingText");
const emptyTitle = document.getElementById("emptyTitle");
const emptyHelp = document.getElementById("emptyHelp");
const labelProductName = document.getElementById("labelProductName");
const labelProductDesc = document.getElementById("labelProductDesc");
const labelProductPrice = document.getElementById("labelProductPrice");
const labelProductImage = document.getElementById("labelProductImage");
const imageHelperText = document.getElementById("imageHelperText");
const sectionTitle = document.getElementById("sectionTitle");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const addProductForm = document.getElementById("addProductForm");
const addImageBtn = document.getElementById("addImageBtn");
const addImageBtnText = document.getElementById("addImageBtnText");
const productImageCameraInput = document.getElementById("productImageCamera");
const productImageGalleryInput = document.getElementById("productImageGallery");
const imageSourceModalEl = document.getElementById("imageSourceModal");
const imageSourceModal = new bootstrap.Modal(imageSourceModalEl);
const chooseCameraBtn = document.getElementById("chooseCameraBtn");
const chooseGalleryBtn = document.getElementById("chooseGalleryBtn");
const actionCameraText = document.getElementById("actionCameraText");
const actionGalleryText = document.getElementById("actionGalleryText");
const actionCancelText = document.getElementById("actionCancelText");
const imagePreviewWrap = document.getElementById("imagePreviewWrap");
const saveBtn = document.getElementById("saveBtn");
const saveBtnText = document.getElementById("saveBtnText");
const saveBtnSpinner = document.getElementById("saveBtnSpinner");
// ------------------- Full-page routing elements -------------------
const pageListEl = document.getElementById("page-list");
const pageFormEl = document.getElementById("page-form");
const pageViewEl = document.getElementById("page-view");
const formBackBtn = document.getElementById("formBackBtn");
const formBackLabel = document.getElementById("formBackLabel");
const formPageTitleText = document.getElementById("formPageTitleText");
const formPageTitleIcon = document.querySelector("#formPageTitle i");
const viewBackBtn = document.getElementById("viewBackBtn");
const viewBackLabel = document.getElementById("viewBackLabel");
const viewLoadingState = document.getElementById("viewLoadingState");
const viewLoadingText = document.getElementById("viewLoadingText");
const viewNotFoundState = document.getElementById("viewNotFoundState");
const viewNotFoundText = document.getElementById("viewNotFoundText");
const viewContent = document.getElementById("viewContent");
const viewProductTitle = document.getElementById("viewProductTitle");
const viewCarouselInner = document.getElementById("viewCarouselInner");
const viewThumbStrip = document.getElementById("viewThumbStrip");
const viewProductDesc = document.getElementById("viewProductDesc");
const viewProductPrice = document.getElementById("viewProductPrice");
const viewProductDate = document.getElementById("viewProductDate");
const viewProductCategory = document.getElementById("viewProductCategory");
const viewProductQtyBadge = document.getElementById("viewProductQtyBadge");
const viewEditBtn = document.getElementById("viewEditBtn");
const viewEditBtnText = document.getElementById("viewEditBtnText");
const viewDeleteBtn = document.getElementById("viewDeleteBtn");
const viewDeleteBtnText = document.getElementById("viewDeleteBtnText");
let currentViewProduct = null;

const categoryFilterEl = document.getElementById("categoryFilter");
const sortSelectEl = document.getElementById("sortSelect");
const productCategorySelect = document.getElementById("productCategory");
const productQtyInput = document.getElementById("productQty");
const qtyMinusBtn = document.getElementById("qtyMinusBtn");
const qtyPlusBtn = document.getElementById("qtyPlusBtn");
const labelProductCategory = document.getElementById("labelProductCategory");
const labelProductQty = document.getElementById("labelProductQty");

const statTypes = document.getElementById("statTypes");
const statQuantity = document.getElementById("statQuantity");
const statValue = document.getElementById("statValue");
const statLow = document.getElementById("statLow");

const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
const confirmDeleteOkBtn = document.getElementById("confirmDeleteOkBtn");
let pendingDeleteProduct = null;

const LANG_META = {
  th: { flag: "🇹🇭", code: "TH" },
  en: { flag: "🇬🇧", code: "EN" },
  zh: { flag: "🇨🇳", code: "ZH" },
};

let currentLang = localStorage.getItem("appLanguage") || "th";
let currentEditId = null;
let existingImages = [];   // รูปเดิมที่ยังเก็บไว้ (ตอนแก้ไข)
let pendingFiles = [];     // ไฟล์ใหม่ที่เพิ่งเลือก ยังไม่อัปโหลด
let currentCategoryFilter = "";
let currentSort = "newest";

// ------------------- Custom dropdown หมวดหมู่ (MacBook พับเป็น accordion เลื่อนลง) -------------------
// selectEl ยังคงเก็บค่าจริงไว้เหมือนเดิม (ใช้ .value ที่อื่นในโค้ดได้ตามปกติ) แค่ซ่อนไว้และคุมด้วย custom UI ด้านบน
function setupCategoryDropdown({ selectEl, toggleEl, menuEl, isFilter }) {
  function labelFor(value) {
    if (!value) return translations[currentLang].allCategories;
    const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
    return labels[normalizeCategoryKey(value)] || value;
  }

  function syncToggleText() {
    toggleEl.textContent = labelFor(selectEl.value);
  }

  function closeMenu() {
    menuEl.classList.add("d-none");
  }

  function render() {
    const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
    const groups = CATEGORY_GROUPS[currentLang] || CATEGORY_GROUPS.th;
    let html = "";
    if (isFilter) {
      html += `<button type="button" class="category-item" data-value="">${translations[currentLang].allCategories}</button>`;
    }
    groups.forEach((group, gi) => {
      if (group.label) {
        const subId = `${menuEl.id}-group-${gi}`;
        html += `
          <div class="category-group">
            <button type="button" class="category-item category-group-toggle" data-collapse-target="${subId}">
              <span>${group.label}</span><i class="bi bi-chevron-down category-chevron"></i>
            </button>
            <div class="category-submenu collapse" id="${subId}">
              ${group.keys.map((k) => `<button type="button" class="category-item category-subitem" data-value="${k}">${labels[k]}</button>`).join("")}
            </div>
          </div>`;
      } else {
        html += group.keys.map((k) => `<button type="button" class="category-item" data-value="${k}">${labels[k]}</button>`).join("");
      }
    });
    menuEl.innerHTML = html;

    // ยังคงเติม <option> ในตัว select ที่ซ่อนไว้ เพราะ .value ของ select จะเซ็ตได้ก็ต่อเมื่อมี option ตรงกันอยู่จริง
    const optionsHtml = groups.map((g) => g.keys.map((k) => `<option value="${k}">${labels[k]}</option>`).join("")).join("");
    selectEl.innerHTML = isFilter ? `<option value="">${translations[currentLang].allCategories}</option>${optionsHtml}` : optionsHtml;

    // เปิด/ปิดกลุ่ม MacBook แบบสไลด์ (ใช้ Bootstrap Collapse ที่โหลดมาอยู่แล้ว)
    menuEl.querySelectorAll(".category-group-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetEl = document.getElementById(btn.getAttribute("data-collapse-target"));
        const collapseInstance = bootstrap.Collapse.getOrCreateInstance(targetEl, { toggle: false });
        collapseInstance.toggle();
        btn.classList.toggle("open");
      });
    });

    // เลือกหมวดหมู่
    menuEl.querySelectorAll(".category-item[data-value]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectEl.value = btn.getAttribute("data-value");
        syncToggleText();
        closeMenu();
        selectEl.dispatchEvent(new Event("change"));
      });
    });
  }

  toggleEl.addEventListener("click", (e) => {
    e.stopPropagation();
    menuEl.classList.toggle("d-none");
  });
  menuEl.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", closeMenu);

  render();
  syncToggleText();

  return { render, syncToggleText };
}

const productCategoryToggle = document.getElementById("productCategoryToggle");
const productCategoryMenu = document.getElementById("productCategoryMenu");
const categoryFilterToggle = document.getElementById("categoryFilterToggle");
const categoryFilterMenu = document.getElementById("categoryFilterMenu");

const productCategoryDropdownCtl = setupCategoryDropdown({
  selectEl: productCategorySelect, toggleEl: productCategoryToggle, menuEl: productCategoryMenu, isFilter: false,
});
const categoryFilterDropdownCtl = setupCategoryDropdown({
  selectEl: categoryFilterEl, toggleEl: categoryFilterToggle, menuEl: categoryFilterMenu, isFilter: true,
});

// เปลี่ยนค่าหมวดหมู่จากโค้ด (เช่น ตอนรีเซ็ตฟอร์ม/แก้ไขสินค้า) แล้วให้ปุ่ม toggle อัปเดตข้อความตามด้วย
function setProductCategoryValue(value) {
  productCategorySelect.value = value;
  productCategoryDropdownCtl.syncToggleText();
}

// ------------------- Category quick-nav pills (storefront style, in navbar) -------------------
// รายการหมวดหมู่ "ส่วนประกอบคอมพิวเตอร์" ถูกยุบรวมเป็นปุ่มเดียว กดแล้วมีเมนูย่อยให้เลือก
// เช่นเดียวกับ MacBook ที่พับเป็นปุ่มเดียวแล้วกดเลือกรุ่นปีย่อยได้ ช่วยให้แถบหมวดหมู่ไม่ยาวเกินไปบนมือถือ/iPad
const QUICK_NAV_ITEMS = [
  { type: "group", id: "components", icon: "bi-cpu-fill", labelKey: "componentsGroup", keys: COMPONENT_CATEGORY_KEYS },
  { type: "single", key: "all_in_one" },
  { type: "single", key: "comset" },
  { type: "single", key: "notebook" },
  { type: "group", id: "macbook", icon: "bi-apple", labelKey: "macbookGroup", keys: MACBOOK_YEAR_KEYS },
  { type: "single", key: "mouse" },
  { type: "single", key: "keyboard" },
  { type: "single", key: "mousepad" },
  { type: "single", key: "audio" },
  { type: "single", key: "peripheral" },
  { type: "single", key: "other" },
];
const QUICK_NAV_GROUP_LABELS = {
  th: { componentsGroup: "ส่วนประกอบคอมพิวเตอร์", macbookGroup: "MacBook" },
  en: { componentsGroup: "Computer Components", macbookGroup: "MacBook" },
  zh: { componentsGroup: "电脑配件", macbookGroup: "MacBook" },
};
const CATEGORY_ICONS = {
  ram: "bi-memory", ssd: "bi-device-ssd", hdd: "bi-hdd", cpu: "bi-cpu",
  motherboard: "bi-motherboard", gpu: "bi-gpu-card", psu: "bi-plug-fill",
  case: "bi-pc-display-horizontal", monitor: "bi-display", all_in_one: "bi-pc-display",
  comset: "bi-boxes", notebook: "bi-laptop",
  mouse: "bi-mouse2-fill", keyboard: "bi-keyboard-fill", mousepad: "bi-square",
  audio: "bi-headphones", peripheral: "bi-usb-plug", other: "bi-three-dots",
};

let openQuickNavGroupId = null;

function closeQuickNavSubmenu() {
  openQuickNavGroupId = null;
  const panel = document.getElementById("quickNavSubmenuPanel");
  if (panel) panel.classList.add("d-none");
  document.querySelectorAll(".quick-nav-pill.open").forEach((b) => b.classList.remove("open"));
}

function positionQuickNavSubmenu(panel, anchorBtn) {
  panel.style.visibility = "hidden";
  panel.classList.remove("d-none");
  const anchorRect = anchorBtn.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const margin = 8;
  let left = anchorRect.left;
  const maxLeft = window.innerWidth - panelRect.width - margin;
  left = Math.max(margin, Math.min(left, maxLeft));
  let top = anchorRect.bottom + margin;
  const maxTop = window.innerHeight - panelRect.height - margin;
  if (top > maxTop && anchorRect.top - panelRect.height - margin > margin) {
    top = anchorRect.top - panelRect.height - margin; // ถ้าล้นด้านล่างจอ ให้เปิดขึ้นด้านบนปุ่มแทน
  }
  panel.style.left = `${left}px`;
  panel.style.top = `${Math.max(margin, top)}px`;
  panel.style.visibility = "visible";
}

function openQuickNavSubmenu(item, anchorBtn) {
  const panel = document.getElementById("quickNavSubmenuPanel");
  if (!panel) return;
  const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
  openQuickNavGroupId = item.id;
  document.querySelectorAll(".quick-nav-pill.open").forEach((b) => b.classList.remove("open"));
  anchorBtn.classList.add("open");

  panel.innerHTML = item.keys.map((k) => `
    <button type="button" class="quick-nav-submenu-item${currentCategoryFilter === k ? " active" : ""}" data-value="${k}">
      <i class="bi ${CATEGORY_ICONS[k] || "bi-tag"}"></i><span>${labels[k]}</span>
    </button>`).join("");

  panel.querySelectorAll(".quick-nav-submenu-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = btn.getAttribute("data-value");
      currentCategoryFilter = value;
      categoryFilterEl.value = value;
      categoryFilterDropdownCtl.syncToggleText();
      applyProductFilter();
      closeQuickNavSubmenu();
      renderCategoryQuickNav();
      document.getElementById("productGridSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  requestAnimationFrame(() => positionQuickNavSubmenu(panel, anchorBtn));
}

function renderCategoryQuickNav() {
  const wrap = document.getElementById("categoryQuickNav");
  if (!wrap) return;
  const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
  const groupLabels = QUICK_NAV_GROUP_LABELS[currentLang] || QUICK_NAV_GROUP_LABELS.th;

  let html = `<button type="button" class="quick-nav-pill${!currentCategoryFilter ? " active" : ""}" data-value="">
      <i class="bi bi-grid-3x3-gap-fill"></i><span>${translations[currentLang].allCategories}</span>
    </button>`;

  QUICK_NAV_ITEMS.forEach((item) => {
    if (item.type === "single") {
      const k = item.key;
      html += `<button type="button" class="quick-nav-pill${currentCategoryFilter === k ? " active" : ""}" data-value="${k}">
        <i class="bi ${CATEGORY_ICONS[k] || "bi-tag"}"></i><span>${labels[k]}</span>
      </button>`;
    } else {
      const isActiveGroup = item.keys.includes(currentCategoryFilter);
      const pillLabel = isActiveGroup ? (labels[currentCategoryFilter] || groupLabels[item.labelKey]) : groupLabels[item.labelKey];
      html += `<button type="button" class="quick-nav-pill quick-nav-pill-group${isActiveGroup ? " active" : ""}" data-group-id="${item.id}">
        <i class="bi ${item.icon}"></i><span>${pillLabel}</span><i class="bi bi-chevron-down quick-nav-caret"></i>
      </button>`;
    }
  });
  wrap.innerHTML = html;

  wrap.querySelectorAll(".quick-nav-pill[data-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeQuickNavSubmenu();
      const value = btn.getAttribute("data-value");
      currentCategoryFilter = value;
      categoryFilterEl.value = value;
      categoryFilterDropdownCtl.syncToggleText();
      applyProductFilter();
      renderCategoryQuickNav();
      document.getElementById("productGridSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  wrap.querySelectorAll(".quick-nav-pill-group").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const groupId = btn.getAttribute("data-group-id");
      const item = QUICK_NAV_ITEMS.find((it) => it.type === "group" && it.id === groupId);
      if (openQuickNavGroupId === groupId) {
        closeQuickNavSubmenu();
      } else if (item) {
        openQuickNavSubmenu(item, btn);
      }
    });
  });
}

// ------------------- Category sidebar (แถบด้านซ้าย แสดงหมวดหมู่สินค้าแบบละเอียด พร้อมจำนวนสินค้าต่อหมวด) -------------------
let sidebarOpenGroupIds = new Set(); // ปิดทุกกลุ่มไว้เป็นค่าเริ่มต้นตอนโหลด/รีเซ็ตหน้าเว็บ ผู้ใช้กดเปิดเองทีหลัง

function countByCategoryKeys(keys) {
  return allProducts.filter((p) => keys.includes(normalizeCategoryKey(p.category || ""))).length;
}

function renderCategorySidebar() {
  const body = document.getElementById("categorySidebarBody");
  if (!body) return;
  const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
  const groupLabels = QUICK_NAV_GROUP_LABELS[currentLang] || QUICK_NAV_GROUP_LABELS.th;

  let html = `<button type="button" class="category-sidebar-item${!currentCategoryFilter ? " active" : ""}" data-value="">
      <span><i class="bi bi-grid-3x3-gap-fill"></i>${translations[currentLang].allCategories}</span>
      <span class="category-sidebar-count">${allProducts.length}</span>
    </button>`;

  QUICK_NAV_ITEMS.forEach((item) => {
    if (item.type === "single") {
      const k = item.key;
      html += `<button type="button" class="category-sidebar-item${currentCategoryFilter === k ? " active" : ""}" data-value="${k}">
        <span><i class="bi ${CATEGORY_ICONS[k] || "bi-tag"}"></i>${labels[k]}</span>
        <span class="category-sidebar-count">${countByCategoryKeys([k])}</span>
      </button>`;
    } else {
      const isOpen = sidebarOpenGroupIds.has(item.id);
      const isActiveGroup = item.keys.includes(currentCategoryFilter);
      html += `
        <div class="category-sidebar-group">
          <button type="button" class="category-sidebar-item category-sidebar-group-toggle${isActiveGroup ? " active" : ""}" data-sidebar-group="${item.id}">
            <span><i class="bi ${item.icon}"></i>${groupLabels[item.labelKey]}</span>
            <span class="category-sidebar-count">${countByCategoryKeys(item.keys)}<i class="bi bi-chevron-down category-chevron${isOpen ? " open-rotate" : ""}"></i></span>
          </button>
          <div class="category-sidebar-submenu${isOpen ? "" : " d-none"}" id="sidebarGroup-${item.id}">
            ${item.keys.map((k) => `
              <button type="button" class="category-sidebar-item category-sidebar-subitem${currentCategoryFilter === k ? " active" : ""}" data-value="${k}">
                <span><i class="bi ${CATEGORY_ICONS[k] || "bi-tag"}"></i>${labels[k]}</span>
                <span class="category-sidebar-count">${countByCategoryKeys([k])}</span>
              </button>`).join("")}
          </div>
        </div>`;
    }
  });
  body.innerHTML = html;

  body.querySelectorAll(".category-sidebar-item[data-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-value");
      currentCategoryFilter = value;
      categoryFilterEl.value = value;
      categoryFilterDropdownCtl.syncToggleText();
      applyProductFilter();
      renderCategoryQuickNav();
      document.getElementById("productGridSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  body.querySelectorAll(".category-sidebar-group-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const groupId = btn.getAttribute("data-sidebar-group");
      if (sidebarOpenGroupIds.has(groupId)) sidebarOpenGroupIds.delete(groupId);
      else sidebarOpenGroupIds.add(groupId);
      renderCategorySidebar();
    });
  });
}

// ย่อ/ขยายแถบหมวดหมู่ด้านซ้ายทั้งแถบบนมือถือ/แท็บเล็ต (บนจอใหญ่แสดงตลอดอยู่แล้ว)
const categorySidebarToggle = document.getElementById("categorySidebarToggle");
const categorySidebarEl = document.getElementById("categorySidebar");
categorySidebarToggle?.addEventListener("click", () => {
  categorySidebarEl.classList.toggle("mobile-open");
  categorySidebarToggle.classList.toggle("open");
});

// ปิดเมนูย่อยเมื่อคลิกที่อื่น เลื่อนหน้าเว็บ หรือย่อ/ขยายหน้าต่าง
// หมายเหตุ: ใช้ listener แบบ bubble (ไม่ใช่ capture) บน window เพื่อจับเฉพาะ "การเลื่อนหน้าเว็บจริง" เท่านั้น
// ถ้าใช้ capture:true มันจะไปจับ scroll event ของแถบหมวดหมู่ที่เลื่อนแนวนอนได้ (.category-nav-scroll) ด้วย
// ทำให้เมนูปิดตัวเองทันทีหลังเปิด (แค่แตะปุ่มก็ทำให้แถบเลื่อนขยับเล็กน้อยแล้ว) นี่คือสาเหตุของบั๊ก "กดแล้วเมนูหาย"
document.addEventListener("click", (e) => {
  const panel = document.getElementById("quickNavSubmenuPanel");
  if (panel && !panel.classList.contains("d-none") && !panel.contains(e.target)) closeQuickNavSubmenu();
});
window.addEventListener("scroll", () => closeQuickNavSubmenu());
window.addEventListener("resize", () => closeQuickNavSubmenu());

function populateCategoryOptions() {
  const prevProductCat = productCategorySelect.value;
  const prevFilterCat = categoryFilterEl.value;

  productCategoryDropdownCtl.render();
  categoryFilterDropdownCtl.render();

  if (CATEGORY_KEYS.includes(prevProductCat)) productCategorySelect.value = prevProductCat;
  if (CATEGORY_KEYS.includes(prevFilterCat)) categoryFilterEl.value = prevFilterCat;
  productCategoryDropdownCtl.syncToggleText();
  categoryFilterDropdownCtl.syncToggleText();
}
populateCategoryOptions();
renderCategoryQuickNav();
renderCategorySidebar();

categoryFilterEl.addEventListener("change", (e) => {
  currentCategoryFilter = e.target.value;
  applyProductFilter();
  renderCategoryQuickNav();
});

sortSelectEl.addEventListener("change", (e) => {
  currentSort = e.target.value;
  applyProductFilter();
});

qtyMinusBtn.addEventListener("click", () => {
  const val = Math.max(0, (parseInt(productQtyInput.value, 10) || 0) - 1);
  productQtyInput.value = val;
});
qtyPlusBtn.addEventListener("click", () => {
  const val = (parseInt(productQtyInput.value, 10) || 0) + 1;
  productQtyInput.value = val;
});

function setProductCount(count) {
  productCount.textContent = translations[currentLang].countLabel(count);
}

function setLanguage(lang) {
  if (!translations[lang]) lang = "th";
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = translations[lang].pageTitle;
  addProductButton.innerHTML = `<i class="bi bi-plus-lg"></i> <span class="btn-label-text">${translations[lang].addProductButton}</span>`;
  sectionTitle.innerHTML = `<i class="bi bi-box-seam"></i> ${translations[lang].sectionTitle}`;
  searchInput.placeholder = translations[lang].searchPlaceholder;
  loadingText.textContent = translations[lang].loadingText;
  emptyTitle.textContent = translations[lang].emptyTitle;
  emptyHelp.textContent = translations[lang].emptyHelp;
  formPageTitleText.textContent = currentEditId ? translations[lang].editModalTitle : translations[lang].modalTitle;
  formPageTitleIcon.className = currentEditId ? "bi bi-pencil-square" : "bi bi-plus-circle";
  formBackLabel.textContent = translations[lang].backButton;
  viewBackLabel.textContent = translations[lang].backButton;
  viewLoadingText.textContent = translations[lang].loadingText;
  viewNotFoundText.textContent = translations[lang].notFoundText;
  labelProductName.innerHTML = `${translations[lang].labelProductName} <span class="text-danger">*</span>`;
  labelProductDesc.textContent = translations[lang].labelProductDesc;
  labelProductPrice.innerHTML = `${translations[lang].labelProductPrice} <span class="text-danger">*</span>`;
  labelProductImage.textContent = translations[lang].labelProductImage;
  imageHelperText.textContent = translations[lang].imageHelperText;
  addImageBtnText.textContent = translations[lang].addImageBtn;
  actionCameraText.textContent = translations[lang].actionCamera;
  actionGalleryText.textContent = translations[lang].actionGallery;
  actionCancelText.textContent = translations[lang].actionCancel;
  labelProductCategory.textContent = translations[lang].labelProductCategory;
  labelProductQty.textContent = translations[lang].labelProductQty;
  populateCategoryOptions();
  renderCategoryQuickNav();
  renderCategorySidebar();
  const categorySidebarTitleEl = document.getElementById("categorySidebarTitle");
  const categorySidebarToggleLabelEl = document.getElementById("categorySidebarToggleLabel");
  if (categorySidebarTitleEl) categorySidebarTitleEl.textContent = translations[lang].categorySidebarTitle;
  if (categorySidebarToggleLabelEl) categorySidebarToggleLabelEl.textContent = translations[lang].categorySidebarTitle;
  const topBarTagline = document.getElementById("topBarTagline");
  if (topBarTagline) topBarTagline.textContent = translations[lang].topBarTagline;
  ["1", "2", "3"].forEach((n) => {
    const eyebrow = document.getElementById(`heroEyebrow${n}`);
    const title = document.getElementById(`heroTitle${n}`);
    const desc = document.getElementById(`heroDesc${n}`);
    if (eyebrow) eyebrow.textContent = translations[lang][`heroEyebrow${n}`];
    if (title) title.textContent = translations[lang][`heroTitle${n}`];
    if (desc) desc.textContent = translations[lang][`heroDesc${n}`];
  });
  const footerDesc = document.getElementById("footerDesc");
  const footerContactTitle = document.getElementById("footerContactTitle");
  const footerFollowTitle = document.getElementById("footerFollowTitle");
  const footerAddress = document.getElementById("footerAddress");
  const footerBottom = document.getElementById("footerBottom");
  if (footerDesc) footerDesc.textContent = translations[lang].footerDesc;
  if (footerContactTitle) footerContactTitle.textContent = translations[lang].footerContactTitle;
  if (footerFollowTitle) footerFollowTitle.textContent = translations[lang].footerFollowTitle;
  if (footerAddress) footerAddress.textContent = translations[lang].footerAddress;
  if (footerBottom) footerBottom.textContent = translations[lang].footerBottom;
  const sortNewestOpt = document.querySelector('#sortSelect option[value="newest"]');
  const sortOldestOpt = document.querySelector('#sortSelect option[value="oldest"]');
  const sortPriceAscOpt = document.querySelector('#sortSelect option[value="price_asc"]');
  const sortPriceDescOpt = document.querySelector('#sortSelect option[value="price_desc"]');
  const sortNameAscOpt = document.querySelector('#sortSelect option[value="name_asc"]');
  if (sortNewestOpt) sortNewestOpt.textContent = translations[lang].sortNewest;
  if (sortOldestOpt) sortOldestOpt.textContent = translations[lang].sortOldest;
  if (sortPriceAscOpt) sortPriceAscOpt.textContent = translations[lang].sortPriceAsc;
  if (sortPriceDescOpt) sortPriceDescOpt.textContent = translations[lang].sortPriceDesc;
  if (sortNameAscOpt) sortNameAscOpt.textContent = translations[lang].sortNameAsc;
  document.getElementById("statTypesLabel").textContent = translations[lang].statTypesLabel;
  document.getElementById("statQuantityLabel").textContent = translations[lang].statQuantityLabel;
  document.getElementById("statValueLabel").textContent = translations[lang].statValueLabel;
  document.getElementById("statLowLabel").textContent = translations[lang].statLowLabel;
  stockButtonLabel.textContent = translations[lang].stockButton;
  stockModalTitle.innerHTML = `<i class="bi bi-clipboard-data"></i> ${translations[lang].stockModalTitle}`;
  viewEditBtnText.textContent = translations[lang].viewEditButton;
  viewDeleteBtnText.textContent = translations[lang].viewDeleteButton;
  document.getElementById("cancelBtn").textContent = translations[lang].cancelButton;
  document.getElementById("confirmDeleteCancelBtn").textContent = translations[lang].cancelButton;
  document.getElementById("confirmDeleteOkBtn").textContent = translations[lang].deleteButton;
  document.getElementById("productName").placeholder = translations[lang].placeholderProductName;
  document.getElementById("productDesc").placeholder = translations[lang].placeholderProductDesc;
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[lang].saveButton}`;
  const meta = LANG_META[lang] || LANG_META.th;
  currentLangFlag.textContent = meta.flag;
  currentLangCode.textContent = meta.code;
  langOptionButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  localStorage.setItem("appLanguage", lang);
  applyProductFilter();
}

langOptionButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

setLanguage(currentLang);

// ------------------- Utility: Toast -------------------
function showToast(message, type = "success") {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("appToastBody");
  toastEl.classList.remove("bg-success", "bg-danger");
  toastEl.classList.add(type === "success" ? "bg-success" : "bg-danger");
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// ------------------- Utility: Format Price -------------------
function formatPrice(price) {
  return "₭" + Number(price).toLocaleString("lo-LA", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ------------------- Utility: Format Date -------------------
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

// ------------------- บีบอัดรูปก่อนอัปโหลด (ลดขนาดไฟล์) -------------------
function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      resolve(file);
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// ------------------- ฟังก์ชันอัปโหลดรูปไป Supabase Storage (หลายไฟล์) -------------------
async function uploadProductImage(file) {
  if (!file) return null;

  const compressed = await compressImage(file);
  const fileExt = compressed.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() || "jpg");
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(fileName, compressed, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

async function uploadMultipleImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadProductImage(file);
    if (url) urls.push(url);
  }
  return urls;
}

// ------------------- Image Preview (หลายรูป) -------------------
function renderImagePreviews() {
  imagePreviewWrap.innerHTML = "";

  existingImages.forEach((url, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    thumb.innerHTML = `
      <img src="${url}" alt="preview">
      <button type="button" class="remove-thumb-btn" data-type="existing" data-index="${idx}">
        <i class="bi bi-x"></i>
      </button>
    `;
    imagePreviewWrap.appendChild(thumb);
  });

  pendingFiles.forEach((file, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.readAsDataURL(file);
    thumb.appendChild(img);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove-thumb-btn";
    btn.dataset.type = "pending";
    btn.dataset.index = idx;
    btn.innerHTML = `<i class="bi bi-x"></i>`;
    thumb.appendChild(btn);
    imagePreviewWrap.appendChild(thumb);
  });

  imagePreviewWrap.querySelectorAll(".remove-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      if (btn.dataset.type === "existing") {
        existingImages.splice(idx, 1);
      } else {
        pendingFiles.splice(idx, 1);
      }
      renderImagePreviews();
    });
  });
}

// เปิด Action Sheet ให้ผู้ใช้เลือกว่าจะถ่ายภาพใหม่ หรือเลือกจากคลังภาพที่มีอยู่แล้ว
addImageBtn.addEventListener("click", () => {
  imageSourceModal.show();
});

chooseCameraBtn.addEventListener("click", () => {
  imageSourceModal.hide();
  productImageCameraInput.click();
});

chooseGalleryBtn.addEventListener("click", () => {
  imageSourceModal.hide();
  productImageGalleryInput.click();
});

function handleSelectedImageFiles(inputEl) {
  const files = Array.from(inputEl.files || []);
  pendingFiles = pendingFiles.concat(files);
  inputEl.value = "";
  renderImagePreviews();
}

productImageCameraInput.addEventListener("change", () => handleSelectedImageFiles(productImageCameraInput));
productImageGalleryInput.addEventListener("change", () => handleSelectedImageFiles(productImageGalleryInput));

// ------------------- ฟังก์ชันลบรูปจาก Supabase Storage -------------------
async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split(`${BUCKET_NAME}/`);
    if (parts.length < 2) return;
    const filePath = parts[1];
    await supabaseClient.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (err) {
    console.error("Delete image error:", err);
  }
}

async function deleteProductImages(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return;
  for (const url of imageUrls) {
    await deleteProductImage(url);
  }
}

/* ============================================================
   ส่วนที่ 3: ระบบ CRUD (Fetch / Insert / Delete)
   ============================================================ */

// ------------------- Skeleton loading placeholders -------------------
function renderSkeletonGrid(count = 8) {
  productGrid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-6 col-md-4 col-xl-3";
    col.innerHTML = `
      <div class="card product-card skeleton-card h-100">
        <div class="product-img-wrap skeleton-shimmer"></div>
        <div class="card-body d-flex flex-column">
          <div class="skeleton-line skeleton-shimmer" style="width:38%;height:14px;margin-bottom:12px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:80%;height:16px;margin-bottom:8px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:100%;height:12px;margin-bottom:6px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:55%;height:12px;margin-bottom:14px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width:45%;height:16px;"></div>
        </div>
      </div>
    `;
    productGrid.appendChild(col);
  }
}

// ------------------- Fetch รายการสินค้าทั้งหมด -------------------
async function fetchProducts() {
  renderSkeletonGrid();
  emptyState.classList.add("d-none");

  const { data, error } = await supabaseClient
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    productGrid.innerHTML = "";
    showToast(translations[currentLang].loadError + error.message, "danger");
    return;
  }

  if (!data || data.length === 0) {
    allProducts = [];
    productGrid.innerHTML = "";
    emptyState.classList.remove("d-none");
    setProductCount(0);
    updateDashboardStats();
    return;
  }

  allProducts = data;
  applyProductFilter();
}

function applyProductFilter() {
  const query = searchInput?.value.trim().toLowerCase() || "";

  let filtered = query
    ? allProducts.filter((item) => {
        const text = `${item.name || ""} ${item.description || ""}`.toLowerCase();
        return text.includes(query);
      })
    : [...allProducts];

  if (currentCategoryFilter) {
    filtered = filtered.filter((item) => normalizeCategoryKey(item.category || "") === currentCategoryFilter);
  }

  filtered.sort((a, b) => {
    switch (currentSort) {
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "price_asc":
        return (a.price || 0) - (b.price || 0);
      case "price_desc":
        return (b.price || 0) - (a.price || 0);
      case "name_asc":
        return (a.name || "").localeCompare(b.name || "", "th");
      case "newest":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  setProductCount(filtered.length);
  renderProducts(filtered);
  updateDashboardStats();
  renderCategorySidebar();
}

function updateDashboardStats() {
  const totalTypes = allProducts.length;
  const totalQty = allProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalValue = allProducts.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);
  const lowStockCount = allProducts.filter((p) => (Number(p.quantity) || 0) <= LOW_STOCK_THRESHOLD).length;

  statTypes.textContent = totalTypes;
  statQuantity.textContent = totalQty.toLocaleString("lo-LA");
  statValue.textContent = formatPrice(totalValue);
  statLow.textContent = lowStockCount;
}

searchInput?.addEventListener("input", applyProductFilter);

// ------------------- Render สินค้าเป็น Card -------------------
async function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach((p, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-6 col-md-4 col-xl-3 product-card-col";
    col.style.animationDelay = `${Math.min(index, 12) * 0.04}s`;

    const thumbUrl = (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : p.image_url;
    const imageHtml = thumbUrl
      ? `<img src="${thumbUrl}" alt="${escapeHtml(p.name)}">`
      : `<i class="bi bi-image"></i>`;
    const imageCountBadge = (Array.isArray(p.images) && p.images.length > 1)
      ? `<span class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75"><i class="bi bi-images"></i> ${p.images.length}</span>`
      : "";

    const qty = Number(p.quantity) || 0;
    const qtyClass = qty <= 0 ? "qty-out" : (qty <= LOW_STOCK_THRESHOLD ? "qty-low" : "qty-ok");
    const qtyText = qty <= 0 ? translations[currentLang].outOfStock : `${translations[currentLang].qtyLabel} ${qty}`;
    const categoryBadge = p.category ? `<span class="category-badge">${escapeHtml(getCategoryLabel(p.category, currentLang))}</span>` : "";

    col.innerHTML = `
      <div class="card product-card h-100" data-id="${p.id}">
        <div class="product-img-wrap position-relative">${imageHtml}${imageCountBadge}</div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
            ${categoryBadge}
            <span class="qty-badge ${qtyClass}">${qtyText}</span>
          </div>
          <h6 class="card-title-custom mb-1">${escapeHtml(p.name)}</h6>
          <p class="card-desc mb-2">${escapeHtml(p.description || translations[currentLang].noDescription)}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="price-badge">${formatPrice(p.price)}</span>
          </div>
          <div class="card-date mt-2"><i class="bi bi-clock-history"></i> ${formatDate(p.created_at)}</div>
        </div>
      </div>
    `;
    productGrid.appendChild(col);
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      navigateTo(`/products/${encodeURIComponent(card.dataset.id)}`);
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   ส่วนที่ 4: Full-page Router (Add Product / Product Details)
   ใช้ hash-based routing แทน Modal/Popup เดิม:
   #/                     -> หน้ารายการสินค้า
   #/products/add         -> หน้าเพิ่มสินค้าใหม่ (เต็มหน้า)
   #/products/edit/:id    -> หน้าแก้ไขสินค้า (เต็มหน้า, ใช้ฟอร์มเดียวกับเพิ่มสินค้า)
   #/products/:id         -> หน้ารายละเอียดสินค้า (เต็มหน้า)
   ============================================================ */

function navigateTo(path) {
  location.hash = `#${path}`;
}

function parseRoute() {
  const hash = (location.hash || "").replace(/^#/, "");
  if (!hash || hash === "/") return { name: "list" };

  let m = hash.match(/^\/products\/add\/?$/);
  if (m) return { name: "add" };

  m = hash.match(/^\/products\/edit\/([^/]+)\/?$/);
  if (m) return { name: "edit", id: decodeURIComponent(m[1]) };

  m = hash.match(/^\/products\/([^/]+)\/?$/);
  if (m) return { name: "view", id: decodeURIComponent(m[1]) };

  return { name: "list" };
}

function showOnlyPage(name) {
  pageListEl.classList.toggle("d-none", name !== "list");
  pageFormEl.classList.toggle("d-none", name !== "add" && name !== "edit");
  pageViewEl.classList.toggle("d-none", name !== "view");
  window.scrollTo(0, 0);
}

async function router() {
  const route = parseRoute();

  if (route.name === "list") {
    showOnlyPage("list");
    return;
  }

  if (route.name === "add") {
    resetProductForm();
    showOnlyPage("add");
    return;
  }

  if (route.name === "edit") {
    showOnlyPage("edit");
    const product = await resolveProductById(route.id);
    if (product) {
      fillProductForm(product);
    } else {
      // หาสินค้าไม่เจอ กลับไปหน้ารายการ
      navigateTo("/");
    }
    return;
  }

  if (route.name === "view") {
    showOnlyPage("view");
    await renderViewPage(route.id);
    return;
  }
}

window.addEventListener("hashchange", router);

// ------------------- หน้ารายละเอียดสินค้า (Product Details) -------------------
async function resolveProductById(id) {
  const cached = allProducts.find((item) => item.id.toString() === String(id));
  if (cached) return cached;

  const matchValue = /^\d+$/.test(id) ? Number(id) : id;
  const { data, error } = await supabaseClient
    .from(TABLE_NAME)
    .select("*")
    .eq("id", matchValue)
    .single();

  if (error || !data) return null;
  return data;
}

async function renderViewPage(id) {
  currentViewProduct = null;
  viewContent.classList.add("d-none");
  viewNotFoundState.classList.add("d-none");
  viewLoadingState.classList.remove("d-none");

  const product = await resolveProductById(id);

  viewLoadingState.classList.add("d-none");

  if (!product) {
    viewNotFoundState.classList.remove("d-none");
    return;
  }

  currentViewProduct = product;

  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : []);

  const qty = Number(product.quantity) || 0;
  const qtyClass = qty <= 0 ? "qty-out" : (qty <= LOW_STOCK_THRESHOLD ? "qty-low" : "qty-ok");
  const qtyText = qty <= 0 ? translations[currentLang].outOfStock : `${translations[currentLang].qtyLabel} ${qty}`;

  viewProductCategory.textContent = product.category ? getCategoryLabel(product.category, currentLang) : "";
  viewProductCategory.classList.toggle("d-none", !product.category);
  viewProductQtyBadge.textContent = qtyText;
  viewProductQtyBadge.className = `qty-badge ${qtyClass}`;

  viewProductTitle.textContent = product.name || "";
  viewProductPrice.textContent = formatPrice(product.price);
  viewProductDesc.textContent = product.description || translations[currentLang].noDescription;
  viewProductDate.innerHTML = `<i class="bi bi-clock-history"></i> ${formatDate(product.created_at)}`;

  viewCarouselInner.innerHTML = "";
  viewThumbStrip.innerHTML = "";
  if (images.length === 0) {
    viewCarouselInner.innerHTML = `
      <div class="carousel-item active">
        <div class="carousel-img-wrap"><i class="bi bi-image"></i></div>
      </div>
    `;
  } else {
    images.forEach((url, idx) => {
      const item = document.createElement("div");
      item.className = `carousel-item${idx === 0 ? " active" : ""}`;
      item.innerHTML = `<div class="carousel-img-wrap"><img src="${url}" alt="${escapeHtml(product.name)}"></div>`;
      viewCarouselInner.appendChild(item);

      if (images.length > 1) {
        const thumb = document.createElement("img");
        thumb.src = url;
        thumb.alt = escapeHtml(product.name);
        thumb.className = idx === 0 ? "active" : "";
        thumb.addEventListener("click", () => {
          const carousel = bootstrap.Carousel.getOrCreateInstance(document.getElementById("viewProductCarousel"));
          carousel.to(idx);
        });
        viewThumbStrip.appendChild(thumb);
      }
    });
  }

  viewContent.classList.remove("d-none");
}

// ซิงค์ thumbnail ที่ active ตามรูปที่กำลังแสดงใน carousel
document.getElementById("viewProductCarousel")?.addEventListener("slide.bs.carousel", (e) => {
  viewThumbStrip.querySelectorAll("img").forEach((img, idx) => {
    img.classList.toggle("active", idx === e.to);
  });
});

viewEditBtn.addEventListener("click", () => {
  if (!currentViewProduct) return;
  navigateTo(`/products/edit/${encodeURIComponent(currentViewProduct.id)}`);
});

viewDeleteBtn.addEventListener("click", () => {
  if (!currentViewProduct) return;
  requestDelete(currentViewProduct);
});

// ------------------- หน้าเพิ่ม/แก้ไขสินค้า (Add / Edit Product) -------------------
function resetProductForm() {
  currentEditId = null;
  existingImages = [];
  pendingFiles = [];
  addProductForm.reset();
  renderImagePreviews();
  setProductCategoryValue(CATEGORY_KEYS[0]);
  productQtyInput.value = 1;
  formPageTitleText.textContent = translations[currentLang].modalTitle;
  formPageTitleIcon.className = "bi bi-plus-circle";
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[currentLang].saveButton}`;
}

function fillProductForm(product) {
  currentEditId = String(product.id);
  existingImages = (Array.isArray(product.images) && product.images.length > 0)
    ? [...product.images]
    : (product.image_url ? [product.image_url] : []);
  pendingFiles = [];

  document.getElementById("productName").value = product.name || "";
  document.getElementById("productDesc").value = product.description || "";
  document.getElementById("productPrice").value = product.price ?? "";
  setProductCategoryValue(normalizeCategoryKey(product.category) || CATEGORY_KEYS[CATEGORY_KEYS.length - 1]);
  productQtyInput.value = product.quantity ?? 1;
  renderImagePreviews();

  formPageTitleText.textContent = translations[currentLang].editModalTitle;
  formPageTitleIcon.className = "bi bi-pencil-square";
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[currentLang].saveButton}`;
}

// ปุ่มกลับของหน้าฟอร์ม / หน้ารายละเอียด และปุ่มยกเลิกในฟอร์ม
formBackBtn.addEventListener("click", () => history.length > 1 ? history.back() : navigateTo("/"));
viewBackBtn.addEventListener("click", () => history.length > 1 ? history.back() : navigateTo("/"));
document.getElementById("cancelBtn").addEventListener("click", () => {
  history.length > 1 ? history.back() : navigateTo("/");
});

// ------------------- Insert / Edit สินค้า -------------------
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const description = document.getElementById("productDesc").value.trim();
  const price = document.getElementById("productPrice").value;

  if (!name || !price) {
    showToast(translations[currentLang].requireFields, "danger");
    return;
  }

  setSaving(true);

  try {
    const uploadedUrls = await uploadMultipleImages(pendingFiles);
    const finalImages = existingImages.concat(uploadedUrls);

    const payload = {
      name,
      description,
      price: parseFloat(price),
      images: finalImages,
      image_url: finalImages[0] || null,
      category: productCategorySelect.value || null,
      quantity: parseInt(productQtyInput.value, 10) || 0,
    };

    let data;
    let error;

    if (currentEditId) {
      const matchValue = /^\d+$/.test(currentEditId) ? Number(currentEditId) : currentEditId;
      console.log("Update id:", matchValue, "payload:", payload);

      const rowCheck = await supabaseClient
        .from(TABLE_NAME)
        .select("id")
        .eq("id", matchValue)
        .single();

      console.log("Existing row check:", rowCheck);
      if (rowCheck.error && rowCheck.status !== 406) {
        throw rowCheck.error;
      }
      if (!rowCheck.data) {
        throw new Error(translations[currentLang].updateNoRows);
      }

      const result = await supabaseClient
        .from(TABLE_NAME)
        .update(payload)
        .eq("id", matchValue)
        .select();

      data = result.data;
      error = result.error;
      console.log("Update result:", result);

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(translations[currentLang].updateNoRows);
      }
      data = data[0];
    } else {
      const result = await supabaseClient
        .from(TABLE_NAME)
        .insert([payload])
        .select()
        .single();

      data = result.data;
      error = result.error;
      if (error) throw error;
      if (!data) throw new Error("Supabase operation returned no data");
    }

    console.log("Save success:", data);
    showToast(translations[currentLang].saved);
    currentEditId = null;
    existingImages = [];
    pendingFiles = [];
    addProductForm.reset();
    setProductCategoryValue(CATEGORY_KEYS[0]);
    productQtyInput.value = 1;
    renderImagePreviews();
    await fetchProducts();
    navigateTo("/");
  } catch (err) {
    console.error("Insert error:", err);
    showToast(translations[currentLang].saveError + (err?.message || err), "danger");
  } finally {
    setSaving(false);
  }
});

function setSaving(isSaving) {
  saveBtn.disabled = isSaving;
  saveBtnText.classList.toggle("d-none", isSaving);
  saveBtnSpinner.classList.toggle("d-none", !isSaving);
}

// ------------------- Delete สินค้า -------------------
function requestDelete(product) {
  pendingDeleteProduct = product;
  document.getElementById("confirmDeleteText").textContent = translations[currentLang].confirmDelete;
  document.getElementById("confirmDeleteCancelBtn").textContent = translations[currentLang].cancelButton;
  confirmDeleteModal.show();
}

confirmDeleteOkBtn.addEventListener("click", async () => {
  const product = pendingDeleteProduct;
  pendingDeleteProduct = null;
  confirmDeleteModal.hide();
  if (product) await handleDelete(product);
});

async function handleDelete(product) {
  try {
    const images = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : (product.image_url ? [product.image_url] : []);
    await deleteProductImages(images);

    const { error } = await supabaseClient.from(TABLE_NAME).delete().eq("id", product.id);
    if (error) throw error;

    showToast(translations[currentLang].deleted);
    await fetchProducts();
    navigateTo("/");
  } catch (err) {
    console.error("Delete error:", err);
    showToast(translations[currentLang].deleteError + err.message, "danger");
  }
}

// ------------------- Init -------------------
fetchProducts();
router();
