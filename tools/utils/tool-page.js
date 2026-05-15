const ToolPage = {
  async init(toolId) {
    this.toolId = toolId;
    this.showLoading();
    
    const loaded = await AppConfig.init();
    if (!loaded) {
      this.showError('配置加载失败，请刷新页面重试');
      return false;
    }
    
    this.tool = AppConfig.getToolById(toolId);
    if (!this.tool) {
      this.showError('工具不存在');
      return false;
    }
    
    return true;
  },
  
  showLoading() {
    document.getElementById('app').innerHTML = UI.renderLoading();
  },
  
  showError(message) {
    document.getElementById('app').innerHTML = UI.renderError(message);
  },
  
  render(options = {}) {
    const { 
      inputFields = [], 
      buttons = [], 
      outputId = 'output',
      customContent = ''
    } = options;
    
    const tool = this.tool;
    
    document.getElementById('app').innerHTML = `
      ${UI.renderNavbar()}
      <div class="container">
        <div class="header">
          <h1>${tool.name}</h1>
          <p>${tool.description}</p>
        </div>
        
        ${this._renderInputSection(inputFields)}
        ${this._renderButtonSection(buttons)}
        ${customContent}
        ${this._renderOutputSection(outputId)}
      </div>
    `;
  },
  
  _renderInputSection(fields) {
    if (!fields.length) return '';
    
    const fieldsHtml = fields.map(field => {
      switch (field.type) {
        case 'textarea':
          return `<textarea id="${field.id}" placeholder="${field.placeholder || ''}"></textarea>`;
        case 'text':
          return `<input type="text" id="${field.id}" placeholder="${field.placeholder || ''}">`;
        case 'number':
          return `<input type="number" id="${field.id}" value="${field.value || ''}" min="${field.min || ''}" max="${field.max || ''}">`;
        case 'select':
          const options = (field.options || []).map(opt => 
            `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.label}</option>`
          ).join('');
          return `<select id="${field.id}">${options}</select>`;
        case 'checkbox':
          return `
            <label class="checkbox-label">
              <input type="checkbox" id="${field.id}" ${field.checked ? 'checked' : ''}>
              ${field.label}
            </label>
          `;
        default:
          return '';
      }
    }).join('');
    
    return `
      <div class="card">
        <div class="card-title">${AppConfig.t('common.input')}</div>
        ${fieldsHtml}
      </div>
    `;
  },
  
  _renderButtonSection(buttons) {
    if (!buttons.length) return '';
    
    const buttonsHtml = buttons.map(btn => {
      const btnClass = btn.primary ? 'btn-primary' : 'btn-secondary';
      return `<button class="btn ${btnClass}" onclick="${btn.onclick}">${btn.label}</button>`;
    }).join('');
    
    return `
      <div class="card">
        <div class="btn-group">
          ${buttonsHtml}
        </div>
      </div>
    `;
  },
  
  _renderOutputSection(outputId) {
    return `
      <div class="card">
        <div class="card-title">${AppConfig.t('common.output')}</div>
        <div id="${outputId}" class="output"></div>
      </div>
    `;
  },
  
  getInput(id) {
    return document.getElementById(id)?.value || '';
  },
  
  setInput(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  },
  
  setOutput(content, type = '') {
    UI.setOutput('output', content, type);
  },
  
  clearAll() {
    document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
      el.value = '';
    });
    UI.clear('output');
  }
};

window.ToolPage = ToolPage;
