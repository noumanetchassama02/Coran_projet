/* =============================================
   Coran — Logique applicative
   Routage, vues (sourates, lecteur, recherche,
   favoris, réglages), état et persistance
   ============================================= */

/* ---------- Noms français des 114 sourates ---------- */
const FRENCH_MEANINGS = {
  1: "L'Ouverture", 2: 'La Vache', 3: "La Famille d'Imran", 4: 'Les Femmes',
  5: 'La Table servie', 6: 'Les Bestiaux', 7: 'Les Limbes', 8: 'Le Butin',
  9: 'Le Repentir', 10: 'Jonas', 11: 'Houd', 12: 'Joseph', 13: 'Le Tonnerre',
  14: 'Abraham', 15: 'Al-Hijr', 16: 'Les Abeilles', 17: 'Le Voyage nocturne',
  18: 'La Caverne', 19: 'Marie', 20: 'Ta-Ha', 21: 'Les Prophètes',
  22: 'Le Pèlerinage', 23: 'Les Croyants', 24: 'La Lumière', 25: 'Le Discernement',
  26: 'Les Poètes', 27: 'Les Fourmis', 28: 'Le Récit', 29: "L'Araignée",
  30: 'Les Romains', 31: 'Luqman', 32: 'La Prosternation', 33: 'Les Coalisés',
  34: 'Saba', 35: 'Le Créateur', 36: 'Ya-Sin', 37: 'Les Rangés', 38: 'Sad',
  39: 'Les Groupes', 40: 'Le Pardonneur', 41: 'Les Versets détaillés',
  42: 'La Consultation', 43: "L'Ornement", 44: 'La Fumée', 45: "L'Agenouillée",
  46: "Al-Ahqaf", 47: 'Muhammad', 48: 'La Victoire', 49: 'Les Appartements',
  50: 'Qaf', 51: 'Les Vents qui éparpillent', 52: 'Le Mont', 53: "L'Étoile",
  54: 'La Lune', 55: 'Le Tout Miséricordieux', 56: "L'Événement", 57: 'Le Fer',
  58: 'La Discussion', 59: "L'Exode", 60: "L'Éprouvée", 61: 'Le Rang',
  62: 'Le Vendredi', 63: 'Les Hypocrites', 64: 'La Grande Perte', 65: 'Le Divorce',
  66: "L'Interdiction", 67: 'La Royauté', 68: 'La Plume', 69: "L'Inévitable",
  70: 'Les Voies ascensionnelles', 71: 'Noé', 72: 'Les Djinns',
  73: "L'Enveloppé", 74: 'Le Revêtu d\'un manteau', 75: 'La Résurrection',
  76: "L'Homme", 77: 'Les Envoyés', 78: 'La Nouvelle',
  79: 'Les Anges qui arrachent les âmes', 80: 'Il s\'est renfrogné',
  81: "L'Obscurcissement", 82: 'La Rupture', 83: 'Les Fraudeurs',
  84: 'La Déchirure', 85: 'Les Constellations', 86: "L'Astre nocturne",
  87: 'Le Très-Haut', 88: "L'Enveloppante", 89: "L'Aube", 90: 'La Cité',
  91: 'Le Soleil', 92: 'La Nuit', 93: 'Le Jour montant', 94: "L'Épanouissement",
  95: 'Le Figuier', 96: "L'Adhérence", 97: 'La Destinée', 98: 'La Preuve',
  99: 'Le Tremblement de terre', 100: 'Les Coursiers', 101: 'Le Fracas',
  102: 'La Course aux richesses', 103: 'Le Temps', 104: 'Le Calomniateur',
  105: "L'Éléphant", 106: 'Les Qoraïch', 107: "L'Ustensile", 108: "L'Abondance",
  109: 'Les Infidèles', 110: 'Le Secours', 111: 'Les Fibres',
  112: 'Le Monothéisme pur', 113: "L'Aube naissante", 114: 'Les Hommes'
};

/* ---------- Modes d'affichage des versets ---------- */
// phonetic  → arabe + lecture phonétique (lecture en français)
// translation → arabe + traduction française
// both      → arabe + phonétique + traduction
// arabic    → arabe seul
const VERSE_MODES = [
  { id: 'phonetic', label: 'Phonétique' },
  { id: 'translation', label: 'Traduction' },
  { id: 'both', label: 'Les deux' },
  { id: 'arabic', label: 'Arabe seul' }
];

/* ---------- Identité de l'application ---------- */
const APP_VERSION = '1.0.0';
const APP_DEV = 'Dev Nooma_Tech';
const APP_YEAR = 2026;
// Coordonnées du développeur (remplacez par vos vraies coordonnées si besoin)
const APP_DEV_WHATSAPP = 'https://wa.me/22893442688';
const APP_DEV_EMAIL = 'contact@agri-togo.tg';
const APP_DEV_WEBSITE = 'https://devnooma-tech.com';
const APP_DEV_WHATSAPP_MSG = 'Salam, besoin de renseignements sur vos services de développement';

/* ---------- Icônes SVG ---------- */
const IC = {
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1.2"/><rect x="14" y="4" width="5" height="16" rx="1.2"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><rect x="4" y="4" width="2.6" height="16" rx="1"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><rect x="17.4" y="4" width="2.6" height="16" rx="1"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
};

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const AR_NUMS = '٠١٢٣٤٥٦٧٨٩';
const arNum = (n) => String(n).replace(/\d/g, (d) => AR_NUMS[+d]);

function fmtSize(bytes) {
  if (!bytes) return '0 Ko';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

let toastTimer = null;
function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

function debounce(fn, ms) {
  let id;
  return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms); };
}

/* ---------- Réglages persistés ---------- */
const Settings = {
  KEY: 'coran.settings',
  defaults: { theme: 'auto', reciter: 'Alafasy_128kbps', fontSize: 1, loop: false, verseMode: 'phonetic' },
  data: null,

  load() {
    try {
      this.data = { ...this.defaults, ...JSON.parse(localStorage.getItem(this.KEY) || '{}') };
    } catch { this.data = { ...this.defaults }; }
    this.apply();
    return this.data;
  },

  save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.data));
    this.apply();
  },

  apply() {
    const d = this.data;
    const dark = d.theme === 'dark' || (d.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.style.setProperty('--ar-size', `${(1.85 * d.fontSize).toFixed(2)}rem`);
    document.documentElement.style.setProperty('--fr-size', `${(0.95 * d.fontSize).toFixed(2)}rem`);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0B3D2E' : '#0B3D2E');
  }
};

/* ---------- Favoris ---------- */
const Favorites = {
  KEY: 'coran.favorites',
  list: [],

  load() {
    try { this.list = JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { this.list = []; }
  },

  save() { localStorage.setItem(this.KEY, JSON.stringify(this.list)); },

  isFav(surah, ayah) { return this.list.some((f) => f.surah === surah && f.ayah === ayah); },

  add(item) {
    if (!this.isFav(item.surah, item.ayah)) {
      this.list.unshift(item);
      this.save();
    }
  },

  remove(surah, ayah) {
    this.list = this.list.filter((f) => !(f.surah === surah && f.ayah === ayah));
    this.save();
  }
};

/* ---------- Reprise automatique ---------- */
const LastRead = {
  KEY: 'coran.last',
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch { return null; }
  },
  set(surah, ayah) {
    localStorage.setItem(this.KEY, JSON.stringify({ surah, ayah, ts: Date.now() }));
  }
};

/* ---------- État global ---------- */
const state = {
  tab: 'surahs',          // onglet actif (pour la barre du bas)
  surahs: [],
  current: null,          // { data, index } du lecteur
  searchTerm: '',
  downloaded: null,       // liste des téléchargements (cache)
  downloading: 0,         // sourate en cours de téléchargement
  pendingPlay: null,      // sourate à lire automatiquement après ouverture (bouton ▶)
};

const view = $('#view-root');

/* =============================================
   RENDU DES VUES
   ============================================= */

function render(html) {
  view.innerHTML = html;
}

function emptyState(icon, title, sub) {
  return `<div class="empty-state">${IC[icon] || ''}<p class="big">${esc(title)}</p>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
}

/* ---------- Sourates ---------- */
function renderSurahs(filter = '') {
  // Normalisation : minuscules, sans accents ni ponctuation, lettres doublées tolérées
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const collapse = (s) => s.replace(/(.)\1+/g, '$1');
  const qRaw = filter.trim().toLowerCase();
  const q = norm(qRaw);
  const qc = collapse(q);
  const isArabic = /[\u0600-\u06FF]/.test(qRaw);
  const items = state.surahs.filter((s) => {
    if (!q) return true;
    const fn = norm(s.frenchName);
    const mn = norm(FRENCH_MEANINGS[s.number] || '');
    return String(s.number) === qRaw ||
      (isArabic && s.arabicName.includes(filter.trim())) ||
      fn.includes(q) || mn.includes(q) ||
      collapse(fn).includes(qc) || collapse(mn).includes(qc);
  });

  render(`
    <div class="view-inner">
      <h2 class="view-title">Sourates <span class="sub">${state.surahs.length} chapitres</span></h2>
      <input type="search" class="list-search" id="surah-filter" placeholder="Filtrer par nom ou numéro…" value="${esc(filter)}" aria-label="Filtrer les sourates">
      <div class="surah-list">
        ${items.map(surahCard).join('')}
        ${items.length === 0 ? emptyState('book', 'Aucune sourate trouvée', 'Essayez un autre mot-clé') : ''}
      </div>
    </div>
  `);

  const input = $('#surah-filter');
  input.addEventListener('input', debounce(() => renderSurahs(input.value), 150));
  $$('.surah-card').forEach((el) => el.addEventListener('click', () => openSurah(Number(el.dataset.surah))));
}

function surahCard(s) {
  const downloaded = (state.downloaded || []).some((d) => d.surah === s.number);
  const rev = s.revelation ? (s.revelation === 'Meccan' ? 'Mecquoise' : 'Médinoise') : '';
  const badge = downloaded ? ` · <span class="offline-badge">${IC.check}Hors ligne</span>` : '';
  return `
    <button class="surah-card" data-surah="${s.number}">
      <span class="surah-num">${arNum(s.number)}</span>
      <span class="surah-meta">
        <span class="surah-name-ar">${esc(s.arabicName)}</span>
        <span class="surah-name-fr">${esc(s.frenchName)} · ${esc(FRENCH_MEANINGS[s.number] || '')}</span>
        <span class="surah-info">${rev}${badge}</span>
      </span>
      <span class="surah-ayahs"><strong>${arNum(s.ayahs)}</strong>versets</span>
    </button>`;
}

/* ---------- Lecteur ---------- */
async function openSurah(number, ayah = 1, fromResume = false) {
  state.current = null;
  state.opening = { number, ayah };
  location.hash = ayah > 1 ? `#/surah/${number}/${ayah}` : `#/surah/${number}`;
  setTabActive('surahs');
  render('<div class="view-inner"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>');

  let data;
  try {
    data = await API.getSurahText(number);
  } catch (err) {
    state.opening = null;
    state.pendingPlay = null;
    render(`<div class="view-inner">${emptyState('book', 'Impossible de charger cette sourate', 'Vérifiez votre connexion puis réessayez.')}
      <button class="btn-danger" id="retry" style="margin-top:.5rem">Réessayer</button></div>`);
    $('#retry').addEventListener('click', () => openSurah(number, ayah));
    return;
  }

  const index = Math.max(0, Math.min(ayah - 1, data.ayahs.length - 1));
  state.current = { data, index, openParams: { number, ayah } };
  state.opening = null;
  LastRead.set(number, data.ayahs[index].numberInSurah);
  updateResumeBtn();

  renderReader(index, false);
  const el = $(`.verse[data-index="${index}"]`);
  if (el) el.scrollIntoView({ block: 'center' });

  if (fromResume) toast(`Reprise — ${data.surah.frenchName}, verset ${index + 1}`);

  // Lecture immédiate demandée depuis le bouton ▶ des téléchargements
  if (state.pendingPlay === number) {
    state.pendingPlay = null;
    setTimeout(() => playFrom(index), 60);
  }
}

function renderReader(index, playing) {
  const { data } = state.current;
  const number = data.surah.number;
  const reciter = Settings.data.reciter;
  const loopOn = Player.getState().loop;
  const showBismillah = number !== 1 && number !== 9;

  render(`
    <div class="reader-head">
      <div class="reader-head-top">
        <button class="back-btn" id="back" aria-label="Retour aux sourates">${IC.back}</button>
        <div class="reader-title">
          <div class="ar">${esc(data.surah.arabicName)}</div>
          <div class="fr">${esc(data.surah.frenchName)} · ${esc(FRENCH_MEANINGS[number] || '')}</div>
        </div>
        <button class="reader-download" id="dl-btn" aria-label="Télécharger pour le hors ligne">${IC.download}</button>
      </div>
      <div class="reader-controls">
        <select class="reciter-select" id="reciter" aria-label="Récitateur">
          ${API.RECITERS.map((r) => `<option value="${r.id}" ${r.id === reciter ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
        </select>
        <div id="dl-progress" class="progress-track" style="display:none"><div class="progress-fill" id="dl-fill"></div></div>
        <span id="dl-label" class="download-label" hidden></span>
      </div>
      <div class="verse-mode-row">
        <span class="mode-label">Affichage :</span>
        <div class="verse-mode" role="group" aria-label="Affichage des versets">
          ${VERSE_MODES.map((m) => `<button type="button" class="mode-btn ${m.id === Settings.data.verseMode ? 'is-sel' : ''}" data-mode="${m.id}" aria-pressed="${m.id === Settings.data.verseMode}">${m.label}</button>`).join('')}
        </div>
      </div>
    </div>

    <div class="view-inner">
      ${showBismillah ? `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>${Settings.data.verseMode !== 'arabic' ? '<div class="bismillah-ph">Bismillaahir Rahmaanir Raheem</div>' : ''}` : ''}
      <div class="verse-list">
        ${data.ayahs.map((a, i) => verseCard(a, i, i === index, number)).join('')}
      </div>
    </div>

    <div class="playbar" id="playbar">
      <button class="pb-btn" id="pb-prev" aria-label="Verset précédent">${IC.prev}</button>
      <button class="pb-btn main" id="pb-toggle" aria-label="Lecture / pause">${playing ? IC.pause : IC.play}</button>
      <button class="pb-btn" id="pb-next" aria-label="Verset suivant">${IC.next}</button>
      <button class="pb-btn loop ${loopOn ? 'is-on' : ''}" id="pb-loop" aria-label="Répéter le verset">${IC.repeat}</button>
      <div class="pb-progress"><i id="pb-fill"></i></div>
      <span class="pos" id="pb-pos"></span>
    </div>
  `);

  bindReaderEvents();
  updatePlaybar(index, playing);
  refreshDownloadState(number);

  const target = $(`.verse[data-index="${index}"]`);
  if (target) target.scrollIntoView({ block: 'center' });
}

function verseCard(a, i, isCurrent, surahNumber) {
  const fav = Favorites.isFav(surahNumber, a.numberInSurah);
  const mode = Settings.data.verseMode;
  const showPh = (mode === 'phonetic' || mode === 'both') && a.phonetic;
  const showFr = (mode === 'translation' || mode === 'both') && a.french;
  return `
    <article class="verse ${isCurrent ? 'is-current' : ''}" data-index="${i}" data-surah="${surahNumber}" data-ayah="${a.numberInSurah}">
      <button class="verse-fav ${fav ? 'is-fav' : ''}" data-fav="${i}" aria-label="${fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}" aria-pressed="${fav}">${fav ? IC.star : IC.starOutline}</button>
      <span class="verse-num">${arNum(a.numberInSurah)}</span>
      <p class="verse-ar" dir="rtl">${esc(a.arabic)}</p>
      ${showPh ? `<p class="verse-ph">${esc(a.phonetic)}</p>` : ''}
      ${showFr ? `<p class="verse-fr">${esc(a.french)}</p>` : ''}
    </article>`;
}

function bindReaderEvents() {
  $('#back').addEventListener('click', () => { goTo('surahs'); });

  $('#reciter').addEventListener('change', (e) => {
    Settings.data.reciter = e.target.value;
    Settings.save();
    const st = Player.getState();
    if (st.active) Player.seekTo(state.current.index);
    else toast('Récitateur mis à jour');
  });

  $$('.mode-btn').forEach((b) => b.addEventListener('click', () => {
    Settings.data.verseMode = b.dataset.mode;
    Settings.save();
    renderReader(state.current.index, Player.getState().playing);
  }));

  $('#dl-btn').addEventListener('click', toggleDownload);

  $$('.verse').forEach((v) => {
    v.addEventListener('click', (e) => {
      if (e.target.closest('.verse-fav')) return;
      playFrom(Number(v.dataset.index));
    });
  });

  $$('.verse-fav').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFav(Number(b.dataset.fav));
  }));

  $('#pb-toggle').addEventListener('click', () => {
    if (!Player.getState().active) { playFrom(state.current.index); return; }
    Player.toggle();
  });
  $('#pb-prev').addEventListener('click', () => {
    if (!Player.getState().active) { playFrom(Math.max(0, state.current.index - 1)); return; }
    Player.prev();
  });
  $('#pb-next').addEventListener('click', () => {
    if (!Player.getState().active) { playFrom(Math.min(state.current.index + 1, state.current.data.ayahs.length - 1)); return; }
    Player.next();
  });
  $('#pb-loop').addEventListener('click', () => {
    const on = Player.toggleLoop();
    $('#pb-loop').classList.toggle('is-on', on);
    toast(on ? 'Répétition activée' : 'Répétition désactivée');
  });
}

/* ---------- Lecture ---------- */

/**
 * Récitateur effectif pour une sourate : hors ligne, si le récitateur
 * sélectionné n'a pas été téléchargé mais qu'un autre l'a été, on bascule
 * automatiquement sur celui-ci (sinon la lecture échouerait).
 */
async function resolveEffectiveReciter(surahNumber) {
  const preferred = Settings.data.reciter;
  const meta = (state.downloaded || []).find((d) => d.surah === surahNumber);
  if (!meta || meta.reciter === preferred) return preferred;
  const hasPreferred = await Offline.getDownloadedAudio(preferred, surahNumber, 1)
    .then((b) => Boolean(b)).catch(() => false);
  if (!hasPreferred && !navigator.onLine) {
    Settings.data.reciter = meta.reciter;
    Settings.save();
    toast(`Hors ligne : lecture avec ${API.getReciter(meta.reciter).name}`);
    return meta.reciter;
  }
  return preferred;
}

async function playFrom(index) {
  const { data } = state.current;
  if (!data || !data.ayahs || !data.ayahs.length) return;
  const reciter = await resolveEffectiveReciter(data.surah.number);
  const sel = $('#reciter');
  if (sel && sel.value !== reciter) sel.value = reciter;
  Player.loadSurah(reciter, data.surah.number, data.ayahs, index);
}

/* ---------- Ouverture depuis la liste des téléchargements ---------- */
/** Ouvre une sourate téléchargée (texte depuis IndexedDB) et, si demandé,
 *  lance immédiatement la lecture (bouton ▶). Fonctionne hors ligne. */
async function openDownloadedSurah(surahNumber, autoplay) {
  if (!(state.downloaded || []).some((d) => d.surah === surahNumber)) return;
  if (autoplay) await resolveEffectiveReciter(surahNumber);
  state.pendingPlay = autoplay ? surahNumber : null;
  openSurah(surahNumber, 1);
}

function updatePlaybar(index, playing) {
  const { data } = state.current;
  if (!data) return;
  const fill = $('#pb-fill');
  const pos = $('#pb-pos');
  const toggle = $('#pb-toggle');
  if (fill) fill.style.width = `${((index + 1) / data.ayahs.length) * 100}%`;
  if (pos) pos.textContent = `${data.surah.number}:${data.ayahs[index].numberInSurah}`;
  if (toggle) toggle.innerHTML = playing ? IC.pause : IC.play;
}

function highlightVerse(index, scroll) {
  const { data } = state.current;
  if (!data) return;
  const cur = $(`.verse.is-current`);
  if (cur) cur.classList.remove('is-current');
  const next = $(`.verse[data-index="${index}"]`);
  if (next) {
    next.classList.add('is-current');
    if (scroll) next.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  LastRead.set(data.surah.number, data.ayahs[index].numberInSurah);
  updateResumeBtn();
  updatePlaybar(index, Player.getState().playing);
}

/* ---------- Favoris ---------- */
function toggleFav(i) {
  const { data } = state.current;
  const a = data.ayahs[i];
  const fav = Favorites.isFav(data.surah.number, a.numberInSurah);
  if (fav) {
    Favorites.remove(data.surah.number, a.numberInSurah);
    toast('Retiré des favoris');
  } else {
    Favorites.add({
      surah: data.surah.number,
      surahName: data.surah.frenchName,
      ayah: a.numberInSurah,
      arabic: a.arabic,
      phonetic: a.phonetic || '',
      french: a.french,
      ts: Date.now()
    });
    toast('Ajouté aux favoris ⭐');
  }
  const btn = $(`.verse-fav[data-fav="${i}"]`);
  if (btn) {
    const nowFav = Favorites.isFav(data.surah.number, a.numberInSurah);
    btn.classList.toggle('is-fav', nowFav);
    btn.setAttribute('aria-pressed', String(nowFav));
    btn.innerHTML = nowFav ? IC.star : IC.starOutline;
  }
}

function renderFavorites() {
  const list = Favorites.list;
  render(`
    <div class="view-inner">
      <h2 class="view-title">Favoris <span class="sub">${list.length}</span></h2>
      ${list.length === 0
        ? emptyState('starOutline', 'Aucun favori', 'Touchez l’étoile d’un verset pour le retrouver ici')
        : `<div class="fav-list">${list.map(favCard).join('')}</div>`}
    </div>
  `);
  $$('.fav-card').forEach((el) => el.addEventListener('click', () => openSurah(Number(el.dataset.surah), Number(el.dataset.ayah))));
  $$('.fav-remove').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const { surah, ayah } = b.dataset;
    Favorites.remove(Number(surah), Number(ayah));
    renderFavorites();
    toast('Favori supprimé');
  }));
}

function favCard(f) {
  return `
    <button class="fav-card" data-surah="${f.surah}" data-ayah="${f.ayah}">
      <div class="fav-body">
        <p class="fav-ar" dir="rtl">${esc(f.arabic)}</p>
        ${f.phonetic ? `<p class="fav-ph">${esc(f.phonetic)}</p>` : ''}
        <p class="fav-fr">${esc(f.french)}</p>
        <span class="fav-ref">${f.surahName} — verset ${f.ayah}</span>
      </div>
      <span class="fav-remove" data-surah="${f.surah}" data-ayah="${f.ayah}" role="button" aria-label="Supprimer">${IC.trash}</span>
    </button>`;
}

/* ---------- Recherche ---------- */
function renderSearch() {
  render(`
    <div class="view-inner">
      <h2 class="view-title">Recherche</h2>
      <input type="search" class="search-input" id="search-input" placeholder="Rechercher un mot dans le Coran… (ex. : lumière, miséricorde)" value="${esc(state.searchTerm)}" aria-label="Rechercher dans le Coran">
      <p class="search-hint" id="search-hint">Recherche dans la traduction française (Hamidullah)</p>
      <div id="search-results"></div>
    </div>
  `);

  const input = $('#search-input');
  const results = $('#search-results');

  const run = debounce(async () => {
    const q = input.value.trim();
    state.searchTerm = q;
    if (q.length < 3) {
      results.innerHTML = emptyState('search', 'Tapez au moins 3 lettres', 'Exemples : lumière, miséricorde, patience');
      return;
    }
    results.innerHTML = '<div class="spinner"></div>';
    try {
      const data = await API.search(q);
      if (q !== input.value.trim()) return; // réponse obsolète
      if (data.count === 0) {
        results.innerHTML = emptyState('search', 'Aucun résultat', 'Essayez un autre mot');
        return;
      }
      $('#search-hint').textContent = `${data.count} résultat${data.count > 1 ? 's' : ''} pour « ${q} »`;
      results.innerHTML = `<div class="search-results">${data.matches.map(resultCard).join('')}</div>`;
      $$('.result-card').forEach((el) => el.addEventListener('click', () => openSurah(Number(el.dataset.surah), Number(el.dataset.ayah))));
    } catch {
      results.innerHTML = emptyState('search', 'Erreur de recherche', 'Vérifiez votre connexion');
    }
  }, 450);

  input.addEventListener('input', run);
  input.focus();
}

function resultCard(m) {
  return `
    <button class="result-card" data-surah="${m.surah}" data-ayah="${m.numberInSurah}">
      <p class="result-text">« ${esc(m.text)} »</p>
      <span class="result-ref">${esc(m.surahName)} — verset ${m.numberInSurah}</span>
    </button>`;
}

/* ---------- Réglages ---------- */
function renderSettings() {
  const d = Settings.data;
  const themeLabels = { light: 'Clair', dark: 'Sombre', auto: 'Auto' };
  render(`
    <div class="view-inner">
      <h2 class="view-title">Réglages</h2>

      <section class="settings-section">
        <h3>Apparence</h3>
        <div class="set-row">
          <div><div class="label">Thème</div><div class="desc">Suit l’appareil en mode Auto</div></div>
          <div class="font-size-control">
            ${['light', 'dark', 'auto'].map((t) => `
              <button data-theme-val="${t}" class="theme-btn ${d.theme === t ? 'is-sel' : ''}" style="font-size:.78rem;border-color:${d.theme === t ? 'var(--gold)' : 'var(--border)'}">${themeLabels[t]}</button>`).join('')}
          </div>
        </div>
        <div class="set-row">
          <div><div class="label">Taille du texte</div><div class="desc">Ajuste l’arabe et la traduction</div></div>
          <div class="font-size-control">
            <button id="fs-down" aria-label="Réduire la taille">A−</button>
            <span class="val">${Math.round(d.fontSize * 100)}%</span>
            <button id="fs-up" aria-label="Augmenter la taille">A+</button>
          </div>
        </div>
      </section>

      <section class="settings-section">
        <h3>Lecture</h3>
        <div class="set-row">
          <div><div class="label">Récitateur par défaut</div></div>
          <select id="set-reciter" aria-label="Récitateur par défaut">
            ${API.RECITERS.map((r) => `<option value="${r.id}" ${r.id === d.reciter ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
          </select>
        </div>
        <div class="set-row">
          <div><div class="label">Répéter le verset</div><div class="desc">Rejoue le verset courant en boucle</div></div>
          <label class="switch"><input type="checkbox" id="set-loop" ${Player.getState().loop ? 'checked' : ''}><span class="track"></span></label>
        </div>
        <div class="set-row">
          <div><div class="label">Affichage des versets</div><div class="desc">La lecture phonétique aide à réciter sans connaître l’arabe</div></div>
          <div class="font-size-control">
            ${VERSE_MODES.map((m) => `<button data-mode-val="${m.id}" class="theme-btn ${d.verseMode === m.id ? 'is-sel' : ''}" style="font-size:.72rem;border-color:${d.verseMode === m.id ? 'var(--gold)' : 'var(--border)'}">${m.label}</button>`).join('')}
          </div>
        </div>
      </section>

      <section class="settings-section">
        <h3>Hors ligne</h3>
        <div class="set-row">
          <div><div class="label">Espace utilisé</div><div class="desc" id="storage-desc">Calcul…</div></div>
        </div>
        <div class="dl-list" id="dl-list"></div>
      </section>

      <section class="settings-section">
        <h3>Données</h3>
        <button class="btn-danger" id="reset-all">Tout réinitialiser (favoris, réglages, téléchargements)</button>
      </section>

      <section class="settings-section">
        <h3>À propos</h3>
        <div class="about-brand">
          <img src="icons/icon-192.png" alt="Logo de l'application Coran" width="46" height="46" class="about-logo">
          <div class="about-brand-text">
            <div class="about-app">Application Coran <span class="badge-version">v${APP_VERSION}</span></div>
            <div class="about-dev">Développée par <a class="dev-link" href="mailto:${APP_DEV_EMAIL}">${esc(APP_DEV)}</a></div>
          </div>
        </div>
        <p class="about-note">
          Application de lecture, d’écoute et de mémorisation du Coran.
          Texte arabe et traduction française de Muhammad Hamidullah (API alquran.cloud),
          récitations audio de everyayah.com. Fonctionne hors ligne après téléchargement
          des sourates. Gratuite, sans publicité ni compte.
        </p>
        <div class="about-credit">© ${APP_YEAR} ${esc(APP_DEV)} — Tous droits réservés</div>
      </section>
    </div>
  `);

  $$('.theme-btn').forEach((b) => b.addEventListener('click', () => {
    Settings.data.theme = b.dataset.themeVal;
    Settings.save();
    renderSettings();
  }));

  $('#fs-down').addEventListener('click', () => {
    Settings.data.fontSize = Math.max(0.7, +(Settings.data.fontSize - 0.1).toFixed(1));
    Settings.save();
    renderSettings();
  });
  $('#fs-up').addEventListener('click', () => {
    Settings.data.fontSize = Math.min(1.5, +(Settings.data.fontSize + 0.1).toFixed(1));
    Settings.save();
    renderSettings();
  });

  $('#set-reciter').addEventListener('change', (e) => {
    Settings.data.reciter = e.target.value;
    Settings.save();
    toast('Récitateur par défaut mis à jour');
  });

  $('#set-loop').addEventListener('change', (e) => {
    // Si un lecteur est actif, on applique immédiatement
    if (Player.getState().active) {
      const st = Player.getState();
      if (st.loop !== e.target.checked) Player.toggleLoop();
    }
  });

  $$('[data-mode-val]').forEach((b) => b.addEventListener('click', () => {
    Settings.data.verseMode = b.dataset.modeVal;
    Settings.save();
    renderSettings();
  }));

  $('#reset-all').addEventListener('click', async () => {
    if (!confirm('Effacer tous les favoris, réglages et téléchargements ?')) return;
    localStorage.removeItem(Favorites.KEY);
    localStorage.removeItem(Settings.KEY);
    localStorage.removeItem(LastRead.KEY);
    Player.stop();
    await Offline.listDownloads().then((list) => Promise.all(list.map((d) => Offline.deleteDownload(d.surah))));
    if (navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      if (window.caches) { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); }
    }
    location.hash = '#surahs';
    location.reload();
  });

  refreshDownloadsList();
}

async function refreshDownloadsList() {
  const list = await Offline.listDownloads();
  state.downloaded = list;
  const est = await Offline.storageEstimate();
  const el = $('#storage-desc');
  if (el) el.textContent = `${fmtSize(est.usage || 0)} utilisés${est.quota ? ` sur ${fmtSize(est.quota)}` : ''}`;

  const box = $('#dl-list');
  if (!box) return;
  if (list.length === 0) {
    box.innerHTML = '<p class="about-note" style="padding-top:0">Aucune sourate téléchargée. Ouvrez une sourate et touchez l’icône de téléchargement pour l’écouter hors ligne.</p>';
    return;
  }
  box.innerHTML = list.map((d) => {
    const rec = API.getReciter(d.reciter);
    return `
    <div class="dl-item" data-surah="${d.surah}" role="button" tabindex="0" aria-label="Ouvrir ${esc(d.name)}">
      <button class="dl-play" data-play="${d.surah}" aria-label="Écouter ${esc(d.name)} immédiatement">${IC.play}</button>
      <span class="dl-info">
        <span class="dl-name">${d.surah}. ${esc(d.name)}</span>
        <span class="dl-sub">${esc(rec.name)} · ${fmtSize(d.size)}</span>
      </span>
      <span class="dl-date">${fmtDate(d.date)}</span>
      <button class="dl-del" data-surah="${d.surah}" aria-label="Supprimer le téléchargement">${IC.trash}</button>
    </div>`;
  }).join('');

  $$('.dl-play').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    openDownloadedSurah(Number(b.dataset.play), true);
  }));

  $$('.dl-item').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.dl-del') || e.target.closest('.dl-play')) return;
      openDownloadedSurah(Number(el.dataset.surah), false);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDownloadedSurah(Number(el.dataset.surah), false);
      }
    });
  });

  $$('.dl-del').forEach((b) => b.addEventListener('click', async (e) => {
    e.stopPropagation();
    await Offline.deleteDownload(Number(b.dataset.surah));
    toast('Sourate supprimée des téléchargements');
    refreshDownloadsList();
    if (state.current && state.current.data.surah.number === Number(b.dataset.surah)) refreshDownloadState(state.current.data.surah.number);
  }));
}

/* ---------- Téléchargement hors ligne ---------- */
async function toggleDownload() {
  if (state.downloading) { toast('Un téléchargement est déjà en cours…'); return; }
  const { data } = state.current;
  const n = data.surah.number;
  const reciter = Settings.data.reciter;

  // Déjà téléchargé ? → supprimer
  const meta = (state.downloaded || []).find((d) => d.surah === n);
  if (meta) {
    await Offline.deleteDownload(n);
    toast('Téléchargement supprimé');
    refreshDownloadState(n);
    refreshDownloadsList();
    return;
  }

  const btn = $('#dl-btn');
  const track = $('#dl-progress');
  const label = $('#dl-label');
  btn.classList.add('is-busy');
  track.style.display = 'block';
  label.hidden = false;
  state.downloading = n;
  label.textContent = 'Préparation…';

  try {
    await Offline.downloadSurah(n, reciter, (loaded, total) => {
      $('#dl-fill').style.width = `${(loaded / total) * 100}%`;
      label.textContent = `${loaded}/${total} versets`;
    });
    toast(`« ${data.surah.frenchName} » disponible hors ligne ✅`);
    await refreshDownloadsList();
  } catch (err) {
    toast('Téléchargement interrompu (vérifiez la connexion)');
    console.error(err);
  } finally {
    state.downloading = 0;
    btn.classList.remove('is-busy');
    track.style.display = 'none';
    label.hidden = true;
    refreshDownloadState(n);
  }
}

async function refreshDownloadState(n) {
  if (!state.downloaded) state.downloaded = await Offline.listDownloads();
  const meta = state.downloaded.find((d) => d.surah === n);
  const btn = $('#dl-btn');
  if (!btn) return;
  btn.classList.toggle('done', Boolean(meta));
  btn.setAttribute('aria-label', meta ? 'Supprimer le téléchargement hors ligne' : 'Télécharger pour le hors ligne');
  btn.innerHTML = meta ? IC.check : IC.download;
}

/* =============================================
   ROUTAGE & NAVIGATION
   ============================================= */

function setTabActive(tab) {
  state.tab = tab;
  $$('.tab-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
}

function goTo(tab) {
  if (tab === 'surahs') location.hash = '#surahs';
  else if (tab === 'search') location.hash = '#search';
  else if (tab === 'favorites') location.hash = '#favorites';
  else if (tab === 'settings') location.hash = '#settings';
}

function route() {
  const h = location.hash || '#surahs';

  const m = h.match(/^#\/surah\/(\d+)(?:\/(\d+))?/);
  if (m) {
    setTabActive('surahs');
    const num = Number(m[1]);
    const ayah = m[2] ? Number(m[2]) : 1;
    const cur = state.current;
    const opening = state.opening && state.opening.number === num && state.opening.ayah === ayah;
    const same = opening || (cur && cur.openParams && cur.openParams.number === num && cur.openParams.ayah === ayah);
    if (!same) openSurah(num, ayah);
    return;
  }

  if (h === '#search') { setTabActive('search'); renderSearch(); return; }
  if (h === '#favorites') { setTabActive('favorites'); renderFavorites(); return; }
  if (h === '#settings') { setTabActive('settings'); renderSettings(); return; }

  // #surahs (défaut)
  setTabActive('surahs');
  renderSurahs();
}

/* ---------- Reprise ---------- */
function updateResumeBtn() {
  const btn = $('#resume-btn');
  const last = LastRead.get();
  const fresh = last && last.ts > Date.now() - 7 * 24 * 3600 * 1000;
  btn.hidden = !fresh;
  if (fresh && !btn.dataset.bound) {
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const l = LastRead.get();
      if (l) openSurah(l.surah, l.ayah, true);
    });
  }
}

/* ---------- État réseau ---------- */
function wireNetwork() {
  const show = (online) => toast(online ? 'De retour en ligne' : 'Hors ligne — seuls les contenus téléchargés sont disponibles', 3200);
  window.addEventListener('online', () => show(true));
  window.addEventListener('offline', () => show(false));
}

/* =============================================
   INITIALISATION
   ============================================= */

async function init() {
  Settings.load();
  Favorites.load();
  Offline.registerSW();
  wireNetwork();

  $$('.tab-btn').forEach((b) => b.addEventListener('click', () => goTo(b.dataset.tab)));

  // Callbacks du lecteur
  Player.setOnChange((index, playing) => {
    if (!state.current) return;
    state.current.index = index;
    highlightVerse(index, playing);
  });
  Player.setOnEnd(() => { updatePlaybar(state.current.index, false); });
  Player.setOnError((msg) => {
    toast(msg, 3800);
    if (state.current) updatePlaybar(state.current.index, false);
  });

  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', () => {
    if (state.current) {
      LastRead.set(state.current.data.surah.number, state.current.data.ayahs[state.current.index].numberInSurah);
    }
  });

  updateResumeBtn();

  // Téléchargements (badges sur la liste des sourates, lecture hors ligne)
  state.downloaded = await Offline.listDownloads().catch(() => []);

  try {
    state.surahs = await API.getSurahs();
  } catch {
    // Hors ligne : on affiche au moins les sourates téléchargées
    state.surahs = state.downloaded.map((d) => ({
      number: d.surah,
      arabicName: d.arabicName,
      frenchName: d.name,
      meaning: '',
      revelation: '',
      ayahs: d.ayahs
    }));
    if (state.surahs.length) toast(`${state.surahs.length} sourate${state.surahs.length > 1 ? 's' : ''} disponible${state.surahs.length > 1 ? 's' : ''} hors ligne`, 3200);
    else toast('Connexion requise pour charger les sourates', 3500);
  }

  route();
}

document.addEventListener('DOMContentLoaded', init);
