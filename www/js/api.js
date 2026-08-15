/* =============================================
   Coran — Couche de données (API alquran.cloud)
   Texte arabe + traduction française, recherche,
   audio verset par verset (everyayah.com)
   ============================================= */

const API = (() => {
  const BASE = 'https://api.alquran.cloud/v1';

  // Récitateurs disponibles (dossiers everyayah.com vérifiés)
  const RECITERS = [
    { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
    { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi' },
    { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)' },
    { id: 'Hudhaify_128kbps', name: 'Ali Al-Hudhayfi' },
    { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'Abu Bakr Ash-Shaatree' }
  ];

  // Cache mémoire
  const cache = new Map();

  function normalizeQuery(q) {
    return q.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  async function getJSON(url) {
    const res = await fetch(url);
    if (res.status === 404) {
      // L'API renvoie 404 quand la recherche ne trouve rien (corps JSON valide)
      try { return await res.json(); } catch { return { code: 404 }; }
    }
    if (!res.ok) throw new Error(`Erreur réseau (${res.status})`);
    return res.json();
  }

  /* ---------- Liste des 114 sourates ---------- */
  async function getSurahs(force) {
    if (cache.has('surahs') && !force) return cache.get('surahs');
    const d = await getJSON(`${BASE}/surah`);
    const surahs = d.data.map((s) => ({
      number: s.number,
      arabicName: s.name,
      frenchName: s.englishName,
      meaning: s.englishNameTranslation,
      revelation: s.revelationType,
      ayahs: s.numberOfAyahs
    }));
    cache.set('surahs', surahs);
    return surahs;
  }

  /* ---------- Texte d'une sourate (arabe + phonétique + français) ---------- */
  async function getSurahText(surahNumber, opts = {}) {
    const key = `surah:${surahNumber}`;
    if (cache.has(key) && !opts.force) return cache.get(key);

    // 1) Version téléchargée hors ligne (IndexedDB) ?
    const offline = window.Offline && (await window.Offline.getDownloadedText(surahNumber));
    if (offline && !opts.force) {
      // Ancien téléchargement sans phonétique → on la complète (et on la repersiste)
      if (!offline.ayahs[0] || !offline.ayahs[0].phonetic) {
        try {
          const tr = await getJSON(`${BASE}/surah/${surahNumber}/en.transliteration`);
          offline.ayahs.forEach((a, i) => { a.phonetic = tr.data.ayahs[i].text; });
          if (window.Offline && window.Offline.saveDownloadedText) {
            window.Offline.saveDownloadedText(surahNumber, offline).catch(() => {});
          }
        } catch { /* hors ligne : on garde ce qui existe */ }
      }
      cache.set(key, offline);
      return offline;
    }

    // 2) API en ligne (arabe + phonétique + traduction française)
    const [ar, fr, tr] = await Promise.all([
      getJSON(`${BASE}/surah/${surahNumber}`),
      getJSON(`${BASE}/surah/${surahNumber}/fr.hamidullah`),
      getJSON(`${BASE}/surah/${surahNumber}/en.transliteration`)
    ]);
    const data = {
      surah: {
        number: ar.data.number,
        arabicName: ar.data.name,
        frenchName: ar.data.englishName,
        meaning: ar.data.englishNameTranslation,
        revelation: ar.data.revelationType,
        ayahs: ar.data.numberOfAyahs
      },
      ayahs: ar.data.ayahs.map((a, i) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        phonetic: tr.data.ayahs[i].text,
        french: fr.data.ayahs[i].text
      }))
    };
    cache.set(key, data);
    return data;
  }

  /* ---------- Recherche plein texte (traduction française) ---------- */
  async function search(query) {
    const q = normalizeQuery(query);
    if (!q) return { count: 0, matches: [] };
    const url = `${BASE}/search/${encodeURIComponent(q)}/all/fr.hamidullah`;
    const d = await getJSON(url);
    if (!d.data || typeof d.data === 'string') return { count: 0, matches: [] };
    return {
      count: d.data.count,
      matches: d.data.matches.map((m) => ({
        number: m.number,                 // verset global
        numberInSurah: m.numberInSurah,   // numéro dans la sourate
        surah: m.surah.number,
        surahName: m.surah.englishName,
        arabicName: m.surah.name,
        text: m.text
      }))
    };
  }

  /* ---------- Audio ---------- */
  function pad3(n) { return String(n).padStart(3, '0'); }

  function audioUrl(reciterId, surahNumber, ayahNumber) {
    return `https://everyayah.com/data/${reciterId}/${pad3(surahNumber)}${pad3(ayahNumber)}.mp3`;
  }

  function getReciter(id) {
    return RECITERS.find((r) => r.id === id) || RECITERS[0];
  }

  return { RECITERS, getSurahs, getSurahText, search, audioUrl, getReciter };
})();
