## 3. Architecture Technique Détaillée

### 3.1 Technologies Utilisées

#### 3.1.1 Frontend

**React.js**
- Version : 17.0.2
- Choix justifié par sa performance, sa flexibilité et son écosystème robuste
- Utilisation des hooks pour la gestion d'état et des effets
- Composants fonctionnels pour une meilleure lisibilité et maintenabilité

**Bibliothèques React principales**
- React Router Dom (v6.0.2) : Gestion du routage côté client
- React Bootstrap (v2.0.0) : Composants UI prêts à l'emploi
- React-Toastify (v8.1.0) : Notifications utilisateur
- Axios (v0.24.0) : Client HTTP pour les requêtes API
- jsPDF (v2.5.0) : Génération de documents PDF
- React-DatePicker (v4.3.0) : Sélection de dates et créneaux horaires

**Gestion d'état**
- Utilisation du Context API de React pour les états globaux
- État d'authentification géré via AuthContext
- États locaux gérés via useState pour les composants individuels
- Patterns de composition pour éviter le "prop drilling"

#### 3.1.2 Backend

**Laravel**
- Version : 9.0
- Framework PHP moderne suivant le pattern MVC
- Système de routage robuste pour API RESTful
- Middleware pour la gestion des requêtes et de l'authentification

**Composants Laravel principaux**
- Eloquent ORM : Mapping objet-relationnel pour interagir avec la base de données
- Laravel Sanctum : Authentification par tokens pour API
- Laravel Validation : Validation des données entrantes
- Laravel Mail : Envoi d'emails (récupération de mot de passe)

**Base de données**
- MySQL 8.0
- Structure relationnelle optimisée
- Indexes pour les requêtes fréquentes
- Contraintes d'intégrité référentielle

**Serveur**
- Environnement de développement : Laravel Artisan Serve
- Production recommandée : Nginx + PHP-FPM

### 3.2 Structure Détaillée de la Base de Données

#### 3.2.1 Schéma des Tables

**Table `users`**
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('utilisateur', 'admin') DEFAULT 'utilisateur',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Table `salles`**
```sql
CREATE TABLE salles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NULL,
    capacite INT UNSIGNED NOT NULL,
    superficie DOUBLE(8, 2) NULL,
    prix_horaire DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NULL,
    est_disponible BOOLEAN DEFAULT TRUE,
    equipements JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Table `reservations`**
```sql
CREATE TABLE reservations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    salle_id BIGINT UNSIGNED NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    statut ENUM('en_attente', 'validée', 'annulée', 'terminée') DEFAULT 'en_attente',
    montant DECIMAL(10, 2) NOT NULL,
    note TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE
);
```

**Table `bons_achat`**
```sql
CREATE TABLE bons_achat (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    reservation_id BIGINT UNSIGNED NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    montant DECIMAL(10, 2) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    date_expiration DATE NOT NULL,
    date_utilisation DATETIME NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL
);
```

**Table `demandes_personnalisees`**
```sql
CREATE TABLE demandes_personnalisees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NULL,
    statut ENUM('en_attente', 'en_traitement', 'traitée', 'annulée') DEFAULT 'en_attente',
    reponse TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Table `password_resets`**
```sql
CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);
```

#### 3.2.2 Relations et Contraintes

Le schéma de base de données inclut les relations suivantes :

1. **One-to-Many** : 
   - Un utilisateur peut avoir plusieurs réservations
   - Un utilisateur peut avoir plusieurs bons d'achat
   - Un utilisateur peut faire plusieurs demandes personnalisées
   - Une salle peut être réservée plusieurs fois

2. **One-to-One** :
   - Une réservation peut générer un seul bon d'achat

3. **Contraintes d'intégrité** :
   - Suppression en cascade pour les utilisateurs (supprime réservations et bons associés)
   - NULL autorisé pour reservation_id dans bons_achat (un bon peut exister sans réservation)
   - Unicité des emails utilisateurs et des codes de bon d'achat

### 3.3 Structure de l'Application

#### 3.3.1 Structure du Frontend (React)

```
front-end-logement/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   ├── AdminRoute.js
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ForgotPassword.js
│   │   ├── ResetPassword.js
│   │   ├── ProfilePage.js
│   │   ├── SalleList.js
│   │   ├── SalleDetail.js
│   │   ├── ReservationForm.js
│   │   ├── UserReservations.js
│   │   ├── BonAchatList.js
│   │   ├── DemandeForm.js
│   │   ├── DemandeList.js
│   │   └── admin/
│   │       ├── AdminDashboard.js
│   │       ├── AdminReservations.js
│   │       ├── AdminDemandes.js
│   │       ├── SalleManagement.js
│   │       └── SalleForm.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── salleService.js
│   │   ├── reservationService.js
│   │   ├── bonAchatService.js
│   │   └── demandePersonnaliseeService.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── ...
├── package.json
└── ...
```

**Principaux composants et leurs responsabilités**:

- **Layout.js** : Structure commune à toutes les pages (navbar, footer)
- **ProtectedRoute.js** : Protège les routes nécessitant une authentification
- **AdminRoute.js** : Protège les routes nécessitant des droits administrateur
- **AuthContext.js** : Gestion globale de l'état d'authentification

**Services clés**:

- **authService.js** : Gestion de l'authentification (login, register, logout, etc.)
- **reservationService.js** : Opérations CRUD pour les réservations
- **bonAchatService.js** : Gestion des bons d'achat et génération PDF

#### 3.3.2 Structure du Backend (Laravel)

```
gestion-logement/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── SalleController.php
│   │   │   ├── ReservationController.php
│   │   │   ├── BonAchatController.php
│   │   │   └── DemandePersonnaliseeController.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   └── ...
│   │   └── Requests/
│   │       └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Salle.php
│   │   ├── Reservation.php
│   │   ├── BonAchat.php
│   │   └── DemandePersonnalisee.php
│   └── ...
├── config/
├── database/
│   ├── migrations/
│   │   ├── ..._create_users_table.php
│   │   ├── ..._create_salles_table.php
│   │   ├── ..._create_reservations_table.php
│   │   ├── ..._create_bons_achat_table.php
│   │   └── ..._create_demandes_personnalisees_table.php
│   └── seeders/
│       ├── AdminUserSeeder.php
│       └── ...
├── resources/
│   └── views/
│       └── emails/
│           └── reset_password.blade.php
├── routes/
│   └── api.php
├── .env
└── ...
```

**Contrôleurs principaux et leurs fonctions**:

- **AuthController** : Gestion des utilisateurs et authentification
  - register
  - login
  - logout
  - updateUser
  - forgotPassword
  - resetPassword

- **SalleController** : Gestion des salles
  - index (liste des salles)
  - show (détail d'une salle)
  - store (création - admin)
  - update (modification - admin)
  - destroy (suppression - admin)

- **ReservationController** : Gestion des réservations
  - index
  - store
  - show
  - getByUser
  - getBySalle
  - update (changement de statut)

- **BonAchatController** : Gestion des bons d'achat
  - index
  - show
  - createBonAchat
  - updateStatus

- **DemandePersonnaliseeController** : Gestion des demandes
  - index
  - store
  - getPendingDemands
  - updateStatus

### 3.4 Endpoints API

#### 3.4.1 Endpoints d'Authentification

| Méthode | URL | Description | Paramètres |
|---------|-----|-------------|------------|
| POST | /api/register | Inscription utilisateur | name, email, password, password_confirmation |
| POST | /api/login | Connexion | email, password |
| POST | /api/logout | Déconnexion | token |
| GET | /api/user | Obtenir l'utilisateur actuel | token |
| POST | /api/user/update | Mettre à jour le profil | name, email, password (optionnel) |
| POST | /api/forgot-password | Demander réinitialisation | email |
| GET | /api/reset-password/check | Vérifier validité token | token, email |
| POST | /api/reset-password | Réinitialiser mot de passe | token, email, password, password_confirmation |

#### 3.4.2 Endpoints de Gestion des Salles

| Méthode | URL | Description | Paramètres |
|---------|-----|-------------|------------|
| GET | /api/salles | Liste des salles | filtres optionnels |
| GET | /api/salles/{id} | Détail d'une salle | id |
| POST | /api/salles | Créer une salle (admin) | nom, description, capacite, superficie, prix_horaire, image, equipements |
| PUT | /api/salles/{id} | Modifier une salle (admin) | id + champs à modifier |
| DELETE | /api/salles/{id} | Supprimer une salle (admin) | id |

#### 3.4.3 Endpoints de Gestion des Réservations

| Méthode | URL | Description | Paramètres |
|---------|-----|-------------|------------|
| GET | /api/reservations | Liste des réservations | filtres optionnels |
| GET | /api/reservations/{id} | Détail d'une réservation | id |
| POST | /api/reservations | Créer une réservation | salle_id, date_debut, date_fin, note (optionnel) |
| PUT | /api/reservations/{id} | Modifier une réservation | id, statut, note (optionnel) |
| GET | /api/user-reservations/{userId} | Réservations d'un utilisateur | userId |
| GET | /api/salle-reservations/{salleId} | Réservations d'une salle | salleId |

#### 3.4.4 Endpoints de Gestion des Bons d'Achat

| Méthode | URL | Description | Paramètres |
|---------|-----|-------------|------------|
| GET | /api/bons-achat | Liste des bons d'achat | filtres optionnels |
| GET | /api/bons-achat/{id} | Détail d'un bon | id |
| POST | /api/bons-achat | Créer un bon d'achat | user_id, reservation_id, montant, code, date_expiration |
| PUT | /api/bons-achat/{id} | Modifier statut d'un bon | id, is_used, date_utilisation |

#### 3.4.5 Endpoints de Gestion des Demandes Personnalisées

| Méthode | URL | Description | Paramètres |
|---------|-----|-------------|------------|
| GET | /api/demandes-personnalisees | Liste des demandes | filtres optionnels |
| GET | /api/demandes-personnalisees/{id} | Détail d'une demande | id |
| POST | /api/demandes-personnalisees | Créer une demande | titre, description, type |
| PUT | /api/demandes-personnalisees/{id} | Mettre à jour une demande | id, statut, reponse |
| GET | /api/pending-demands | Demandes en attente (admin) | - |

### 3.5 Sécurité et Authentification

#### 3.5.1 Mécanisme d'Authentification

L'application utilise Laravel Sanctum pour l'authentification API :

1. L'utilisateur s'authentifie via les endpoints `/api/login` ou `/api/register`
2. Le serveur génère un token JWT qui est retourné au client
3. Le client stocke ce token dans le localStorage
4. Pour chaque requête API ultérieure, le client ajoute le token dans l'en-tête `Authorization`
5. Le middleware d'authentification vérifie la validité du token pour chaque requête

**Protection des routes** :
- Les routes publiques sont accessibles sans authentification
- Les routes protégées utilisateurs exigent un token valide
- Les routes administratives exigent un token valide ET le rôle "admin"

#### 3.5.2 Gestion des Mots de Passe

- Stockage des mots de passe avec hachage bcrypt
- Processus de récupération en deux étapes :
  1. Demande avec génération d'un token unique
  2. Réinitialisation avec vérification du token

#### 3.5.3 Protection CSRF

- Tokens CSRF générés pour les formulaires
- Validation côté serveur des tokens pour prévenir les attaques CSRF

#### 3.5.4 Validation des Données

- Validation côté client pour le feedback immédiat utilisateur
- Validation côté serveur pour garantir l'intégrité des données
- Messages d'erreur explicites retournés au client
