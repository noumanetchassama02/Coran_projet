# 📱 Construire l'APK / l'AAB Android (Capacitor)

Ce guide explique comment transformer l'application web (`www/`) en application Android installable, conformément au cahier des charges (livrable : code source + APK/AAB).

---

## 1. Prérequis (à installer une seule fois)

| Outil | Version requise | Pourquoi |
|---|---|---|
| **Node.js + npm** | 20 ou plus (LTS) | CLI Capacitor |
| **JDK (Java)** | 21 (Temurin ou Microsoft OpenJDK) | Compilation Android |
| **Android SDK** | API 35 (compileSdk) | SDK Android |
| Android Studio *(facultatif mais conseillé)* | — | Gestion du SDK + ouverture du projet |

### Installation rapide (Windows, via winget)

```powershell
winget install OpenJS.NodeJS.LTS
winget install Microsoft.OpenJDK.21
# SDK Android : installer Android Studio, ou en ligne de commande :
winget install Google.AndroidStudio
```

> Après installation, vérifier : `node -v` et `java -version`.
> Le SDK Android peut être installé sans Android Studio (voir « Installation du SDK seule » plus bas).

---

## 2. Installer les dépendances Capacitor

```bash
cd quran-app
npm install
```

## 3. Ajouter la plateforme Android

```bash
npx cap add android
```

Cette commande génère le dossier `android/` (projet Gradle natif).

## 4. Synchroniser les ressources web

À chaque modification de `www/` :

```bash
npx cap sync
```

Cela copie l'application web dans `android/app/src/main/assets/public` et synchronise les plugins.

## 5. Construire l'APK (debug — installable directement)

> ✅ **Déjà fait sur cette machine** — l'APK est dans **`dist/Coran-v1.0.0-debug.apk`** (4 Mo, versionName `1.0.0`).

```bash
npm run build:apk
# équivalent : npx cap sync android && cd android && gradlew.bat assembleDebug
```

**Résultat :** `android/app/build/outputs/apk/debug/app-debug.apk` (copié dans `dist/`)

Installer sur un téléphone (débogage USB activé) :

```bash
adb install dist/Coran-v1.0.0-debug.apk
```

## 6. Construire le bundle de publication (AAB, Play Store)

```bash
npm run build:aab
```

**Résultat :** `android/app/build/outputs/bundle/release/app-release.aab`

> ⚠️ Pour publier, il faut signer l'application (fichier `.keystore`).
> Configuration : `android/app/build.gradle` → bloc `signingConfigs` puis `release { signingConfig signingConfigs.release }`.
> Un guide complet : https://developer.android.com/studio/publish/app-signing

---

## 7. Icônes de l'application

Les icônes natives sont déjà générées dans `android-icons/` :

- `ic_launcher.png` / `ic_launcher_round.png` — icônes legacy (Android 5-7)
- `ic_launcher_foreground.png` — couche avant **adaptative** (API 26+) : croissant doré centré dans la zone de sécurité (diamètre 232px sur 432px de canvas, zone sûre 264px)
- `ic_launcher_monochrome.png` — couche **monochrome** (Android 13+, icônes thémées)

Le fond adaptatif est un **dégradé vert** (`res/drawable/ic_launcher_background.xml`, `#166534 → #0B3D2E`).

À copier dans le projet Android :

```bash
# depuis quran-app/
cp -r android-icons/mipmap-* android/app/src/main/res/
```

Régénérez-les si besoin avec : `python tools/gen_icons.py`

## 8. Personnalisation

- **Identifiant de l'application** (`tg.coran.app`) : `capacitor.config.json` → `appId` (doit être unique et définitif avant publication).
- **Nom affiché** : `capacitor.config.json` → `appName`.
- **Version** : `android/app/build.gradle` → `versionCode` / `versionName`.
- Après toute modification de la config : `npx cap sync`.

---

## 9. Dépannage

| Erreur | Solution |
|---|---|
| `SDK location not found` | Créer `android/local.properties` avec `sdk.dir=C:/Users/<vous>/AppData/Local/Android/Sdk` (**slashs avant** obligatoires) |
| `Malformed \\uxxxx encoding` | Le chemin de `local.properties` contenait des backslashes (`C:\\Users…`) : utiliser des slashs avant (`C:/Users…`) |
| `Failed to find target with hash string 'android-35'` | Installer l'API 35 : `sdkmanager "platforms;android-35"` |
| Licences non acceptées | `sdkmanager --licenses` |
| `JAVA_HOME` introuvable | Définir `JAVA_HOME` vers le dossier d'installation du JDK 21 |
| Premier build très lent | Normal : Gradle télécharge ses dépendances (une seule fois) |

### Installation du SDK Android seule (sans Android Studio)

```bash
# 1. Télécharger les command-line tools depuis https://developer.android.com/studio#command-line-tools-only
# 2. Extraire dans %LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest
# 3. Installer les composants (JAVA_HOME doit pointer vers le JDK 21) :
%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat "platform-tools" "platforms;android-35" "build-tools;35.0.0"
# 4. Créer android/local.properties (slashs avant !) :
#    sdk.dir=C:/Users/<vous>/AppData/Local/Android/Sdk
```

### Environnement utilisé pour ce build (sur cette machine)

```bash
JAVA_HOME="C:\Users\user\AppData\Local\Programs\jdk-21.0.12+8"
ANDROID_HOME="C:\Users\user\AppData\Local\Android\Sdk"
# Node : C:\Users\user\AppData\Local\Programs\node-v24.19.0-win-x64
```

---

## 🧭 Vue d'ensemble

```
www/                  → application web (copiée dans l'APK)
capacitor.config.json → configuration Capacitor
android/              → projet Android généré (Gradle)
android-icons/        → icônes natives prêtes à copier
```

L'application fonctionne **hors ligne** dans l'APK : le service worker et les sourates téléchargées (IndexedDB) fonctionnent dans la WebView Android comme dans le navigateur.
