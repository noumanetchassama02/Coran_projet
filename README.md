# 📖 Coran — Application de lecture, écoute & mémorisation

Application web mobile (PWA) développée à partir du **cahier des charges « Application mobile de récitation du Coran »**.

Elle se lit comme une application native : installable sur l'écran d'accueil (Android & iOS), fonctionne **hors ligne**, et couvre **100 % des fonctionnalités MVP** du cahier des charges.

Développée par **Dev Nooma_Tech** — version `1.0.0`. **APK Android disponible : `dist/Coran-v1.0.0-debug.apk`** (voir `BUILD_ANDROID.md`). L'identité (nom du développeur, version, copyright) est affichée dans **Réglages → À propos**, avec le nom et des boutons **WhatsApp / email / site web** cliquables (coordonnées modifiables dans les constantes `APP_DEV_WHATSAPP` / `APP_DEV_EMAIL` / `APP_DEV_WEBSITE` de `www/js/app.js`).

---

## ✅ Fonctionnalités MVP (conformes au cahier des charges)

| Cahier des charges | Implémentation |
|---|---|
| 114 sourates | Liste complète : nom arabe, translittération, sens en français, nombre de versets, type (mecquoise/médinoise), filtre par nom/numéro |
| Plusieurs récitateurs | 6 récitateurs (Alafasy, Al-Husary, El-Minshawi, Abdul Basit, Al-Hudhayfi, Ash-Shaatree) |
| Lecture audio | Lecture verset par verset (qualité 128 kbps), boutons précédent/suivant, répétition d'un verset |
| Lecture synchronisée | Le verset en cours de récitation est surligné et défile automatiquement dans la page |
| Lecture phonétique | Chaque verset s'écrit aussi en lettres latines pour réciter sans connaître l'arabe (ex. « Bismillaahir Rahmaanir Raheem ») ; affichage au choix : Phonétique / Traduction / Les deux / Arabe seul |
| Téléchargement hors ligne | Téléchargement d'une sourate complète (texte + audio) avec barre de progression ; lecture depuis le stockage local sans connexion |
| Recherche | Recherche plein texte dans la traduction française (36 résultats pour « lumière »…) + recherche de sourates |
| Favoris | Marquer/retirer des versets (étoile), liste des favoris, navigation directe |
| Reprise automatique | La dernière position (sourate + verset) est mémorisée ; bouton « Reprendre » + reprise au clic |
| Mode sombre | Thème clair / sombre / automatique (suit l'appareil) |
| UX/UI | Design épuré, typographie arabe lisible (Amiri, Scheherazade New), navigation par onglets, accessibilité (ARIA, focus, réduction des animations) |

## 🚀 Fonctionnalités avancées (pistes — hors MVP)

- Explication des versets (IA), règles de tajwid, mode répétition/mémorisation
- Statistiques de lecture, rappels de lecture
- Horaires de prière, boussole Qibla, calendrier hégirien, tasbih
- Traductions multilingues (le moteur supporte déjà plusieurs éditions de l'API)

---

## 🛠️ Technologie

- **HTML / CSS / JavaScript** (aucune dépendance, aucune compilation)
- **API [alquran.cloud](https://alquran.cloud)** : texte arabe (Uthmani) + translittération (`en.transliteration`) + traduction française de Muhammad Hamidullah + recherche
- **Audio : [everyayah.com](https://everyayah.com)** : récitations verset par verset (128 kbps)
- **PWA** : `manifest.webmanifest` + `sw.js` (service worker) → installation, mode hors ligne
- **Stockage local** : `localStorage` (réglages, favoris, dernière position) + **IndexedDB** (sourates téléchargées : texte + audio)

## 📂 Structure du projet

```
quran-app/
├── www/                  # Application web (copiée telle quelle dans l'APK Android)
│   ├── index.html            # Coquille (en-tête, onglets, lecteur)
│   ├── css/style.css         # Design épuré, mode sombre, responsive
│   ├── js/
│   │   ├── api.js            # Couche de données (API Coran, audio, récitateurs, cache)
│   │   ├── player.js         # Moteur audio : lecture synchronisée, préchargement
│   │   ├── offline.js        # Service worker + IndexedDB (téléchargements hors ligne)
│   │   └── app.js            # Logique : routage, vues, favoris, recherche, réglages
│   ├── sw.js                 # Service worker (coquille + cache API)
│   ├── manifest.webmanifest  # Manifeste PWA
│   └── icons/                # Icônes PWA
├── package.json          # Dépendances Capacitor + scripts de build
├── capacitor.config.json # Configuration Capacitor (appId, webDir…)
├── android-icons/        # Icônes natives Android prêtes à copier (mipmaps)
├── tools/gen_icons.py    # Générateur d'icônes (Python pur)
├── README.md             # Ce document
└── BUILD_ANDROID.md      # Guide complet de création de l'APK/AAB
```

## 🤖 Application Android (APK / AAB)

Le projet est prêt pour **Capacitor** : l'APK Android se construit avec quelques commandes
(prérequis : Node.js, JDK 21, SDK Android).

👉 **Guide complet : [`BUILD_ANDROID.md`](BUILD_ANDROID.md)**

## ▶️ Lancement

```bash
cd quran-app
python -m http.server 8000        # puis ouvrir http://localhost:8000
```

> Le service worker nécessite un serveur HTTP (localhost ou HTTPS). Ouvrir le fichier directement (`file://`) ne permet pas le mode hors ligne.

## 📲 Installation sur téléphone

1. Ouvrir l'URL dans Chrome/Edge (Android) ou Safari (iOS).
2. **Android** : menu ⋮ → « Ajouter à l'écran d'accueil » / « Installer l'application ».
3. **iOS** : Partager → « Sur l'écran d'accueil ».
4. L'application s'ouvre en plein écran, sans barre de navigateur, avec son icône.

## 🔌 Sources & droits

- Texte arabe et traduction : **alquran.cloud** (API publique gratuite)
- Récitations : **everyayah.com** (fichiers audio publics gratuits)
- Polices arabes : **Amiri** et **Scheherazade New** (Google Fonts, licence OFL)
- Application gratuite, sans publicité, sans compte.

## 🗺️ Feuille de route

1. **Portage Flutter** (comme prévu au cahier des charges) : l'architecture JS (couche API/lecteur/stockage) se transpose directement ; l'audio et le texte viennent des mêmes sources.
2. **Packaging Android** (APK/AAB) via Capacitor (embarque cette PWA dans une WebView native) ou Flutter.
3. Fonctionnalités avancées ci-dessus + défi de mémorisation et communauté.

---

*Documentation générée dans le cadre du projet — voir `Cahier_des_charges_Application_Coran.pdf`.*
