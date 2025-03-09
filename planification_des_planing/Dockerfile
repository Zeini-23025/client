FROM node:20

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers sources
COPY . .

# Construire l'application React
RUN npm run build

# Installer `serve` globalement pour servir l'application
RUN npm install -g serve

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application React avec serve en utilisant le dossier build
CMD ["serve", "-s", "build", "-l", "3000"]
