# TP2 – Optimisation Docker

Ce deuxième TP m'a servi à optimiser une application Docker.

## Contenu du dossier

- `node_modules` : l'ensemble des modules pour faire fonctionner node
- `dockerfile` : la recette de l'image de l'application
- `package-lock.json` : fichier générer par package.json
- `package.json` : l'ensemble des scripts, variables d'environnement et dépendances de l'application
- `server.js` : l'API en json de l'application

## Propositions d'amélioration

### Dockerfile

Temps de build originel : `Building 26.2s`
Nombre d'étapes : `12`
Taille image : `1.32GB`

> Retirer le tag `latest` pour l'implémentation de node `FROM node:latest` et privilégier une version moins lourde (selon la source)

Je suis parti sur la version `22-slim`

Temps de build : `Building 58.6s`
Nombre d'étapes : `12`
Taille de l'image : `650MB`

> Retirer `COPY node_modules ./node_modules` car `npm install` le fait déjà

Temps de build : `Building 41.7s`
Nombre d'étapes : `11`
Taille de l'image : `640MB`

> Retirer les paquets inutiles `build-essential`, `ca-certificates` et `locales`

Temp de build : `Building 8.6s`
Nombre d'étapes : `11`
Taille de l'image : `261MB`

> Favoriser un seul port les deux autres sont inutiles

Temp de build : `Building 7.2s`
Nombre d'étapes : `11`
Taille de l'image : `261MB`

> Retirer `RUN npm run build` car ça ne fait rien à part ça `"echo \"build step \"` qui est inutile

Temp de build : `Building 6.3s`
Nombre d'étapes : `10`
Taille de l'image : `261MB`

### Package.json

la source [ici](https://www.stephane-robert.info/docs/conteneurs/images-conteneurs/ecrire-dockerfile/)
