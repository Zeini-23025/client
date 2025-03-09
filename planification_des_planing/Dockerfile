# Utiliser l'image officielle de Node.js
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers sources
COPY . .

# Construire l'application React (Vite génère le dossier 'dist', pas 'build')
RUN npm run build

# Installer `serve` globalement pour servir l'application
RUN npm install -g serve

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application React avec serve en utilisant le bon dossier 'dist'
CMD ["serve", "-s", "dist", "-l", "3000"]
