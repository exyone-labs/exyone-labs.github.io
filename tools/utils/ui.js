const UI = {
  toast(message, duration) {
    const toastDuration = duration || Config.ui?.toast?.duration || 2000;
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
      this.toast(successMessage || Config.t('common.copySuccess'));
    }).catch(() => {
      this.toast(Config.t('common.copyFail'));
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
    const basePath = Config.getBasePath();
    const site = Config.site;
    return `
      <nav class="navbar">
        <a href="${basePath}" class="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
          <span>${site.title || 'Developer Tools'}</span>
        </a>
        <a href="${basePath}" class="back-link">
          ${Config.getIcon('back')}
          <span>${Config.t('common.backToHome')}</span>
        </a>
      </nav>
    `;
  },
  
  renderToolCard(tool) {
    const category = Config.getCategoryById(tool.category);
    const icon = Config.getIcon(category?.icon || 'generate');
    return `
      <a href="${tool.path}" class="tool-card">
        <div class="tool-icon">${icon}</div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.description}</div>
      </a>
    `;
  },
  
  renderCategorySection(category) {
    const tools = Config.getToolsByCategory(category.id);
    const icon = Config.getIcon(category.icon);
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
    return `
      <div class="loading">
        ${Config.getIcon('loading')}
      </div>
    `;
  },
  
  renderError(message) {
    return `
      <div class="error-message">
        ${message || Config.t('common.error')}
      </div>
    `;
  },
  
  renderEmpty(message) {
    return `
      <div class="empty-state">
        ${Config.getIcon('search')}
        <p>${message || Config.t('common.noResult')}</p>
      </div>
    `;
  }
};

window.UI = UI;
