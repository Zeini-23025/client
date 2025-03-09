# 🏆 Nom de l'équipe : **Not Found**

# Gestion d'Emploi du Temps - Frontend

## 📌 Objectif

L'application **Gestion d'Emploi du Temps (Frontend)** permet une interaction utilisateur fluide et intuitive pour gérer les emplois du temps des enseignants et des groupes, en offrant une visualisation et une modification aisées des différentes entités du système.

## 📚 Description du Frontend

### 🚀 Fonctionnalités du Frontend

- **Gestion des groupes** : Visualisation, ajout et modification des groupes et sous-groupes.
- **Gestion des matières** : Ajout et association des matières aux groupes.
- **Gestion des enseignants** : Liste, ajout et modification des enseignants et gestion de leurs disponibilités.
- **Disponibilités des enseignants** : Planification des créneaux horaires disponibles.
- **Emploi du temps** : Affichage et modification des emplois du temps des enseignants et groupes.
- **Contraintes horaires** : Gestion des contraintes horaires pour assurer un emploi du temps optimal.
- **Charges hebdomadaires** : Suivi et gestion des heures de cours par enseignant et par matière.
- **Affectation des enseignants** : Attribution des enseignants aux matières et aux groupes en fonction de leur disponibilité et des charges de travail.

### 🖥️ Technologies Utilisées

- **React.js** : Librairie JavaScript pour la construction d'interfaces utilisateur réactives.
- **React Router** : Gestion des routes pour la navigation entre les différentes pages.
- **Tailwind CSS** : Framework CSS pour un design moderne et responsive.
- **Axios** : Librairie pour la gestion des requêtes HTTP vers le backend.

### 🐳 Conteneurisation avec Docker

Le frontend est conteneurisé avec **Docker** afin de simplifier le déploiement et l’exécution de l’application sur différents environnements.

### ⚙️ CI/CD avec GitHub Actions

Un pipeline **CI/CD** est configuré via **GitHub Actions** pour automatiser le processus de build et de déploiement du frontend.

## 📂 Livrables

- ✅ **Code source** du frontend hébergé sur GitHub.
- ✅ **Dockerfile** pour conteneuriser l’application frontend.
- ✅ **Workflow GitHub Actions** automatisant le build et le push de l’image Docker.
- ✅ **URL du dépôt Docker Hub** contenant l’image Docker du frontend.



## 🔹 Dépôts GitHub
🔗 **Backend** : [GitHub - Server](https://github.com/Zeini-23025/server)  
🔗 **Frontend** : [GitHub - Client](https://github.com/Zeini-23025/client)  

## 🐳 Dépôts Docker Hub
🐳 **Backend** : [Docker Hub - Server](https://hub.docker.com/r/zeini/docker-server)  
🐳 **Frontend** : [Docker Hub - Client](https://hub.docker.com/r/zeini/docker-client)  

## 🚀 Accéder aux applications
🔹 **Backend** : [🌍 docker-server-m0lg.onrender.com](https://docker-server-m0lg.onrender.com/)  
🔹 **Frontend** : [🌍 docker-client-hhi7.onrender.com](https://docker-client-hhi7.onrender.com)  

---

## 📀 Installation et Exécution

### 🛠️ **Méthode 1 : Exécution en local (Git & npm)**

1. **Cloner le dépôt Frontend** :
    ```bash
    git clone https://github.com/Zeini-23025/client
    cd client/planification_des_planing
    ```

2. **Installer les dépendances** :
    ```bash
    npm install
    ```

3. **Lancer l'application** :
    ```bash
    npm run dev
    ```

4. **Accéder à l’application Frontend** :
    - [http://localhost:5173](http://localhost:5173)

---

### 🛠️ **Méthode 2 : Utilisation de Docker**

1. **Récupérer l'image Docker depuis Docker Hub** :
    ```bash
    docker pull zeini/docker-client:latest
    ```

2. **Exécuter le conteneur Docker** :
    ```bash
    docker run -p 3000:3000 zeini/docker-client
    ```

3. **Accéder à l’application Frontend** :
    - [http://localhost:3000](http://localhost:3000)

---

## 📦 **Installation et Exécution de l'ensemble du Projet (Frontend + Backend)**

### 🛠️ **Méthode 1 : Exécution en local (Git & npm & pip)**

1. **Cloner les dépôts Backend et Frontend** :
    ```bash
    git clone https://github.com/Zeini-23025/server.git
    cd server/gestionEmploi
    pip install -r requirements.txt
    python manage.py runserver
    ```
    ```bash
    git clone https://github.com/Zeini-23025/client.git
    cd client/planification_des_planing
    npm install
    npm run dev
    ```

2. **Lancer les deux applications** :
    - Backend : [http://localhost:8000](http://localhost:8000)
    - Frontend : [http://localhost:3000](http://localhost:3000)

---

### 🛠️ **Méthode 2 : Exécution avec Docker**

1. **Tirer les images Docker pour le Backend et Frontend** :
    ```bash
    docker pull zeini/docker-server:latest
    docker pull zeini/docker-client:latest
    ```

2. **Exécuter les conteneurs Backend et Frontend** :
    ```bash
    docker run -p 8000:8000 zeini/docker-server
    docker run -p 3000:3000 zeini/docker-client
    ```

3. **Accéder à l’application Backend et Frontend** :
    - Backend : [http://localhost:8000](http://localhost:8000)
    - Frontend : [http://localhost:3000](http://localhost:3000)

---

## 📄 License

Ce projet est sous la **MIT License** - voir le fichier [LICENSE](./LICENSE) pour plus de détails.
