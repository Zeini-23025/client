# Étape 1 : Construire l'application React
FROM node:18 as build

WORKDIR /app

# Copier package.json et package-lock.json depuis le dossier 'planification_des_planing'
COPY planification_des_planing/package.json planification_des_planing/package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers sources nécessaires à la construction
COPY planification_des_planing/src ./src
COPY planification_des_planing/public ./public

# Construire l'application React
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers build dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
