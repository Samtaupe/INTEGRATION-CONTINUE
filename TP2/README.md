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

la source [ici](https://www.stephane-robert.info/docs/conteneurs/images-conteneurs/ecrire-dockerfile/)

### Package.json

> Retirer `mongodb` car elle n'est pas utiliser

> Retirer `nodemon` et le remplacé par `node --watch` qui fait la même chose sans avoir à installer des dépendances suplémentaires

> Retirer `main` car ça concerne uniquement les librairies et pas les applications

> Retirer `NODE_ENV=development` car c'est inutile comme il n'y a plus de devDependencies à télécharger

Temp de build : `Building 7.4s`
Nombre d'étapes : `10`
Taille de l'image : `260MB`

### Server.js

Teste avec un fichier générer comme suit : `1..1000000 | ForEach-Object { "ligne $_ du fichier de test" } | Set-Content maybe-big-file.txt`
Temp d'exécution méthode `/big` : `+ de 5 min`

En plus le reste de l'exécution est bloqué car la méthode est synchrone il faut donc attendre la fin de l'exécution de cette dernière pour pouvoir faire autre chose.

> Ajout condition MiddleWare

On utilise le MiddleWare tant qu'on n'est pas en production.

> Utilisation d'un `stream`

On utilise un `stream` car c'est une exécution asynchrone et on gérer mieux l'erreur en évitant de renvoyé un code 200 et en le remplaçant par un code 404 si on ne trouve pas le fichier.

Temp d'exécution méthode `/big` : `77 ms`
