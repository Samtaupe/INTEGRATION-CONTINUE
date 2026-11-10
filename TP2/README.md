# TP2 – Optimisation Docker

Ce deuxième TP m'a servi à optimiser une application Docker.

## Contenu du dossier

- `node_modules` : l'ensemble des modules pour faire fonctionner node
- `dockerfile` : la recette de l'image de l'application
- `package-lock.json` : fichier générer par package.json
- `package.json` : l'ensemble des scripts, variables d'environnement et dépendances de l'application
- `server.js` : l'API en json de l'application

## Propositions d'amélioration

Temps de build originel : `Building 26.2s`
Nombre d'étapes : `12`

> Retirer le tag `latest` pour l'implémentation de node `FROM node:latest` et privilégier une version moins lourde (selon la source)

Je suis parti sur la version `22-slim`

Temps de build : `Building 58.6s`
Nombre d'étapes : `12`

la source [ici](https://www.stephane-robert.info/docs/conteneurs/images-conteneurs/ecrire-dockerfile/)
