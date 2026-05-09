# 🏥 Sehaty — Plateforme de réservation médicale

> **Sehaty** est une application web complète de prise de rendez-vous médicaux en ligne, pensée pour le marché algérien. Elle met en relation patients, médecins et administrateurs au sein d'une interface moderne, intuitive et entièrement en français.

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Routes & Pages](#routes--pages)
- [API Backend](#api-backend)
- [Modèles de données](#modèles-de-données)
- [Installation & Lancement](#installation--lancement)
- [Variables d'environnement](#variables-denvironnement)

---

## Aperçu

Sehaty est une SPA (Single Page Application) React organisée en **trois portails distincts** :

| Portail | Accès | Description |
|---|---|---|
| 🧑‍💼 **Patient** | `/` | Trouver un médecin, réserver un créneau, payer, suivre ses RDV |
| 👨‍⚕️ **Médecin** | `/medecin/` | Gérer son agenda, ses RDV, son profil et ses revenus |
| 🛡️ **Admin** | `/admin/` | Administrer médecins, patients et rendez-vous de la plateforme |

---

## Fonctionnalités

### 🧑‍💼 Portail Patient

#### Authentification
- Inscription avec nom, e-mail et mot de passe
- Connexion sécurisée avec token JWT stocké dans `localStorage`
- Déconnexion automatique sur token expiré (intercepteur Axios 401)

#### Recherche de médecins
- Page d'accueil avec héros, statistiques et médecins disponibles en vedette
- Liste complète des médecins avec **filtrage par spécialité** (15 spécialités disponibles)
- **Recherche textuelle** par nom ou spécialité en temps réel
- Carte médecin : photo, spécialité, expérience, tarif en DZD, badge disponibilité

#### Profil médecin & Réservation
- Page détaillée du médecin : photo, biographie, diplôme, expérience, adresse, tarif
- **Sélecteur de créneaux interactif** sur 7 jours glissants
  - Matin : 9h → 13h (toutes les 30 min)
  - Après-midi : 14h → 18h (toutes les 30 min)
  - Créneaux déjà réservés automatiquement exclus
- Réservation **avec ou sans paiement** en ligne

#### Paiement Stripe
- Intégration complète **Stripe Elements** (carte bancaire sécurisée)
- Flux en 2 étapes : création d'intent → confirmation
- Récapitulatif de commande avant paiement (médecin, date, heure, montant)
- Redirect automatique vers "Mes rendez-vous" après succès
- Affichage badge « Paiement sécurisé par Stripe »

#### Mes rendez-vous
- Liste de tous les rendez-vous avec filtres : Tous / En attente / Payés / Terminés / Annulés
- Carte RDV : photo médecin, spécialité, date formatée en français, heure, montant, statut
- Annulation avec **modal de confirmation** (ConfirmDialog)
- Statuts colorés : 🔴 Annulé · ⚫ Terminé · 🟢 Payé · 🔵 Remboursé · 🟡 En attente

#### Profil patient
- Modification du nom, téléphone, date de naissance, genre, adresse (2 lignes)
- Upload et prévisualisation de photo de profil (Cloudinary)
- Mode lecture / mode édition en un clic

#### Notifications
- **Cloche de notifications** dans la navbar avec badge rouge (compteur non lues)
- Dropdown avec les 5 dernières notifications et lien "Voir toutes"
- Page dédiée avec toutes les notifications (type RDV, remboursement)
- **Polling automatique toutes les 30 secondes** (hook `useNotifications`)
- Marquage comme lue au clic

---

### 👨‍⚕️ Portail Médecin

#### Tableau de bord
- Statistiques clés : revenus totaux, nombre de RDV, patients uniques
- Liste des derniers rendez-vous
- Indicateur de disponibilité (activer / désactiver)

#### Gestion des rendez-vous
- Tableau complet de tous les RDV du médecin
- Actions : **Marquer comme terminé** · **Annuler**
- Affichage patient (photo, nom), date, heure, montant, statut

#### Profil médecin
- Modification des honoraires (DZD), adresse de cabinet, disponibilité
- Bascule disponibilité (disponible / indisponible) en temps réel

#### Gains
- Historique des revenus basé sur les consultations effectuées

---

### 🛡️ Portail Administrateur

#### Tableau de bord
- Vue d'ensemble : total médecins, patients, rendez-vous
- Statistiques globales de la plateforme

#### Gestion des médecins
- Liste complète avec photo, spécialité, expérience, tarif, disponibilité
- **Ajout d'un médecin** via formulaire complet (multipart/form-data) :
  - Informations : nom, e-mail, mot de passe, spécialité, diplôme, expérience, biographie, honoraires, adresse, photo
  - 15 spécialités disponibles · 7 niveaux d'expérience
- **Bascule disponibilité** d'un médecin
- **Suppression** avec confirmation (ConfirmDialog)

#### Gestion des patients
- Liste de tous les patients inscrits (nom, e-mail, téléphone, genre)

#### Gestion des rendez-vous
- Tableau global de tous les RDV de la plateforme
- Colonnes : patient, médecin, date, heure, montant, statut
- Annulation d'un RDV depuis l'interface admin

---

## Stack technique

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 18 | UI library principale |
| **Vite** | 5 | Bundler & dev server ultra-rapide |
| **React Router v6** | 6 | Routing SPA côté client |
| **Tailwind CSS** | 3 | Styling utility-first |
| **Zustand** | 4 | State management global (stores) |
| **Axios** | 1.6 | Client HTTP + intercepteurs globaux |
| **@stripe/stripe-js** | 3 | SDK Stripe côté client |
| **@stripe/react-stripe-js** | 2 | Composants React Stripe Elements |
| **react-hot-toast** | 2 | Notifications toast (succès / erreur) |
| **Inter** (Google Fonts) | — | Typographie principale |

### Backend (fourni séparément)

| Technologie | Rôle |
|---|---|
| **Node.js / Express** | Serveur API REST |
| **MongoDB / Mongoose** | Base de données |
| **JWT** | Authentification par token |
| **Cloudinary** | Stockage des images (photos de profil, médecins) |
| **Stripe** | Traitement des paiements |
| **Multer** | Upload de fichiers |

---

## Architecture du projet

```
src/
│
├── api/                          # Couche d'appels HTTP (Axios)
│   ├── axios.js                  # Instance Axios + intercepteurs (tokens, 401, erreurs)
│   ├── userApi.js                # 10 endpoints patient
│   ├── doctorApi.js              # 9 endpoints médecin
│   └── adminApi.js               # 9 endpoints admin
│
├── store/                        # State global Zustand
│   ├── useAuthStore.js           # Tokens JWT (utoken/dtoken/atoken) + rôle
│   ├── useUserStore.js           # Profil patient, RDV, notifications
│   ├── useDoctorStore.js         # Profil médecin, RDV, dashboard
│   └── useAdminStore.js          # Médecins, patients, RDV admin
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx            # Navbar patient (logo, liens, menu utilisateur, cloche)
│   │   ├── DoctorSidebar.jsx     # Sidebar portail médecin
│   │   ├── AdminSidebar.jsx      # Sidebar portail admin
│   │   └── ProtectedRoute.jsx    # HOC de protection de routes par rôle
│   │
│   ├── ui/                       # Composants UI génériques réutilisables
│   │   ├── Button.jsx            # Bouton (variants: primary/outline/danger/ghost/secondary)
│   │   ├── Input.jsx             # Champ texte avec label et message d'erreur
│   │   ├── Badge.jsx             # Badge statut RDV (logique priorité automatique)
│   │   ├── Modal.jsx             # Modal générique (overlay + fermeture)
│   │   ├── Spinner.jsx           # Spinner de chargement (3 tailles)
│   │   ├── EmptyState.jsx        # État vide (icône + titre + description + action)
│   │   └── ConfirmDialog.jsx     # Boîte de confirmation destructive
│   │
│   ├── doctor/
│   │   ├── DoctorCard.jsx        # Carte médecin pour les listings
│   │   └── SlotPicker.jsx        # Sélecteur de créneaux sur 7 jours
│   │
│   ├── appointment/
│   │   ├── AppointmentCard.jsx   # Carte RDV vue patient (avec annulation)
│   │   └── AppointmentRow.jsx    # Ligne tableau RDV (admin/médecin)
│   │
│   ├── notification/
│   │   └── NotificationBell.jsx  # Cloche + badge + dropdown + polling
│   │
│   └── payment/
│       └── StripePaymentForm.jsx # Formulaire Stripe Elements complet
│
├── pages/
│   ├── auth/
│   │   ├── UserLoginPage.jsx     # Connexion patient
│   │   ├── UserRegisterPage.jsx  # Inscription patient
│   │   ├── DoctorLoginPage.jsx   # Connexion médecin
│   │   └── AdminLoginPage.jsx    # Connexion admin (dark theme)
│   │
│   ├── user/
│   │   ├── HomePage.jsx          # Accueil (hero, spécialités, médecins vedettes, CTA)
│   │   ├── DoctorsPage.jsx       # Liste médecins (filtre spécialité + recherche)
│   │   ├── DoctorProfilePage.jsx # Profil médecin + réservation de créneau
│   │   ├── MyAppointmentsPage.jsx# Mes RDV (filtres par statut)
│   │   ├── UserProfilePage.jsx   # Mon profil (édition + photo)
│   │   ├── NotificationsPage.jsx # Centre de notifications
│   │   └── PaymentPage.jsx       # Paiement Stripe (récapitulatif + Elements)
│   │
│   ├── doctor/
│   │   ├── DoctorDashboardPage.jsx    # Dashboard médecin (stats + derniers RDV)
│   │   ├── DoctorAppointmentsPage.jsx # Gestion RDV médecin
│   │   ├── DoctorProfilePage.jsx      # Édition profil médecin
│   │   └── DoctorEarningsPage.jsx     # Historique des gains
│   │
│   └── admin/
│       ├── AdminDashboardPage.jsx     # Dashboard admin (stats globales)
│       ├── AdminDoctorsPage.jsx       # Gestion médecins (ajout/suppression/dispo)
│       ├── AdminPatientsPage.jsx      # Liste des patients
│       └── AdminAppointmentsPage.jsx  # Tous les RDV de la plateforme
│
├── hooks/
│   ├── useAuth.js              # Helpers auth (isUser, isDoctor, isAdmin, handleLogout)
│   └── useNotifications.js     # Polling notifications toutes les 30 secondes
│
├── utils/
│   ├── formatDate.js           # formatSlotDate("15_1_2025") → "15 janvier 2025"
│   ├── formatCurrency.js       # formatCurrency(2500) → "2 500 DZD"
│   └── generateSlots.js        # Génère les créneaux dispo sur 7 jours (9h-13h / 14h-18h)
│
├── App.jsx                     # Définition de toutes les routes React Router v6
├── main.jsx                    # Point d'entrée React + BrowserRouter + Toaster
└── index.css                   # Import Tailwind + police Inter + classes utilitaires
```

---

## Routes & Pages

### Routes publiques (sans authentification)

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Page d'accueil |
| `/medecins` | `DoctorsPage` | Liste de tous les médecins |
| `/medecins/:id` | `DoctorProfilePage` | Profil et réservation |
| `/connexion` | `UserLoginPage` | Connexion patient |
| `/inscription` | `UserRegisterPage` | Inscription patient |
| `/medecin/connexion` | `DoctorLoginPage` | Connexion médecin |
| `/admin/connexion` | `AdminLoginPage` | Connexion admin |

### Routes protégées — Patient (`utoken` requis)

| Route | Page |
|---|---|
| `/mes-rendez-vous` | `MyAppointmentsPage` |
| `/profil` | `UserProfilePage` |
| `/notifications` | `NotificationsPage` |
| `/paiement` | `PaymentPage` |

### Routes protégées — Médecin (`dtoken` requis)

| Route | Page |
|---|---|
| `/medecin/tableau-de-bord` | `DoctorDashboardPage` |
| `/medecin/rendez-vous` | `DoctorAppointmentsPage` |
| `/medecin/profil` | `DoctorProfilePage` |
| `/medecin/gains` | `DoctorEarningsPage` |

### Routes protégées — Admin (`atoken` requis)

| Route | Page |
|---|---|
| `/admin/tableau-de-bord` | `AdminDashboardPage` |
| `/admin/medecins` | `AdminDoctorsPage` |
| `/admin/patients` | `AdminPatientsPage` |
| `/admin/rendez-vous` | `AdminAppointmentsPage` |

---

## API Backend

### 🧑‍💼 Endpoints Patient — header `token: <utoken>`

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/user/inscription` | Créer un compte |
| `POST` | `/api/user/connexion` | Connexion |
| `GET` | `/api/user/profil` | Récupérer le profil |
| `POST` | `/api/user/mettre-a-jour-profil` | Modifier profil + photo |
| `POST` | `/api/user/reserver-rendez-vous` | Réserver un RDV |
| `GET` | `/api/user/liste-rendez-vous` | Lister ses RDV |
| `POST` | `/api/user/annuler-rendez-vous` | Annuler un RDV |
| `POST` | `/api/user/create-booking-intent` | Créer un PaymentIntent Stripe |
| `POST` | `/api/user/confirm-and-book` | Confirmer RDV après paiement |
| `GET` | `/api/user/notifications` | Récupérer les notifications |
| `POST` | `/api/user/notifications/read` | Marquer une notif comme lue |

### 👨‍⚕️ Endpoints Médecin — header `dtoken: <dtoken>`

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/doctor/connexion` | Connexion médecin |
| `GET` | `/api/doctor/list` | Liste publique des médecins |
| `POST` | `/api/doctor/change-availability` | Basculer disponibilité |
| `GET` | `/api/doctor/appointments` | Ses rendez-vous |
| `POST` | `/api/doctor/complete-appointment` | Marquer RDV comme terminé |
| `POST` | `/api/doctor/cancel-appointment` | Annuler un RDV |
| `GET` | `/api/doctor/dashboard` | Données du tableau de bord |
| `GET` | `/api/doctor/profile` | Son profil |
| `POST` | `/api/doctor/update-profile` | Modifier honoraires/adresse |

### 🛡️ Endpoints Admin — header `atoken: <atoken>`

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/admin/connexion` | Connexion admin |
| `POST` | `/api/admin/ajouter-medecin` | Ajouter un médecin |
| `GET` | `/api/admin/liste-medecins` | Tous les médecins |
| `GET` | `/api/admin/liste-rendez-vous` | Tous les RDV |
| `POST` | `/api/admin/annuler-rendez-vous` | Annuler un RDV |
| `GET` | `/api/admin/tableau-de-bord` | Statistiques globales |
| `POST` | `/api/admin/supprimer-medecin` | Supprimer un médecin |
| `POST` | `/api/admin/toggle-disponibilite` | Basculer dispo d'un médecin |
| `GET` | `/api/admin/liste-patients` | Tous les patients |

---

## Modèles de données

### Appointment (Rendez-vous)
```js
{
  _id: String,
  userId: String,
  docId: String,
  slotDate: String,           // Format: "15_1_2025"
  slotTime: String,           // Format: "9:00"
  userData: Object,           // Snapshot patient
  docData: Object,            // Snapshot médecin
  amount: Number,             // En DZD
  date: Number,               // Timestamp
  cancelled: Boolean,
  isCompleted: Boolean,
  isPaid: Boolean,
  isRefunded: Boolean,
  paymentIntentId: String
}
```

### Doctor (Médecin)
```js
{
  _id: String,
  name: String,
  email: String,
  image: String,              // URL Cloudinary
  speciality: String,
  degree: String,
  experience: String,         // ex: "5 ans"
  about: String,
  available: Boolean,
  fees: Number,               // En DZD
  address: String,
  date: Number,               // Timestamp inscription
  slots_booked: Object        // { "15_1_2025": ["9:00", "10:00"] }
}
```

### User (Patient)
```js
{
  _id: String,
  name: String,
  email: String,
  image: String,              // URL Cloudinary
  address: {
    line1: String,
    line2: String
  },
  gender: String,
  dob: String,
  phone: String
}
```

### Notification
```js
{
  _id: String,
  userId: String,
  type: "appointment" | "refund",
  message: String,            // En français
  messageAr: String,          // En arabe
  isRead: Boolean,
  relatedId: String,
  createdAt: Date
}
```

---

## Installation & Lancement

### Prérequis
- Node.js ≥ 18
- npm ≥ 9
- Backend Sehaty démarré sur le port 4000

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-org/sehaty-frontend.git
cd sehaty-frontend

# Installer les dépendances
npm install
```

### Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Remplir les variables (voir section ci-dessous)
nano .env
```

### Lancement en développement

```bash
npm run dev
# → http://localhost:5173
```

### Build de production

```bash
npm run build
npm run preview
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de votre API backend
VITE_API_URL=http://localhost:4000

# Clé publique Stripe (commence par pk_test_ ou pk_live_)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Ne jamais exposer la clé secrète Stripe (`sk_...`) côté frontend.

---

## Spécialités médicales disponibles

| # | Spécialité |
|---|---|
| 1 | Généraliste |
| 2 | Cardiologue |
| 3 | Dermatologue |
| 4 | Gastro-entérologue |
| 5 | Neurologue |
| 6 | Gynécologue |
| 7 | Pédiatre |
| 8 | Psychiatre |
| 9 | Ophtalmologue |
| 10 | Orthopédiste |
| 11 | ORL |
| 12 | Urologue |
| 13 | Endocrinologue |
| 14 | Rhumatologue |
| 15 | Radiologue |

---

## Logique métier clé

### Priorité des statuts de rendez-vous

```
cancelled    → 🔴 "Annulé"
isCompleted  → ⚫ "Terminé"
isPaid       → 🟢 "Payé"
isRefunded   → 🔵 "Remboursé"
default      → 🟡 "En attente"
```

### Flux de paiement Stripe (2 étapes)

```
1. POST /api/user/create-booking-intent  →  { clientSecret }
2. stripe.confirmCardPayment(clientSecret, { card })
3. Si succès → POST /api/user/confirm-and-book { paymentIntentId }
4. Toast "Rendez-vous confirmé !" + redirect /mes-rendez-vous
```

### Génération des créneaux

```
7 jours à partir d'aujourd'hui
Matin    : 9h00 → 12h30 (toutes les 30 min)
Après-midi : 14h00 → 17h30 (toutes les 30 min)
slotDate : "jour_mois_année" → ex: "15_1_2025"
Créneaux déjà réservés (slots_booked) automatiquement exclus
```

---

## Auteur

Projet **Sehaty** — Développé avec ❤️ pour simplifier l'accès aux soins médicaux en Algérie.