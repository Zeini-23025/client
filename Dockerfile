# Étape 1 : Construire l'application React
FROM node:18 as build

WORKDIR /app

# Copier les fichiers package.json et package-lock.json depuis le sous-dossier 'client'
COPY client/package.json client/package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tous les autres fichiers de l'application dans le conteneur
COPY client/ ./

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
