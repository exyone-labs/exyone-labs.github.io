const Config = {
  _cache: {
    site: null,
    categories: null,
    tools: null,
    ui: null,
    i18n: {}
  },
  
  currentLang: 'zh-CN',
  
  async init() {
    try {
      const basePath = this.getBasePath();
      const [siteRes, categoriesRes, toolsRes, uiRes, i18nRes] = await Promise.all([
        fetch(`${basePath}config/site.json`),
        fetch(`${basePath}config/categories.json`),
        fetch(`${basePath}config/tools.json`),
        fetch(`${basePath}config/ui.json`),
        fetch(`${basePath}config/i18n/${this.currentLang}.json`)
      ]);
      
      this._cache.site = await siteRes.json();
      this._cache.categories = await categoriesRes.json();
      this._cache.tools = await toolsRes.json();
      this._cache.ui = await uiRes.json();
      this._cache.i18n[this.currentLang] = await i18nRes.json();
      
      this._initTheme();
      return true;
    } catch (e) {
      console.error('Config load failed:', e);
      return false;
    }
  },
  
  getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/category/')) {
      return '../../../';
    }
    return './';
  },
  
  _initTheme() {
    const savedTheme = localStorage.getItem(this._cache.ui?.theme?.storageKey || 'devtools-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this._cache.ui?.theme?.storageKey || 'devtools-theme', theme);
  },
  
  get site() {
    return this._cache.site || {};
  },
  
  get categories() {
    return this._cache.categories?.categories || [];
  },
  
  get tools() {
    return this._cache.tools?.tools || [];
  },
  
  get ui() {
    return this._cache.ui || {};
  },
  
  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  },
  
  getToolById(id) {
    return this.tools.find(t => t.id === id);
  },
  
  getToolsByCategory(categoryId) {
    return this.tools.filter(t => t.category === categoryId);
  },
  
  searchTools(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.tools;
    return this.tools.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
  },
  
  getIcon(name) {
    return this._cache.ui?.icons?.[name] || '';
  },
  
  t(path) {
    const parts = path.split('.');
    let value = this._cache.i18n[this.currentLang];
    for (const part of parts) {
      value = value?.[part];
    }
    return value || path;
  },
  
  setLanguage(lang) {
    this.currentLang = lang;
    return this._loadI18n(lang);
  },
  
  async _loadI18n(lang) {
    if (this._cache.i18n[lang]) return true;
    try {
      const res = await fetch(`${this.getBasePath()}config/i18n/${lang}.json`);
      this._cache.i18n[lang] = await res.json();
      return true;
    } catch (e) {
      console.error('i18n load failed:', e);
      return false;
    }
  }
};

window.Config = Config;
