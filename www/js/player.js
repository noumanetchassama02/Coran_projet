/* =============================================
   Coran — Moteur audio
   Lecture verset par verset, préchargement du
   verset suivant, répétition, synchronisation
   avec la lecture (callback onChange).
   Hors ligne : les versets téléchargés (IndexedDB)
   sont lus via des object URLs ; si la source est
   injoignable, un message clair est émis au lieu
   de sauter silencieusement les versets.
   ============================================= */

const Player = (() => {
  const audio = new Audio();
  audio.preload = 'auto';
  const preloader = new Audio();
  preloader.preload = 'auto';

  let state = {
    active: false,
    reciter: null,
    surah: null,
    ayahs: [],
    index: -1,
    playing: false,
    loop: false
  };

  // Callbacks : onChange(index, playing) · onEnd() · onError(message)
  let onChange = null;
  let onEnd = null;
  let onError = null;

  // Object URLs en cours d'utilisation (révoqués uniquement quand on les remplace)
  let mainUrl = null;
  let preloadUrl = null;

  function revokeMain() { if (mainUrl) { URL.revokeObjectURL(mainUrl); mainUrl = null; } }
  function revokePreload() { if (preloadUrl) { URL.revokeObjectURL(preloadUrl); preloadUrl = null; } }

  /* Source : blob téléchargé (hors ligne) sinon URL réseau */
  async function resolveSrc(reciter, surah, ayah) {
    const blob = window.Offline && (await window.Offline.getDownloadedAudio(reciter, surah, ayah));
    if (blob) return URL.createObjectURL(blob);
    return API.audioUrl(reciter, surah, ayah);
  }

  function fail(message) {
    state.playing = false;
    if (onChange) onChange(state.index, false);
    if (onError) onError(message);
  }

  async function playIndex(i) {
    if (!state.active || i < 0 || i >= state.ayahs.length) return;
    state.index = i;
    let src;
    try {
      src = await resolveSrc(state.reciter, state.surah, state.ayahs[i].numberInSurah);
    } catch (err) {
      console.warn('Source indisponible pour le verset', i + 1, err);
      fail(`Impossible de lire le verset ${i + 1} hors ligne`);
      return;
    }
    if (state.index !== i) { if (src.startsWith('blob:')) URL.revokeObjectURL(src); return; } // l'utilisateur a changé de verset
    if (audio.src !== src) {
      revokeMain();
      mainUrl = src.startsWith('blob:') ? src : null;
      audio.src = src;
    }
    try {
      await audio.play();
      state.playing = true;
      notify();
      preloadNext(i);
    } catch (err) {
      // Lecture refusée (ex. autoplay) : on n'avance pas, on attend un geste de l'utilisateur
      console.warn('Lecture refusée pour le verset', i + 1, err);
      fail(err && err.name === 'NotAllowedError'
        ? 'Lecture bloquée par le navigateur — touchez un verset pour lancer la lecture'
        : `Lecture impossible pour le verset ${i + 1}`);
    }
  }

  function preloadNext(i) {
    const n = i + 1;
    if (n >= state.ayahs.length) return;
    const a = state.ayahs[n];
    resolveSrc(state.reciter, state.surah, a.numberInSurah).then((src) => {
      if (state.index !== i) { if (src.startsWith('blob:')) URL.revokeObjectURL(src); return; }
      if (src !== preloader.src) {
        revokePreload();
        preloadUrl = src.startsWith('blob:') ? src : null;
        preloader.src = src;
      }
    }).catch(() => {});
  }

  audio.addEventListener('ended', () => {
    if (!state.active) return;
    if (state.loop) { playIndex(state.index); return; }
    if (state.index + 1 < state.ayahs.length) {
      playIndex(state.index + 1);
    } else {
      state.playing = false;
      notify();
      if (onEnd) onEnd();
    }
  });

  audio.addEventListener('error', () => {
    if (!state.active || !state.playing) return;
    // Source injoignable (hors ligne, récitateur non téléchargé…) :
    // message clair, plus de saut silencieux vers le verset suivant.
    console.warn('Erreur de lecture audio au verset', state.index + 1);
    fail(`Audio indisponible pour le verset ${state.index + 1} (hors ligne ou récitateur non téléchargé)`);
  });

  function notify() {
    if (onChange) onChange(state.index, state.playing);
  }

  /* ---------- API publique ---------- */

  function loadSurah(reciter, surah, ayahs, startIndex = 0) {
    stop();
    state = {
      active: true,
      reciter,
      surah,
      ayahs,
      index: -1,
      playing: false,
      loop: state.loop
    };
    playIndex(startIndex);
  }

  function toggle() {
    if (!state.active) return;
    if (audio.paused) {
      if (!audio.src) { playIndex(state.index < 0 ? 0 : state.index); return; }
      audio.play().then(() => { state.playing = true; notify(); }).catch(() => {});
    } else {
      audio.pause();
      state.playing = false;
      notify();
    }
  }

  function next() {
    if (!state.active) return;
    const i = Math.min(state.index + 1, state.ayahs.length - 1);
    playIndex(i);
  }

  function prev() {
    if (!state.active) return;
    // Si on a dépassé 2 s de lecture, on revient au début du verset courant
    if (audio.currentTime > 2 && state.index >= 0) {
      playIndex(state.index);
      return;
    }
    const i = Math.max(state.index - 1, 0);
    playIndex(i);
  }

  function seekTo(i) {
    if (!state.active) return;
    playIndex(Math.max(0, Math.min(i, state.ayahs.length - 1)));
  }

  function toggleLoop() {
    state.loop = !state.loop;
    return state.loop;
  }

  function stop() {
    state.active = false;
    state.playing = false;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    preloader.removeAttribute('src');
    preloader.load();
    revokeMain();
    revokePreload();
  }

  function setOnChange(cb) { onChange = cb; }
  function setOnEnd(cb) { onEnd = cb; }
  function setOnError(cb) { onError = cb; }
  function getState() { return { ...state }; }

  return { loadSurah, toggle, next, prev, seekTo, toggleLoop, stop, setOnChange, setOnEnd, setOnError, getState };
})();
