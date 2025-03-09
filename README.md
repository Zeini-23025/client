### **Gestion d'Emploi du Temps - Frontend**

📌 **Objectif**

L'application **Gestion d'Emploi du Temps (Frontend)** permet une interaction utilisateur fluide et intuitive pour gérer les emplois du temps des enseignants et des groupes, en offrant une visualisation et une modification aisées des différentes entités du système.

📖 **Description du Frontend**

🚀 **Fonctionnalités du Frontend**

✅ **Gestion des groupes** : Visualisation, ajout et modification des groupes et sous-groupes.  
✅ **Gestion des matières** : Ajout et association des matières aux groupes.  
✅ **Gestion des enseignants** : Liste, ajout et modification des enseignants et gestion de leurs disponibilités.  
✅ **Disponibilités des enseignants** : Planification des créneaux horaires disponibles.  
✅ **Emploi du temps** : Affichage et modification des emplois du temps des enseignants et groupes.  
✅ **Contraintes horaires** : Gestion des contraintes horaires pour assurer un emploi du temps optimal.  
✅ **Charges hebdomadaires** : Suivi et gestion des heures de cours par enseignant et par matière.  
✅ **Affectation des enseignants** : Attribution des enseignants aux matières et aux groupes en fonction de leur disponibilité et des charges de travail.  

🖥️ **Technologies Utilisées**

- **React.js** : Librairie JavaScript pour la construction d'interfaces utilisateur réactives.
- **React Router** : Gestion des routes pour la navigation entre les différentes pages.
- **Tailwind CSS** : Framework CSS pour un design moderne et responsive.
- **Axios** : Librairie pour la gestion des requêtes HTTP vers le backend.

🐳 **Conteneurisation avec Docker**

Le frontend est conteneurisé avec **Docker** afin de simplifier le déploiement et l’exécution de l’application sur différents environnements.

⚙️ **CI/CD avec GitHub Actions**

Un pipeline **CI/CD** est configuré via **GitHub Actions** pour automatiser le processus de build et de déploiement du frontend.

📂 **Livrables**

✅ **Code source** du frontend hébergé sur GitHub.  
✅ **Dockerfile** pour conteneuriser l’application frontend.  
✅ **Workflow GitHub Actions** automatisant le build et le push de l’image Docker.  
✅ **URL du dépôt Docker Hub** contenant l’image Docker du frontend.  

📎 **Liens Utiles**

🔗 **Dépôt GitHub - Frontend** : [\[Lien du repo GitHub\]](https://github.com/Zeini-23025/client)
🐳 **Dépôt Docker Hub** : [\[Lien de l’image Docker\]](https://hub.docker.com/r/zeini/docker-client)
 

📌 **Exécution du Frontend**

🔧 **Méthode 1 : Utilisation de Git**

Si vous souhaitez utiliser **Git** pour récupérer le code source et exécuter le frontend localement, suivez ces étapes :

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/Zeini-23025/client
cd client

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Lancer l’application
npm run dev
```

4️⃣ Accéder au frontend :  
Ouvrez votre navigateur et allez sur : **http://localhost:3000** (ou autre port selon la configuration de Vite).

🐳 **Méthode 2 : Utilisation de Docker**

Si vous souhaitez exécuter le frontend avec **Docker**, voici les étapes :

```bash
# 1️⃣ Récupérer l’image Docker depuis Docker Hub
docker pull zeini/docker-client:latest

# 2️⃣ Exécuter le conteneur Docker
docker run -p 3000:3000 zeini/docker-client
```

3️⃣ Accéder au frontend :  
Ouvrez votre navigateur et allez sur : **http://localhost:3000**  

⚙️ **CI/CD avec GitHub Actions**

Le frontend utilise **GitHub Actions** pour automatiser le build et le push de l’image Docker à chaque push sur la branche **main**.

📄 **License**

Ce projet est sous la **MIT License** - voir le fichier [LICENSE](./LICENSE) pour plus de détails.
