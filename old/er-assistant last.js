// eR assistant v1.3 - Bookmarklet Loader
// https://github.com/yourusername/er-assistant

(function() {
  'use strict';
  
  // Check if already loaded
  if (document.getElementById('er-widget')) {
    // Just toggle if already present
    const widget = document.getElementById('er-widget');
    const toggleBtn = document.getElementById('toggle-btn');
    
    if (widget.classList.contains('open')) {
      widget.classList.remove('open');
      toggleBtn.classList.remove('widget-open');
    } else {
      widget.classList.add('open');
      toggleBtn.classList.add('widget-open');
    }
    return;
  }
  
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Widget Container */
    #er-widget {
      position: fixed;
      top: 0;
      right: -500px;
      width: 500px;
      height: 100vh;
      background: #ffffff;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 1px solid #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }
    
    #er-widget.open {
      right: 0;
    }
    
    /* Resize Handle */
    .resize-handle {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      cursor: ew-resize;
      background: transparent;
      transition: background 0.2s;
    }
    
    .resize-handle:hover {
      background: rgba(107, 38, 66, 0.2);
    }
    
    .resize-handle:active {
      background: rgba(107, 38, 66, 0.4);
    }
    
    /* Toggle Button */
    .toggle-btn {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #6B2642 0%, #4A1A2F 100%);
      color: white;
      border: none;
      width: 48px;
      height: 120px;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      z-index: 999998;
      box-shadow: -2px 2px 12px rgba(0,0,0,0.15);
      transition: all 0.2s;
      display: block;
    }
    
    .toggle-btn:hover {
      width: 52px;
      box-shadow: -4px 4px 16px rgba(0,0,0,0.2);
    }
    
    .toggle-btn.widget-open {
      display: none;
    }
    
    /* Header */
    .widget-header {
      background: linear-gradient(135deg, #6B2642 0%, #4A1A2F 100%);
      padding: 8px 20px;
      color: white;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .widget-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .widget-title h1 {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }
    
    .widget-title .subtitle {
      font-size: 12px;
      opacity: 0.85;
      color: white;
    }
    
    .close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    
    .close-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    /* Content */
    .widget-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #fafafa;
    }
    
    /* Section */
    .section {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 0;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      cursor: pointer;
      user-select: none;
      background: white;
      transition: background 0.2s;
    }
    
    .section-header:hover {
      background: #f9f9f9;
    }
    
    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .collapse-icon {
      font-size: 12px;
      color: #666;
      transition: transform 0.2s;
    }
    
    .collapse-icon.collapsed {
      transform: rotate(-90deg);
    }
    
    .section-content {
      padding: 0 20px 20px 20px;
      max-height: 2000px;
      overflow: hidden;
      transition: max-height 0.3s ease-out, opacity 0.3s;
      opacity: 1;
    }
    
    .section-content.collapsed {
      max-height: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    
    /* Upload Area */
    .upload-area {
      border: 2px dashed #d0d0d0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }
    
    .upload-area:hover {
      border-color: #6B2642;
      background: #fef5f9;
    }
    
    .upload-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .upload-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .file-input {
      display: none;
    }
    
    .uploaded-file {
      display: none;
      margin-top: 12px;
      padding: 12px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
    }
    
    .uploaded-file-inner {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .uploaded-file .filename {
      font-weight: 600;
      font-size: 13px;
      color: #166534;
    }
    
    .uploaded-file .filesize {
      font-size: 11px;
      color: #15803d;
    }
    
    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #f6f8fb 0%, #fafbfc 100%);
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #e8e8e8;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #6B2642;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 11px;
      color: #666;
      font-weight: 500;
    }
    
    /* BOT Breakdown */
    .bot-breakdown {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }
    
    .bot-type-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: #f8f8f8;
      border-radius: 6px;
      font-size: 12px;
    }
    
    .bot-type-label {
      color: #666;
      font-weight: 500;
    }
    
    .bot-type-value {
      font-weight: 600;
      color: #333;
    }
    
    /* Health Indicators */
    .health-indicators {
      display: grid;
      gap: 10px;
    }
    
    .health-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 13px;
    }
    
    .health-item.success {
      background: #f0fdf4;
      border: 1px solid #86efac;
    }
    
    .health-item.warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }
    
    .health-item.error {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
    
    .health-label {
      font-weight: 500;
      color: #666;
    }
    
    .health-value {
      font-weight: 700;
    }
    
    .health-item.success .health-value {
      color: #166534;
    }
    
    .health-item.warning .health-value {
      color: #92400e;
    }
    
    .health-item.error .health-value {
      color: #991b1b;
    }
    
    /* Analysis */
    .run-analysis-btn {
      width: 100%;
      background: linear-gradient(135deg, #6B2642 0%, #4A1A2F 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(107, 38, 66, 0.2);
      margin-top: 20px;
    }
    
    .run-analysis-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(107, 38, 66, 0.3);
    }
    
    .loading {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #6B2642;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .score-badge {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .score-badge.excellent {
      background: #f0fdf4;
      color: #166534;
      border: 2px solid #86efac;
    }
    
    .score-badge.good {
      background: #f0f9ff;
      color: #075985;
      border: 2px solid #7dd3fc;
    }
    
    .score-badge.fair {
      background: #fffbeb;
      color: #92400e;
      border: 2px solid #fde68a;
    }
    
    .score-badge.poor {
      background: #fef2f2;
      color: #991b1b;
      border: 2px solid #fecaca;
    }
    
    /* Category */
    .analysis-category {
      margin-bottom: 16px;
    }
    
    .category-title {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .category-title.all-good {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #86efac;
    }
    
    .category-title.has-errors {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    
    .category-title.has-warnings {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    
    /* Issue List */
    .issue-list {
      margin-top: 8px;
      display: grid;
      gap: 8px;
    }
    
    .issue-item {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 12px;
    }
    
    .issue-item.error {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
    
    .issue-item.warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }
    
    .issue-type {
      font-weight: 700;
      margin-bottom: 4px;
      color: #333;
    }
    
    .issue-message {
      color: #666;
      line-height: 1.4;
    }
    
    .issue-actions {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
    
    .issue-link {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: #6B2642;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .issue-link:hover {
      background: #4A1A2F;
    }
    
    .hidden-issues {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
    
    .hidden-issues.expanded {
      max-height: 2000px;
    }
    
    .show-more-btn {
      width: 100%;
      padding: 10px;
      margin-top: 8px;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      color: #666;
      transition: all 0.2s;
    }
    
    .show-more-btn:hover {
      background: #f9f9f9;
      border-color: #6B2642;
      color: #6B2642;
    }
  `;
  document.head.appendChild(style);
  
  // Inject HTML
  const html = `
    <button class="toggle-btn" id="toggle-btn" onclick="toggleWidget()">eR assistant</button>

    <div id="er-widget">
      <div class="resize-handle" id="resize-handle"></div>
      
      <div class="widget-header">
        <div class="header-top">
          <div class="widget-title">
            <h1>eR assistant</h1>
            <span class="subtitle">v1.3</span>
          </div>
          <button class="close-btn" onclick="toggleWidget()">×</button>
        </div>
      </div>

      <div class="widget-content">
        
        <!-- Upload Section -->
        <div class="section">
          <div class="section-header" onclick="toggleSection('upload')">
            <div class="section-title">Upload Service</div>
            <span class="collapse-icon" id="icon-upload">▼</span>
          </div>
          <div class="section-content" id="content-upload">
            <div class="upload-area" id="upload-area">
              <div class="upload-icon">📄</div>
              <div class="upload-text">Click or drag JSON file here</div>
              <input type="file" id="file-input" class="file-input" accept=".json">
            </div>
            
            <div class="uploaded-file" id="uploaded-file">
              <div class="uploaded-file-inner">
                <span class="filename" id="filename"></span>
                <span class="filesize" id="filesize"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Overview Section -->
        <div class="section" id="overview-section" style="display:none">
          <div class="section-header" onclick="toggleSection('overview')">
            <div class="section-title">Service Overview</div>
            <span class="collapse-icon" id="icon-overview">▼</span>
          </div>
          <div class="section-content" id="content-overview">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="total-bots">0</div>
                <div class="stat-label">BOTs</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="total-actions">0</div>
                <div class="stat-label">Actions</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="total-determinants">0</div>
                <div class="stat-label">Determinants</div>
              </div>
            </div>
            
            <div class="bot-breakdown" id="bot-breakdown"></div>
          </div>
        </div>

        <!-- Health Section -->
        <div class="section" id="health-section" style="display:none">
          <div class="section-header" onclick="toggleSection('health')">
            <div class="section-title">Health Indicators</div>
            <span class="collapse-icon" id="icon-health">▼</span>
          </div>
          <div class="section-content" id="content-health">
            <div class="health-indicators" id="health-indicators"></div>
            <button class="run-analysis-btn" onclick="runAnalysis()">Run Full Analysis</button>
          </div>
        </div>

        <!-- Analysis Section -->
        <div class="section" id="analysis-section" style="display:none">
          <div class="section-header" onclick="toggleSection('analysis')">
            <div class="section-title">Analysis</div>
            <span class="collapse-icon" id="icon-analysis">▼</span>
          </div>
          <div class="section-content" id="content-analysis">
            <div id="analysis-results"></div>
          </div>
        </div>

      </div>
    </div>
  `;
  
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  // JavaScript functionality
  let serviceData = null;
  let serviceId = null;
  let baseUrl = '';
  let widgetWidth = 500;
  let isResizing = false;
  
  // System variables (from BPA backend SystemDeterminant.java and DocumentFormFields.java)
  const SYSTEM_VARIABLES = [
    'isFormValid',
    'isCurrentPartATabValid',
    'theProcedureIsFree',
    'isPayedDigitally',
    'is_submit_allowed',
    'totalCost',
    'requirementNotRequired',
    'fileupload',
    'filedate',
    'filestatus',
    'filerejection',
    'documentrejection',
    'filetitle',
    'certtitle',
    'certid'
  ];
  
  // Check if a field is a system variable
  function isSystemVariable(fieldKey) {
    if (!fieldKey) return false;
    
    // Exact matches
    if (SYSTEM_VARIABLES.includes(fieldKey)) return true;
    
    // Pattern matches
    if (fieldKey.includes('TabValid')) return true;
    if (fieldKey.startsWith('rejection')) return true;
    if (fieldKey.startsWith('sendbacktocorrections')) return true;
    if (fieldKey.startsWith('file')) return true;
    if (fieldKey.startsWith('is') && fieldKey.length > 2) {
      // System boolean checks (isFormValid, isUserLoggedIn, etc.)
      const thirdChar = fieldKey.charAt(2);
      if (thirdChar === thirdChar.toUpperCase()) return true;
    }
    
    return false;
  }
  
  // Make functions global
  window.toggleWidget = function() {
    const widget = document.getElementById('er-widget');
    const toggleBtn = document.getElementById('toggle-btn');
    
    if (widget.classList.contains('open')) {
      widget.classList.remove('open');
      toggleBtn.classList.remove('widget-open');
    } else {
      widget.classList.add('open');
      toggleBtn.classList.add('widget-open');
    }
  };
  
  window.toggleSection = function(sectionName) {
    const content = document.getElementById('content-' + sectionName);
    const icon = document.getElementById('icon-' + sectionName);
    
    if (content.classList.contains('collapsed')) {
      content.classList.remove('collapsed');
      icon.classList.remove('collapsed');
      localStorage.setItem('er-section-' + sectionName, 'expanded');
    } else {
      content.classList.add('collapsed');
      icon.classList.add('collapsed');
      localStorage.setItem('er-section-' + sectionName, 'collapsed');
    }
  };
  
  window.runAnalysis = function() {
    if (!serviceData) return;
    
    document.getElementById('analysis-section').style.display = 'block';
    document.getElementById('analysis-results').innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div>Analyzing service...</div>
      </div>
    `;
    
    setTimeout(() => {
      const results = analyzeService(serviceData);
      displayAnalysisResults(results);
    }, 500);
  };
  
  window.toggleHidden = function(id, button) {
    const element = document.getElementById(id);
    if (element.classList.contains('expanded')) {
      element.classList.remove('expanded');
      const count = element.children.length;
      button.textContent = `+ ${count} more ${button.textContent.includes('error') ? 'error' : 'warning'}${count > 1 ? 's' : ''}`;
    } else {
      element.classList.add('expanded');
      button.textContent = '− Show less';
    }
  };
  
  function restoreSectionStates() {
    ['upload', 'overview', 'health', 'analysis'].forEach(sectionName => {
      const state = localStorage.getItem('er-section-' + sectionName);
      if (state === 'collapsed') {
        const content = document.getElementById('content-' + sectionName);
        const icon = document.getElementById('icon-' + sectionName);
        if (content && icon) {
          content.classList.add('collapsed');
          icon.classList.add('collapsed');
        }
      }
    });
  }
  
  function initResize() {
    const handle = document.getElementById('resize-handle');
    const widget = document.getElementById('er-widget');
    const toggleBtn = document.getElementById('toggle-btn');
    
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      
      if (newWidth >= 300 && newWidth <= 800) {
        widgetWidth = newWidth;
        widget.style.width = widgetWidth + 'px';
        widget.style.right = widget.classList.contains('open') ? '0' : '-' + widgetWidth + 'px';
        
        if (widget.classList.contains('open')) {
          toggleBtn.style.right = widgetWidth + 'px';
        }
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }
  
  function loadServiceFile(file) {
    console.log('Loading file:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = JSON.parse(e.target.result);
        serviceData = rawData.service || rawData;
        
        if (!serviceId && serviceData.id) {
          serviceId = serviceData.id;
          console.log('Service ID from JSON:', serviceId);
        }
        
        console.log('Service loaded:', Object.keys(serviceData));
        
        document.getElementById('uploaded-file').style.display = 'block';
        document.getElementById('filename').textContent = file.name;
        document.getElementById('filesize').textContent = `${(file.size / 1024).toFixed(1)} KB`;
        
        displayServiceOverview();
        calculateHealthIndicators();
        
        document.getElementById('overview-section').style.display = 'block';
        document.getElementById('health-section').style.display = 'block';
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error parsing JSON file: ' + error.message);
      }
    };
    reader.readAsText(file);
  }
  
  function displayServiceOverview() {
    if (!serviceData) return;
    
    const bots = serviceData.bots || [];
    const componentActions = serviceData.componentActions || [];
    const determinants = serviceData.serviceDeterminants || [];
    
    document.getElementById('total-bots').textContent = bots.length;
    document.getElementById('total-actions').textContent = componentActions.length;
    document.getElementById('total-determinants').textContent = determinants.length;
    
    const botsByType = {
      data: bots.filter(b => b.botType === 'data').length,
      document: bots.filter(b => b.botType === 'document').length,
      message: bots.filter(b => b.botType === 'message').length,
      internal: bots.filter(b => b.botType === 'internal').length,
      system: bots.filter(b => b.botType === 'system').length
    };
    
    let breakdownHTML = '<div style="font-size:12px;color:#666;margin-bottom:8px;font-weight:600">BOTs by Type</div>';
    
    if (botsByType.data > 0) {
      breakdownHTML += `
        <div class="bot-type-item">
          <span class="bot-type-label">Data</span>
          <span class="bot-type-value">${botsByType.data}</span>
        </div>
      `;
    }
    
    if (botsByType.document > 0) {
      breakdownHTML += `
        <div class="bot-type-item">
          <span class="bot-type-label">Document</span>
          <span class="bot-type-value">${botsByType.document}</span>
        </div>
      `;
    }
    
    if (botsByType.message > 0) {
      breakdownHTML += `
        <div class="bot-type-item">
          <span class="bot-type-label">Message</span>
          <span class="bot-type-value">${botsByType.message}</span>
        </div>
      `;
    }
    
    if (botsByType.internal > 0) {
      breakdownHTML += `
        <div class="bot-type-item">
          <span class="bot-type-label">Internal</span>
          <span class="bot-type-value">${botsByType.internal}</span>
        </div>
      `;
    }
    
    if (botsByType.system > 0) {
      breakdownHTML += `
        <div class="bot-type-item">
          <span class="bot-type-label">System</span>
          <span class="bot-type-value">${botsByType.system}</span>
        </div>
      `;
    }
    
    document.getElementById('bot-breakdown').innerHTML = breakdownHTML;
  }
  
  function extractFieldKeys(components) {
    const keys = new Set();
    
    function traverse(comps) {
      if (!Array.isArray(comps)) return;
      
      comps.forEach(comp => {
        if (comp.key) keys.add(comp.key);
        
        if (comp.components) traverse(comp.components);
        
        if (comp.columns) {
          comp.columns.forEach(col => {
            if (col.components) traverse(col.components);
          });
        }
      });
    }
    
    traverse(components);
    return keys;
  }
  
  function extractDeterminantIds(obj, ids) {
    if (!obj) return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => extractDeterminantIds(item, ids));
    } else if (typeof obj === 'object') {
      if (obj.determinantId) {
        ids.add(obj.determinantId);
      }
      Object.values(obj).forEach(val => extractDeterminantIds(val, ids));
    }
  }
  
  function calculateHealthIndicators() {
    if (!serviceData) return;
    
    const bots = serviceData.bots || [];
    const componentActions = serviceData.componentActions || [];
    const determinants = serviceData.serviceDeterminants || [];
    
    let allFieldKeys = new Set();
    try {
      if (serviceData.applicantFormPage && serviceData.applicantFormPage.formSchema) {
        const formSchema = JSON.parse(serviceData.applicantFormPage.formSchema);
        allFieldKeys = extractFieldKeys(formSchema.components || []);
      }
    } catch (err) {
      console.error('Error parsing formSchema:', err);
    }
    
    const usedBotNames = new Set();
    componentActions.forEach(compAction => {
      const actionRows = compAction.actionRows || [];
      actionRows.forEach(row => {
        const rowBots = row.bots || [];
        rowBots.forEach(bot => {
          if (bot.name) usedBotNames.add(bot.name);
        });
      });
    });
    const unusedBots = bots.filter(bot => !usedBotNames.has(bot.name)).length;
    
    const brokenDeterminants = determinants.filter(det => {
      if (det.determinantType === 'FORMFIELD' && det.targetFormFieldKey) {
        return !allFieldKeys.has(det.targetFormFieldKey);
      }
      return false;
    }).length;
    
    const usedDeterminantIds = new Set();
    
    const behaviours = serviceData.componentBehaviours || [];
    behaviours.forEach(beh => {
      const effects = beh.effects || [];
      effects.forEach(eff => {
        try {
          const jsonDet = JSON.parse(eff.jsonDeterminants || '[]');
          extractDeterminantIds(jsonDet, usedDeterminantIds);
        } catch (err) {}
      });
    });
    
    bots.forEach(bot => {
      const mappings = bot.dataMappings || [];
      mappings.forEach(mapping => {
        if (mapping.jsonDeterminant) {
          try {
            const jsonDet = JSON.parse(mapping.jsonDeterminant);
            extractDeterminantIds(jsonDet, usedDeterminantIds);
          } catch (err) {}
        }
      });
    });
    
    const unusedDeterminants = determinants.filter(det => 
      !usedDeterminantIds.has(det.oldId)
    ).length;
    
    const healthEl = document.getElementById('health-indicators');
    healthEl.innerHTML = `
      <div class="health-item ${unusedBots === 0 ? 'success' : 'warning'}">
        <div class="health-label">Unused BOTs</div>
        <div class="health-value">${unusedBots} / ${bots.length}</div>
      </div>
      
      <div class="health-item ${brokenDeterminants === 0 ? 'success' : 'error'}">
        <div class="health-label">Broken Determinants</div>
        <div class="health-value">${brokenDeterminants}</div>
      </div>
      
      <div class="health-item ${unusedDeterminants === 0 ? 'success' : 'warning'}">
        <div class="health-label">Unused Determinants</div>
        <div class="health-value">${unusedDeterminants}</div>
      </div>
    `;
  }
  
  function generateBPALink(type, searchTerm) {
    if (!baseUrl || !serviceId) {
      return null;
    }
    
    const encodedSearch = encodeURIComponent(searchTerm);
    
    switch (type) {
      case 'bot':
        return `${baseUrl}/services/${serviceId}/bots?search=${encodedSearch}`;
      case 'determinant':
        return `${baseUrl}/services/${serviceId}/determinantstable?search=${encodedSearch}`;
      case 'bots-page':
        return `${baseUrl}/services/${serviceId}/bots`;
      case 'determinants-page':
        return `${baseUrl}/services/${serviceId}/determinantstable`;
      default:
        return null;
    }
  }
  
  function analyzeService(data) {
    const errorsByCategory = {
      bot: [],
      determinant: [],
      registration: [],
      role: [],
      form: [],
      bpmn: [],
      mule: []
    };
    
    const warningsByCategory = {
      bot: [],
      determinant: [],
      registration: [],
      role: []
    };
    
    const bots = data.bots || [];
    const componentActions = data.componentActions || [];
    const determinants = data.serviceDeterminants || [];
    
    let allFieldKeys = new Set();
    try {
      if (data.applicantFormPage && data.applicantFormPage.formSchema) {
        const formSchema = JSON.parse(data.applicantFormPage.formSchema);
        allFieldKeys = extractFieldKeys(formSchema.components || []);
      }
    } catch (err) {}
    
    const botNames = new Set(bots.map(b => b.name));
    const usedBotNames = new Set();
    
    componentActions.forEach(compAction => {
      const actionRows = compAction.actionRows || [];
      actionRows.forEach(row => {
        const rowBots = row.bots || [];
        rowBots.forEach(bot => {
          if (bot.name && bot.botType !== 'system') {
            usedBotNames.add(bot.name);
            if (!botNames.has(bot.name)) {
              errorsByCategory.bot.push({
                type: 'Undefined BOT',
                message: `Action "${compAction.componentKey}" uses undefined BOT "${bot.name}"`,
                searchTerm: bot.name
              });
            }
          }
        });
      });
    });
    
    bots.forEach(bot => {
      if (!usedBotNames.has(bot.name)) {
        warningsByCategory.bot.push({
          type: 'Unused BOT',
          message: `BOT "${bot.name}" (${bot.botType || 'unknown'}) is never used`,
          searchTerm: bot.name
        });
      }
    });
    
    const determinantIds = new Set(determinants.map(d => d.oldId));
    const usedDeterminantIds = new Set();
    
    const behaviours = data.componentBehaviours || [];
    behaviours.forEach(beh => {
      const effects = beh.effects || [];
      effects.forEach(eff => {
        try {
          const jsonDet = JSON.parse(eff.jsonDeterminants || '[]');
          extractDeterminantIds(jsonDet, usedDeterminantIds);
        } catch (err) {}
      });
    });
    
    bots.forEach(bot => {
      const mappings = bot.dataMappings || [];
      mappings.forEach(mapping => {
        if (mapping.jsonDeterminant) {
          try {
            const jsonDet = JSON.parse(mapping.jsonDeterminant);
            extractDeterminantIds(jsonDet, usedDeterminantIds);
          } catch (err) {}
        }
      });
    });
    
    usedDeterminantIds.forEach(id => {
      if (!determinantIds.has(id)) {
        errorsByCategory.determinant.push({
          type: 'Undefined Determinant',
          message: `Determinant ID "${id.substring(0, 8)}..." is referenced but not defined`,
          searchTerm: ''
        });
      }
    });
    
    determinants.forEach(det => {
      if (det.determinantType === 'FORMFIELD' && det.targetFormFieldKey) {
        if (!allFieldKeys.has(det.targetFormFieldKey)) {
          errorsByCategory.determinant.push({
            type: 'Broken Determinant',
            message: `Determinant "${det.name}" references missing field "${det.targetFormFieldKey}"`,
            searchTerm: det.name
          });
        }
      }
    });
    
    determinants.forEach(det => {
      if (!usedDeterminantIds.has(det.oldId)) {
        warningsByCategory.determinant.push({
          type: 'Unused Determinant',
          message: `Determinant "${det.name}" is defined but never used`,
          searchTerm: det.name
        });
      }
    });
    
    const totalErrors = Object.values(errorsByCategory).reduce((sum, arr) => sum + arr.length, 0);
    const totalWarnings = Object.values(warningsByCategory).reduce((sum, arr) => sum + arr.length, 0);
    
    let score = 100;
    score -= totalErrors * 10;
    score -= totalWarnings * 2;
    score = Math.max(0, Math.min(100, score));
    
    return { errorsByCategory, warningsByCategory, score };
  }
  
  function displayAnalysisResults(results) {
    const { errorsByCategory, warningsByCategory, score } = results;
    
    let html = '';
    
    // Score removed temporarily - will add back later
    
    const categories = [
      { key: 'bot', label: 'BOT Issues', linkType: 'bot' },
      { key: 'determinant', label: 'Determinant Issues', linkType: 'determinant' },
      { key: 'registration', label: 'Registration Issues', linkType: null },
      { key: 'role', label: 'Role Issues', linkType: null }
    ];
    
    categories.forEach(category => {
      const errors = errorsByCategory[category.key] || [];
      const warnings = warningsByCategory[category.key] || [];
      const total = errors.length + warnings.length;
      
      if (total === 0) {
        html += `
          <div class="analysis-category">
            <div class="category-title all-good">
              ${category.label} <span style="margin-left:auto">All Good</span>
            </div>
          </div>
        `;
      } else {
        const hasErrors = errors.length > 0;
        const titleClass = hasErrors ? 'has-errors' : 'has-warnings';
        
        html += `
          <div class="analysis-category">
            <div class="category-title ${titleClass}">
              ${category.label}
              <span style="margin-left:auto">${errors.length > 0 ? `${errors.length} errors` : ''} ${warnings.length > 0 ? `${warnings.length} warnings` : ''}</span>
            </div>
            <div class="issue-list">
        `;
        
        errors.slice(0, 3).forEach(err => {
          html += renderIssue(err, 'error', category.linkType);
        });
        
        if (errors.length > 3) {
          html += `<div class="hidden-issues" id="hidden-errors-${category.key}">`;
          errors.slice(3).forEach(err => {
            html += renderIssue(err, 'error', category.linkType);
          });
          html += `</div>`;
          html += `
            <button class="show-more-btn" onclick="toggleHidden('hidden-errors-${category.key}', this)">
              + ${errors.length - 3} more error${errors.length - 3 > 1 ? 's' : ''}
            </button>
          `;
        }
        
        warnings.slice(0, 3).forEach(warn => {
          html += renderIssue(warn, 'warning', category.linkType);
        });
        
        if (warnings.length > 3) {
          html += `<div class="hidden-issues" id="hidden-warnings-${category.key}">`;
          warnings.slice(3).forEach(warn => {
            html += renderIssue(warn, 'warning', category.linkType);
          });
          html += `</div>`;
          html += `
            <button class="show-more-btn" onclick="toggleHidden('hidden-warnings-${category.key}', this)">
              + ${warnings.length - 3} more warning${warnings.length - 3 > 1 ? 's' : ''}
            </button>
          `;
        }
        
        html += '</div></div>';
      }
    });
    
    document.getElementById('analysis-results').innerHTML = html;
  }
  
  function renderIssue(issue, severity, linkType) {
    let html = `
      <div class="issue-item ${severity}">
        <div class="issue-type">${issue.type}</div>
        <div class="issue-message">${issue.message}</div>
    `;
    
    if (issue.searchTerm && linkType && baseUrl && serviceId) {
      const link = generateBPALink(linkType, issue.searchTerm);
      if (link) {
        html += '<div class="issue-actions">';
        html += `
          <a href="${link}" target="_blank" class="issue-link">
            Search in BPA →
          </a>
        `;
        html += '</div>';
      }
    }
    
    html += '</div>';
    return html;
  }
  
  // Initialize
  const urlMatch = window.location.href.match(/services\/([a-f0-9-]+)/);
  if (urlMatch) {
    serviceId = urlMatch[1];
    baseUrl = window.location.origin;
    console.log('Detected service ID:', serviceId);
  }
  
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#6B2642';
    uploadArea.style.background = '#fef5f9';
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d0d0d0';
    uploadArea.style.background = '#fafafa';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d0d0d0';
    uploadArea.style.background = '#fafafa';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      loadServiceFile(file);
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      loadServiceFile(file);
    }
  });
  
  initResize();
  restoreSectionStates();
  
  console.log('✅ eR assistant v1.3 loaded');
  
  // Auto-open widget
  setTimeout(() => {
    toggleWidget();
  }, 100);
  
})();
