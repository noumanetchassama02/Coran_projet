# Run doc — Coran (PWA statique)

Application web 100 % statique dans `www/` (HTML/CSS/JS, aucun build, aucune dépendance à installer).
Aucun script `dev` dans `package.json` — le README recommande un simple serveur HTTP statique
car le service worker exige `http://` ou `https://` (le mode hors ligne ne fonctionne pas en `file://`).

## Comment lancer le serveur

Depuis la racine du projet, servir le dossier `www/` sur le port 8000 :

```bash
python -m http.server 8000 --directory www
```

Puis ouvrir `http://localhost:8000`.

### Détaché (Windows, pour l'aperçu)

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'C:\Users\user\AppData\Local\Programs\Python\Python313\python.exe' -ArgumentList '-m','http.server','8000','--directory','C:\Users\user\Desktop\Coran_projet\www' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- stdout et stderr doivent pointer vers **deux fichiers différents**.
- Récupérer le PID si besoin : `netstat -ano | grep ":8000" | grep LISTENING`.

## Reproduire les artefacts

Aucun artefact à reproduire : pas d'`.env`, pas de build, pas de dépendances.
Le dossier `www/` est copié tel quel dans l'APK Android (Capacitor) — modifier uniquement `www/` suffit.
