/* =============================================
   Coran — Mode hors ligne
   - Inscription du service worker (coquille PWA)
   - Téléchargement des sourates (texte + audio)
     dans IndexedDB, avec progression
   ============================================= */

const Offline = (() => {
  const DB_NAME = 'coran-offline';
  const DB_VERSION = 1;
  const ST_TEXT = 'texts';    // clé : numéro de sourate
  const ST_AUDIO = 'audio';   // clé : `reciter:surah:ayah`
  const ST_META = 'meta';     // registre des téléchargements, clé : numéro de sourate

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(ST_TEXT)) db.createObjectStore(ST_TEXT);
        if (!db.objectStoreNames.contains(ST_AUDIO)) db.createObjectStore(ST_AUDIO);
        if (!db.objectStoreNames.contains(ST_META)) db.createObjectStore(ST_META);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function tx(store, mode) {
    return openDB().then((db) => db.transaction(store, mode).objectStore(store));
  }

  function idbGet(store, key) {
    return tx(store, 'readonly').then((s) => new Promise((res, rej) => {
      const r = s.get(key);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
  }

  function idbPut(store, key, value) {
    return tx(store, 'readwrite').then((s) => new Promise((res, rej) => {
      const r = s.put(value, key);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    }));
  }

  function idbDelete(store, key) {
    return tx(store, 'readwrite').then((s) => new Promise((res, rej) => {
      const r = s.delete(key);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    }));
  }

  function idbAll(store) {
    return tx(store, 'readonly').then((s) => new Promise((res, rej) => {
      const r = s.getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => rej(r.error);
    }));
  }

  /* ---------- Lecture ---------- */
  function getDownloadedText(surahNumber) {
    return idbGet(ST_TEXT, surahNumber).then((v) => v || null);
  }

  function saveDownloadedText(surahNumber, data) {
    return idbPut(ST_TEXT, surahNumber, data);
  }

  function getDownloadedAudio(reciter, surahNumber, ayahNumber) {
    return idbGet(ST_AUDIO, `${reciter}:${surahNumber}:${ayahNumber}`).then((v) => v || null);
  }

  function getDownloadMeta(surahNumber) {
    return idbGet(ST_META, surahNumber).then((v) => v || null);
  }

  /* ---------- Téléchargement d'une sourate ---------- */
  /**
   * @param {number} surahNumber
   * @param {string} reciterId
   * @param {(loaded:number, total:number, ayah:number) => void} onProgress
   */
  async function downloadSurah(surahNumber, reciterId, onProgress) {
    const meta = await idbGet(ST_META, surahNumber);
    if (meta && meta.reciter === reciterId) return { ...meta, already: true };

    // 1) Texte (arabe + français)
    const data = await API.getSurahText(surahNumber, { force: true });
    await idbPut(ST_TEXT, surahNumber, data);

    // 2) Audio verset par verset
    const total = data.ayahs.length;
    let loaded = 0;
    let size = 0;
    for (const a of data.ayahs) {
      const url = API.audioUrl(reciterId, surahNumber, a.numberInSurah);
      const blob = await fetch(url).then((r) => {
        if (!r.ok) throw new Error(`Audio ${a.numberInSurah} : ${r.status}`);
        return r.blob();
      });
      await idbPut(ST_AUDIO, `${reciterId}:${surahNumber}:${a.numberInSurah}`, blob);
      size += blob.size;
      loaded += 1;
      if (onProgress) onProgress(loaded, total, a.numberInSurah);
    }

    const entry = {
      surah: surahNumber,
      name: data.surah.frenchName,
      arabicName: data.surah.arabicName,
      reciter: reciterId,
      ayahs: total,
      size,
      date: Date.now()
    };
    await idbPut(ST_META, surahNumber, entry);
    return entry;
  }

  /* ---------- Gestion des téléchargements ---------- */
  function listDownloads() {
    return idbAll(ST_META).then((list) => list.sort((a, b) => a.surah - b.surah));
  }

  async function deleteDownload(surahNumber) {
    const meta = await idbGet(ST_META, surahNumber);
    await idbDelete(ST_META, surahNumber);
    await idbDelete(ST_TEXT, surahNumber);
    if (meta) {
      for (let a = 1; a <= meta.ayahs; a++) {
        await idbDelete(ST_AUDIO, `${meta.reciter}:${surahNumber}:${a}`);
      }
    }
    return meta;
  }

  function storageEstimate() {
    if (navigator.storage && navigator.storage.estimate) return navigator.storage.estimate();
    return Promise.resolve({ usage: 0, quota: 0 });
  }

  /* ---------- Service worker ---------- */
  function registerSW() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.warn('Service worker non enregistré :', err);
        });
      });
    }
  }

  return {
    getDownloadedText,
    saveDownloadedText,
    getDownloadedAudio,
    getDownloadMeta,
    downloadSurah,
    listDownloads,
    deleteDownload,
    storageEstimate,
    registerSW
  };
})();

// Les scripts chargés avant offline.js (api.js, player.js) accèdent au module
// via window.Offline : `const Offline` en haut niveau ne crée pas cette propriété.
window.Offline = Offline;
