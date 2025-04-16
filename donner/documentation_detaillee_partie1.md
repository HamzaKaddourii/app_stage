# Documentation Détaillée - Système de Gestion des Logements InfoDesign

## 1. Présentation du Projet

### 1.1 Contexte du Projet

InfoDesign est une entreprise spécialisée dans la formation et le développement informatique basée à Béjaia, Algérie. L'entreprise dispose de plusieurs salles qu'elle met à disposition pour des événements professionnels, des formations et des séminaires. Avant la mise en place de cette application, la gestion des réservations de ces espaces était effectuée manuellement, ce qui engendrait plusieurs problèmes :

- Difficultés pour visualiser les disponibilités en temps réel
- Risques d'erreurs dans la planification des réservations
- Processus administratif lourd et chronophage
- Manque de traçabilité des réservations passées
- Absence de système de fidélisation client

Pour résoudre ces problématiques et optimiser la gestion de ses espaces, InfoDesign a souhaité développer une plateforme web moderne et intuitive permettant d'automatiser l'ensemble du processus de réservation.

### 1.2 Objectifs du Projet

#### Objectifs Généraux

1. **Modernisation du processus de réservation** :
   - Passer d'un système manuel à une plateforme digitale
   - Réduire le temps consacré à la gestion administrative
   - Minimiser les erreurs humaines dans le processus

2. **Amélioration de l'expérience client** :
   - Offrir une interface intuitive et accessible
   - Permettre la visualisation en temps réel des disponibilités
   - Simplifier le processus de réservation

3. **Optimisation de l'utilisation des espaces** :
   - Augmenter le taux d'occupation des salles
   - Faciliter la planification des événements
   - Anticiper les besoins en maintenance et aménagement

#### Objectifs Spécifiques

1. **Développer une interface utilisateur moderne** permettant de :
   - Consulter le catalogue des salles disponibles avec leurs caractéristiques
   - Effectuer des recherches et filtrer les salles selon divers critères
   - Visualiser les disponibilités sur un calendrier interactif

2. **Mettre en place un système de réservation robuste** permettant de :
   - Sélectionner des créneaux horaires disponibles
   - Calculer automatiquement les tarifs
   - Confirmer les réservations de manière sécurisée
   - Annuler ou modifier les réservations selon certaines conditions

3. **Créer un système de fidélisation client** via :
   - La génération automatique de bons d'achat représentant 10% du montant des réservations
   - La possibilité d'utiliser ces bons sur de futures réservations
   - L'exportation des bons au format PDF pour une utilisation simplifiée

4. **Développer un module de demandes personnalisées** permettant aux clients de :
   - Soumettre des demandes spécifiques non couvertes par le système standard
   - Suivre l'état de traitement de leurs demandes
   - Recevoir des propositions adaptées à leurs besoins

5. **Créer un tableau de bord administrateur** offrant :
   - Une vue d'ensemble des réservations en cours et à venir
   - Des outils de gestion des salles, utilisateurs et bons d'achat
   - Des fonctionnalités de validation des réservations et traitement des demandes
   - Des statistiques d'utilisation et d'occupation des salles

### 1.3 Périmètre du Projet

Le projet se concentre sur les aspects suivants :

- **Gestion des utilisateurs** : Inscription, connexion, gestion de profil, récupération de mot de passe
- **Gestion des salles** : Catalogue, caractéristiques, disponibilités, tarification
- **Système de réservation** : Sélection de créneaux, validation, paiement (simulé)
- **Gestion des bons d'achat** : Génération, utilisation, exportation PDF
- **Demandes personnalisées** : Soumission, suivi, traitement
- **Administration** : Validation, statistiques, gestion des ressources

Le projet ne couvre pas :
- L'intégration d'un système de paiement réel (simulé uniquement)
- La gestion des ressources humaines (personnel nécessaire pour chaque événement)
- La logistique liée à l'utilisation des salles (approvisionnement, maintenance)

## 2. Cahier des Charges Détaillé

### 2.1 Spécifications Fonctionnelles

#### 2.1.1 Gestion des Utilisateurs

**Inscription des utilisateurs**
- Formulaire d'inscription collectant les informations essentielles (nom, email, mot de passe)
- Validation des données avec messages d'erreur explicites
- Confirmation de compte via email (optionnel en développement)
- Redirection vers la page de connexion après inscription réussie

**Connexion et authentification**
- Formulaire de connexion (email et mot de passe)
- Gestion des sessions utilisateur avec tokens JWT
- Option "Se souvenir de moi" pour maintenir la session
- Déconnexion sécurisée

**Profil utilisateur**
- Affichage des informations personnelles
- Modification des données du profil (nom, email, mot de passe)
- Historique des réservations et des bons d'achat
- Suivi des demandes personnalisées

**Récupération de mot de passe**
- Formulaire de demande de réinitialisation par email
- Génération et envoi d'un lien sécurisé à usage unique
- Page de création d'un nouveau mot de passe
- Confirmation de la modification

**Rôles et permissions**
- Deux rôles principaux : utilisateur standard et administrateur
- Accès différencié aux fonctionnalités selon le rôle
- Protection des routes administratives

#### 2.1.2 Gestion des Salles

**Catalogue des salles**
- Liste des salles disponibles avec pagination
- Affichage des informations principales (nom, capacité, prix)
- Filtrage par critères (capacité, équipements, disponibilité)
- Recherche par mot-clé

**Fiche détaillée des salles**
- Présentation complète de chaque salle
- Galerie d'images (carrousel)
- Spécifications techniques (superficie, capacité, équipements)
- Calendrier de disponibilité
- Tarification horaire

**Gestion administrative des salles** (administrateurs uniquement)
- Ajout de nouvelles salles
- Modification des caractéristiques existantes
- Désactivation temporaire ou définitive
- Gestion des images et documents associés

#### 2.1.3 Système de Réservation

**Processus de réservation**
- Sélection de la salle via la fiche détaillée
- Choix de la date et de la plage horaire sur un calendrier interactif
- Vérification en temps réel des disponibilités
- Calcul automatique du coût en fonction de la durée et du tarif horaire
- Récapitulatif de la réservation avant confirmation
- Confirmation avec génération automatique d'un bon d'achat

**Gestion des réservations par l'utilisateur**
- Liste des réservations en cours et passées
- Détails de chaque réservation
- Possibilité d'annulation selon conditions prédéfinies
- Réception de bons d'achat après validation

**Validation administrative des réservations**
- Interface de gestion des demandes en attente
- Validation ou refus motivé
- Génération automatique des bons d'achat après validation
- Notifications aux utilisateurs

#### 2.1.4 Gestion des Bons d'Achat

**Génération des bons d'achat**
- Création automatique après validation d'une réservation
- Valeur égale à 10% du montant total de la réservation
- Attribution d'un code unique
- Date d'expiration fixée (1 an après émission)

**Interface utilisateur des bons d'achat**
- Liste des bons disponibles, utilisés et expirés
- Détails de chaque bon (valeur, origine, validité)
- Exportation au format PDF incluant :
  - Logo InfoDesign
  - Code unique du bon
  - Montant et date d'expiration
  - Détails du calcul (prix horaire × nombre d'heures)
  - Informations sur la réservation d'origine

**Utilisation des bons**
- Système de saisie du code lors d'une nouvelle réservation
- Vérification de la validité et de la disponibilité du bon
- Application de la réduction sur le montant total
- Marquage du bon comme "utilisé" après confirmation

#### 2.1.5 Gestion des Demandes Personnalisées

**Soumission de demandes**
- Formulaire détaillé pour exprimer des besoins spécifiques
- Sélection du type de demande
- Description détaillée
- Contact préféré pour le suivi

**Suivi des demandes**
- Liste des demandes avec leur statut (en attente, en traitement, traitée)
- Détail des échanges pour chaque demande
- Notifications des mises à jour

**Traitement administratif**
- Interface de gestion des demandes entrantes
- Système de réponse et de proposition
- Marquage du statut de traitement
- Historique des interactions

#### 2.1.6 Administration du Système

**Tableau de bord administrateur**
- Vue d'ensemble du système
- Statistiques d'utilisation
- Alertes et notifications
- Accès rapide aux principales fonctionnalités

**Gestion des utilisateurs**
- Liste complète des utilisateurs
- Modification des informations et des rôles
- Désactivation/réactivation de comptes
- Réinitialisation de mots de passe

**Supervision des réservations**
- Calendrier global des réservations
- Filtrage par salle, date ou utilisateur
- Validation des nouvelles réservations
- Gestion des annulations et modifications

**Administration des bons d'achat**
- Vue d'ensemble des bons émis
- Statistiques d'utilisation
- Annulation ou modification manuelle si nécessaire

### 2.2 Spécifications Techniques

#### 2.2.1 Architecture Globale

Le système est basé sur une architecture client-serveur moderne avec séparation claire entre frontend et backend :

**Frontend**
- Application Single Page (SPA) développée avec React.js
- Interface responsive s'adaptant à tous les appareils
- Gestion d'état via Context API et hooks
- Routing client avec React Router
- Utilisation de Bootstrap pour l'interface utilisateur
- Interactions asynchrones avec l'API backend via Axios

**Backend**
- API RESTful développée avec Laravel (PHP)
- Architecture MVC (Modèle-Vue-Contrôleur)
- Authentification via Laravel Sanctum (API tokens)
- Base de données relationnelle MySQL
- Utilisation de l'ORM Eloquent pour l'accès aux données
- Validation des données côté serveur
- Génération de PDF via bibliothèques dédiées

**Communication**
- Échanges via API REST en format JSON
- Authentification par tokens JWT
- Gestion des erreurs standardisée
- Validation des données côté client et serveur

#### 2.2.2 Sécurité

- Protection contre les injections SQL via ORM
- Validation des données entrantes
- Hachage sécurisé des mots de passe (bcrypt)
- Protection CSRF pour les formulaires
- Authentification basée sur les tokens
- Vérification des permissions à chaque niveau
- Limitation de débit sur les routes sensibles
- Journalisation des activités critiques

#### 2.2.3 Performance et Scalabilité

- Optimisation des requêtes SQL
- Mise en cache des données fréquemment accédées
- Chargement paresseux (lazy loading) des composants React
- Pagination des listes de données volumineuses
- Optimisation des images et ressources statiques
- Structure évolutive permettant l'ajout de nouvelles fonctionnalités
