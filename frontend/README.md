# Sehaty — Frontend React

Application de réservation médicale en ligne.

## Stack
- React 18 + Vite
- Tailwind CSS
- Zustand
- Axios
- Stripe
- React Hot Toast

## Installation

```bash
cd sehaty
npm install
cp .env.example .env
# Éditez .env avec vos clés
npm run dev
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL du backend (ex: `http://localhost:4000`) |
| `VITE_STRIPE_PUBLIC_KEY` | Clé publique Stripe |

## Structure

```
src/
├── api/          # Appels Axios par domaine
├── store/        # Zustand stores
├── components/   # Composants réutilisables
├── pages/        # Pages par portail
├── hooks/        # Hooks custom
└── utils/        # Utilitaires
```

## Portails

| URL | Accès |
|---|---|
| `/` | Patient (public) |
| `/connexion` | Connexion patient |
| `/inscription` | Inscription patient |
| `/medecin/connexion` | Connexion médecin |
| `/medecin/tableau-de-bord` | Portail médecin (protégé) |
| `/admin/connexion` | Connexion admin |
| `/admin/tableau-de-bord` | Portail admin (protégé) |
