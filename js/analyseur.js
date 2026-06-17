/* ===================================================================
   ANALYSEUR D'ENGINS BTP — Logique frontend
=================================================================== */

const API_BASE = window.location.origin;

// ─── Données locales ─────────────────────────────────────────────────
let equipmentData = null; // sera chargé depuis /api/equipment
let currentEquipmentId = null;
let currentMode = 'photo'; // 'photo' | 'manual'

// ─── Références DOM ──────────────────────────────────────────────────
const modePhotoBtn    = document.getElementById('mode-photo-btn');
const modeManualBtn   = document.getElementById('mode-manual-btn');
const uploadSection   = document.getElementById('upload-section');
const manualSection   = document.getElementById('manual-section');
const uploadZone      = document.getElementById('upload-zone');
const fileInput       = document.getElementById('file-input');
const imagePreview    = document.getElementById('image-preview');
const previewImg      = document.getElementById('preview-img');
const btnChange       = document.getElementById('btn-change');
const analyzeBtn      = document.getElementById('analyze-btn');
const loadingState    = document.getElementById('loading-state');
const resultsSection  = document.getElementById('results-section');
const searchInput     = document.getElementById('search-input');
const categoryFilter  = document.getElementById('category-filter');
const equipmentGrid   = document.getElementById('equipment-grid');
const apiStatusDot    = document.getElementById('api-status-dot');
const apiStatusText   = document.getElementById('api-status-text');

// ─── Initialisation ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await checkApiStatus();
  await loadEquipment();
  bindEvents();
  initTabNavigation();
});

async function checkApiStatus() {
  try {
    const resp = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    const data = await resp.json();
    if (data.ai_enabled) {
      apiStatusDot.className = 'status-dot status-online';
      apiStatusText.textContent = 'IA activée — analyse photo disponible';
    } else {
      apiStatusDot.className = 'status-dot status-warning';
      apiStatusText.textContent = 'Mode consultation (configurer ANTHROPIC_API_KEY pour l\'IA)';
      document.getElementById('analyze-btn').textContent = 'Configurer l\'IA pour analyser';
      document.getElementById('analyze-btn').disabled = true;
    }
  } catch {
    apiStatusDot.className = 'status-dot status-offline';
    apiStatusText.textContent = 'Serveur local non démarré — mode consultation uniquement';
    switchMode('manual');
  }
}

async function loadEquipment() {
  try {
    const resp = await fetch(`${API_BASE}/api/equipment`);
    equipmentData = await resp.json();
    renderEquipmentGrid(equipmentData.engins);
    renderCategoryFilters(equipmentData.categories);
  } catch {
    // Mode dégradé : pas de liste disponible via API
    console.warn('API non disponible — mode limité');
  }
}

// ─── Gestion des modes ────────────────────────────────────────────────
function bindEvents() {
  modePhotoBtn.addEventListener('click', () => switchMode('photo'));
  modeManualBtn.addEventListener('click', () => switchMode('manual'));

  // Upload par clic/drag
  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelection(file);
  });
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFileSelection(e.target.files[0]);
  });

  btnChange.addEventListener('click', () => {
    imagePreview.classList.remove('visible');
    uploadZone.style.display = '';
    analyzeBtn.disabled = true;
    currentEquipmentId = null;
    fileInput.value = '';
  });

  analyzeBtn.addEventListener('click', handleAnalyze);

  if (searchInput) searchInput.addEventListener('input', () => filterEquipment());
}

function switchMode(mode) {
  currentMode = mode;
  if (mode === 'photo') {
    modePhotoBtn.classList.add('active');
    modeManualBtn.classList.remove('active');
    uploadSection.style.display = '';
    manualSection.classList.remove('visible');
  } else {
    modeManualBtn.classList.add('active');
    modePhotoBtn.classList.remove('active');
    uploadSection.style.display = 'none';
    manualSection.classList.add('visible');
  }
  resultsSection.classList.remove('visible');
}

// ─── Upload & preview ─────────────────────────────────────────────────
function handleFileSelection(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    showAlert('Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.', 'error');
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showAlert('Image trop volumineuse (max 8 Mo).', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    imagePreview.classList.add('visible');
    uploadZone.style.display = 'none';
    analyzeBtn.disabled = false;
    currentEquipmentId = null;
    resultsSection.classList.remove('visible');
  };
  reader.readAsDataURL(file);
}

// ─── Analyse IA ───────────────────────────────────────────────────────
async function handleAnalyze() {
  if (currentMode === 'manual') return;

  const imgSrc = previewImg.src;
  if (!imgSrc || !imgSrc.startsWith('data:')) return;

  // Extraire base64 et media_type
  const [header, base64Data] = imgSrc.split(',');
  const mediaType = header.match(/:(.*?);/)[1];

  analyzeBtn.disabled = true;
  loadingState.classList.add('visible');
  resultsSection.classList.remove('visible');

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, media_type: mediaType })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Erreur serveur');
    }

    if (!result.identified) {
      showNotFound(result.message, result.description_visuelle);
    } else if (result.engin) {
      displayResults(result.engin, {
        confiance: result.confiance,
        description_visuelle: result.description_visuelle,
        caracteristiques_visibles: result.caracteristiques_visibles
      });
    } else {
      showAlert(`Engin identifié : "${result.nom_identifie}" mais non trouvé dans la base de données.`, 'warning');
    }
  } catch (err) {
    showAlert('Erreur lors de l\'analyse : ' + err.message, 'error');
  } finally {
    analyzeBtn.disabled = false;
    loadingState.classList.remove('visible');
  }
}

// ─── Sélection manuelle ───────────────────────────────────────────────
function renderCategoryFilters(categories) {
  if (!categoryFilter) return;
  const allBtn = document.createElement('button');
  allBtn.className = 'cat-btn active';
  allBtn.dataset.cat = 'all';
  allBtn.textContent = 'Tous';
  categoryFilter.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.dataset.cat = cat.id;
    btn.textContent = `${cat.icone} ${cat.label}`;
    categoryFilter.appendChild(btn);
  });

  categoryFilter.addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    categoryFilter.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterEquipment();
  });
}

function renderEquipmentGrid(engins) {
  if (!equipmentGrid) return;
  equipmentGrid.innerHTML = '';
  engins.forEach(engin => {
    const catLabel = getCategoryLabel(engin.categorie);
    const card = document.createElement('div');
    card.className = 'equipment-card';
    card.dataset.id = engin.id;
    card.dataset.cat = engin.categorie;
    card.innerHTML = `
      <div class="card-cat">${catLabel}</div>
      <div class="card-name">${engin.nom}</div>
      <div class="card-desc">${engin.description_courte}</div>
    `;
    card.addEventListener('click', async () => {
      equipmentGrid.querySelectorAll('.equipment-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentEquipmentId = engin.id;
      loadingState.classList.add('visible');
      resultsSection.classList.remove('visible');
      try {
        const resp = await fetch(`${API_BASE}/api/equipment/${engin.id}`);
        const fullData = await resp.json();
        displayResults(fullData);
      } catch {
        showAlert('Impossible de charger les données de cet engin.', 'error');
      } finally {
        loadingState.classList.remove('visible');
      }
    });
    equipmentGrid.appendChild(card);
  });
}

function filterEquipment() {
  if (!equipmentGrid || !equipmentData) return;
  const query = searchInput ? searchInput.value.toLowerCase() : '';
  const activeCat = categoryFilter
    ? (categoryFilter.querySelector('.cat-btn.active')?.dataset.cat || 'all')
    : 'all';

  equipmentGrid.querySelectorAll('.equipment-card').forEach(card => {
    const name = (card.querySelector('.card-name').textContent || '').toLowerCase();
    const desc = (card.querySelector('.card-desc').textContent || '').toLowerCase();
    const cat = card.dataset.cat;
    const matchSearch = !query || name.includes(query) || desc.includes(query);
    const matchCat = activeCat === 'all' || cat === activeCat;
    card.style.display = matchSearch && matchCat ? '' : 'none';
  });
}

function getCategoryLabel(catId) {
  if (!equipmentData) return catId;
  const cat = equipmentData.categories.find(c => c.id === catId);
  return cat ? `${cat.icone} ${cat.label}` : catId;
}

// ─── Affichage des résultats ─────────────────────────────────────────
function displayResults(engin, aiMeta = {}) {
  const catLabel = getCategoryLabel(engin.categorie);
  const categoryIcons = {
    terrassement: '🏗️', extraction: '⛏️', compactage: '🔄',
    transport: '🚛', revetement: '🛣️', concassage: '🪨', divers: '🔧'
  };
  const icon = categoryIcons[engin.categorie] || '🚧';

  // ─ En-tête
  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-name').textContent = engin.nom;
  document.getElementById('result-cat').textContent = catLabel;
  document.getElementById('result-models').innerHTML =
    `<strong>Modèles courants :</strong> ${(engin.modeles_courants || []).join(' · ')}`;

  // Description visuelle (IA) ou courte (base)
  const desc = aiMeta.description_visuelle || engin.description_courte;
  document.getElementById('result-description').textContent = desc;

  // Badge confiance (mode photo IA)
  const confidenceBadge = document.getElementById('result-confidence');
  if (aiMeta.confiance) {
    const confMap = {
      haute: { label: '✓ Haute confiance', cls: 'badge-success' },
      moyenne: { label: '~ Confiance moyenne', cls: 'badge-warning' },
      faible: { label: '? Faible confiance', cls: 'badge-warning' }
    };
    const c = confMap[aiMeta.confiance] || confMap.moyenne;
    confidenceBadge.textContent = c.label;
    confidenceBadge.className = `badge ${c.cls}`;
    confidenceBadge.style.display = '';
  } else {
    confidenceBadge.style.display = 'none';
  }

  // ─ Onglet Caractéristiques
  renderDataTable('tab-caracteristiques', engin.caracteristiques);

  // ─ Onglet Performances
  renderDataTable('tab-performances', engin.performances);

  // ─ Onglet Consommations
  renderConsommations(engin.consommations);

  // ─ Onglet Rendements
  renderRendements(engin.rendements);

  // ─ Onglet Applications
  renderApplications(engin.applications_routes, engin.notes_importantes);

  resultsSection.classList.add('visible');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Reset premier onglet
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="caracteristiques"]').classList.add('active');
  document.getElementById('tab-caracteristiques').classList.add('active');
}

function renderDataTable(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;
  const rows = Object.entries(data).map(([key, val]) =>
    `<tr><td>${key}</td><td>${val}</td></tr>`
  ).join('');
  container.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderConsommations(data) {
  if (!data) return;
  const container = document.getElementById('tab-consommations');

  // Cartes résumé
  const highlights = [
    { icon: '⛽', key: 'Carburant (travail moyen — référence)', label: 'Carburant travail normal', fallback: 'Carburant (travail normal)' },
    { icon: '📅', key: 'Consommation journalière (8h)', label: 'Conso. journalière (8h)', fallback: 'Consommation journalière (8h)' },
    { icon: '🔩', key: 'Lubrifiants moteur', label: 'Lubrifiants moteur', fallback: 'Lubrifiants' },
    { icon: '📊', key: 'Carburant par m³ terrassé', label: 'Par unité produite', fallback: 'Carburant par m³ extrait' }
  ];

  const cardsHTML = highlights.map(h => {
    const val = data[h.key] || data[h.fallback] || '—';
    return `<div class="conso-card">
      <span class="conso-icon">${h.icon}</span>
      <div class="conso-value">${val}</div>
      <div class="conso-label">${h.label}</div>
    </div>`;
  }).join('');

  const rows = Object.entries(data).map(([key, val]) =>
    `<tr><td>${key}</td><td>${val}</td></tr>`
  ).join('');

  container.innerHTML = `
    <div class="conso-grid">${cardsHTML}</div>
    <table class="data-table">
      <thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderRendements(data) {
  if (!data) return;
  const container = document.getElementById('tab-rendements');

  const entries = Object.entries(data);
  const maxIndex = entries.length;

  const barsHTML = entries.map(([key, val], i) => {
    const pct = Math.max(20, Math.min(95, 95 - (i / maxIndex) * 50));
    return `<div class="rendement-item">
      <div class="rendement-label">
        <span>${key}</span>
        <span>${val}</span>
      </div>
      <div class="rendement-bar">
        <div class="rendement-bar-fill" style="width: ${pct}%"></div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="rendements-bars">${barsHTML}</div>`;
}

function renderApplications(apps, notes) {
  const container = document.getElementById('tab-applications');
  if (!container) return;

  const listHTML = (apps || []).map(app =>
    `<li>${app}</li>`
  ).join('');

  const notesHTML = notes ? `
    <div class="notes-box">
      <h4>⚠️ Points importants</h4>
      <p>${notes}</p>
    </div>` : '';

  container.innerHTML = `
    <ul class="applications-list">${listHTML}</ul>
    ${notesHTML}`;
}

function showNotFound(message, description) {
  const notFound = document.createElement('div');
  notFound.className = 'not-found-box';
  notFound.innerHTML = `
    <div class="icon">🔍</div>
    <h3>Engin non reconnu</h3>
    <p>${message || 'Aucun engin de chantier n\'a pu être identifié sur cette image.'}</p>
    ${description ? `<p style="margin-top:8px;font-style:italic;color:#888">${description}</p>` : ''}`;

  const existing = document.getElementById('not-found-container');
  if (existing) existing.innerHTML = '';
  const target = document.getElementById('not-found-container') || resultsSection;
  target.innerHTML = '';
  target.appendChild(notFound);
  resultsSection.classList.add('visible');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showAlert(message, type = 'info') {
  const colors = { error: '#EF4444', warning: '#F59E0B', info: '#3B82F6', success: '#22C55E' };
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;top:80px;right:24px;background:${colors[type]};color:white;
    padding:14px 20px;border-radius:10px;font-size:0.9rem;font-weight:600;z-index:9999;
    box-shadow:0 4px 20px rgba(0,0,0,0.2);max-width:360px;animation:slideIn 0.3s ease`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ─── Navigation par onglets ───────────────────────────────────────────
function initTabNavigation() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');
  });
}
