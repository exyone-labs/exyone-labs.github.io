const AppConfig = {
  site: null,
  categories: null,
  tools: null,
  ui: null,
  i18n: null,
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
      
      this.site = await siteRes.json();
      this.categories = await categoriesRes.json();
      this.tools = await toolsRes.json();
      this.ui = await uiRes.json();
      this.i18n = await i18nRes.json();
      
      this._initTheme();
      return true;
    } catch (e) {
      console.error('Failed to load config:', e);
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
    const savedTheme = localStorage.getItem(this.ui?.theme?.storageKey || 'devtools-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.ui?.theme?.storageKey || 'devtools-theme', theme);
  },
  
  getSite() {
    return this.site || {};
  },
  
  getCategories() {
    return this.categories?.categories || [];
  },
  
  getCategoryById(id) {
    return this.getCategories().find(c => c.id === id);
  },
  
  getTools() {
    return this.tools?.tools || [];
  },
  
  getToolById(id) {
    return this.getTools().find(t => t.id === id);
  },
  
  getToolsByCategory(categoryId) {
    return this.getTools().filter(t => t.category === categoryId);
  },
  
  searchTools(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.getTools();
    return this.getTools().filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
  },
  
  getIcon(name) {
    return this.ui?.icons?.[name] || '';
  },
  
  t(path) {
    const parts = path.split('.');
    let value = this.i18n;
    for (const part of parts) {
      value = value?.[part];
    }
    return value || path;
  }
};

const UI = {
  toast(message, duration) {
    const toastDuration = duration || AppConfig.ui?.toast?.duration || 2000;
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), toastDuration);
  },
  
  copy(text, successMessage) {
    if (!text) return false;
    navigator.clipboard.writeText(text).then(() => {
      this.toast(successMessage || AppConfig.t('common.copySuccess'));
    }).catch(() => {
      this.toast(AppConfig.t('common.copyFail'));
    });
    return true;
  },
  
  clear(id) {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = '';
      } else {
        el.textContent = '';
        el.className = 'output';
      }
    }
  },
  
  setOutput(id, content, type) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = content;
      el.className = 'output' + (type ? ` ${type}` : '');
    }
  },
  
  renderNavbar() {
    const basePath = AppConfig.getBasePath();
    const site = AppConfig.getSite();
    return `
      <nav class="navbar">
        <a href="${basePath}" class="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
          <span>${site.title || 'Developer Tools'}</span>
        </a>
        <a href="${basePath}" class="back-link">
          ${AppConfig.getIcon('back')}
          <span>${AppConfig.t('common.backToHome')}</span>
        </a>
      </nav>
    `;
  },
  
  renderToolCard(tool) {
    const category = AppConfig.getCategoryById(tool.category);
    const icon = AppConfig.getIcon(category?.icon || 'generate');
    return `
      <a href="${tool.path}" class="tool-card">
        <div class="tool-icon">${icon}</div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.description}</div>
      </a>
    `;
  },
  
  renderCategorySection(category) {
    const tools = AppConfig.getToolsByCategory(category.id);
    const icon = AppConfig.getIcon(category.icon);
    return `
      <section class="category-section" id="category-${category.id}">
        <h2 class="category-title">
          <span class="category-icon">${icon}</span>
          ${category.name}
        </h2>
        <p class="category-desc">${category.description}</p>
        <div class="tools-grid">
          ${tools.map(t => this.renderToolCard(t)).join('')}
        </div>
      </section>
    `;
  },
  
  renderLoading() {
    return `<div class="loading">${AppConfig.getIcon('loading')}</div>`;
  },
  
  renderError(message) {
    return `<div class="error-message">${message || AppConfig.t('common.error')}</div>`;
  },
  
  renderEmpty(message) {
    return `
      <div class="empty-state">
        ${AppConfig.getIcon('search')}
        <p>${message || AppConfig.t('common.noResult')}</p>
      </div>
    `;
  }
};

const Utils = {
  async sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  async sha1(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  async sha512(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  async md5(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).slice(0, 22);
  },
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  generatePassword(length, options) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (options.upper) chars += upper;
    if (options.lower) chars += lower;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;
    
    if (!chars) chars = lower + numbers;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },
  
  formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },
  
  parseDate(dateStr) {
    const date = new Date(dateStr);
    return Math.floor(date.getTime() / 1000);
  },
  
  countText(text) {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    
    return { chars, charsNoSpace, words, lines, chinese };
  },
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
};

window.AppConfig = AppConfig;
window.UI = UI;
window.Utils = Utils;
