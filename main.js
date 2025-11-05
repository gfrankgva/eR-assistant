/**
 * eR-Assistant Phase 1: Core Connection Layer
 * Detects service, fetches backend data, displays entity counts
 */

(async function() {
  console.log('=== eR-Assistant Phase 1 ===');
  
  // ============================================================================
  // 1. Extract ServiceId from URL
  // ============================================================================
  function extractServiceId() {
    const match = window.location.pathname.match(/\/services\/([^/]+)/);
    if (!match || !match[1]) return null;
    return match[1];
  }
  
  const serviceId = extractServiceId();
  if (!serviceId) {
    console.error('❌ Not on a BPA service page. URL must contain /services/{serviceId}/');
    return;
  }
  console.log(`✓ Service ID: ${serviceId}`);
  
  // ============================================================================
  // 2. API Layer (inline for Phase 1)
  // ============================================================================
  const API_BASE = 'https://bpa.cuba.eregistrations.org';
  const API_PREFIX = '/bparest/bpa/v2016/06/service';
  
  function getToken() {
    const token = localStorage.getItem('tokenJWT');
    if (!token) {
      throw new Error('JWT token not found. Are you logged in?');
    }
    return token;
  }
  
  function buildHeaders() {
    return {
      'Authorization': `Bearer ${getToken()}`,
      'Accept': 'application/json'
    };
  }
  
  async function fetchJSON(endpoint) {
    const url = `${API_BASE}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} (${url})`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`⚠ API Error [${endpoint}]: ${error.message}`);
      return null;
    }
  }
  
  const API = {
    async getRoles() {
      const endpoint = `${API_PREFIX}/${serviceId}/role?includeDetails=true`;
      return await fetchJSON(endpoint);
    },
    
    async getDeterminants() {
      const endpoint = `${API_PREFIX}/${serviceId}/determinant`;
      return await fetchJSON(endpoint);
    },
    
    async getBots() {
      const endpoint = `/service/${serviceId}/bot`;
      return await fetchJSON(endpoint);
    },
    
    async getForms() {
      const endpoint = `/service/${serviceId}/forms`;
      return await fetchJSON(endpoint);
    }
  };
  
  // ============================================================================
  // 3. Fetch all data in parallel
  // ============================================================================
  try {
    console.log('Fetching backend data...');
    
    const results = await Promise.allSettled([
      API.getRoles(),
      API.getDeterminants(),
      API.getBots(),
      API.getForms()
    ]);
    
    const [rolesResult, determinantsResult, botsResult, formsResult] = results;
    
    const roles = rolesResult.status === 'fulfilled' ? rolesResult.value : null;
    const determinants = determinantsResult.status === 'fulfilled' ? determinantsResult.value : null;
    const bots = botsResult.status === 'fulfilled' ? botsResult.value : null;
    const forms = formsResult.status === 'fulfilled' ? formsResult.value : null;
    
    // ============================================================================
    // 4. Display results
    // ============================================================================
    console.log('\n📊 Entity Counts:');
    console.log(`  Forms:        ${Array.isArray(forms) ? forms.length : '❌ error'}`);
    console.log(`  Roles:        ${Array.isArray(roles) ? roles.length : '❌ error'}`);
    console.log(`  Determinants: ${Array.isArray(determinants) ? determinants.length : '❌ error'}`);
    console.log(`  BOTs:         ${Array.isArray(bots) ? bots.length : '❌ error'}`);
    
    console.log('\n✓ Phase 1 Complete. Ready for Phase 2 (DOM reading).\n');
    
    // Store data for Phase 2
    window.erAssistantData = { serviceId, forms, roles, determinants, bots };
    console.log('Data stored in: window.erAssistantData');
    
  } catch (error) {
    console.error('❌ Phase 1 failed:', error.message);
  }
})();
