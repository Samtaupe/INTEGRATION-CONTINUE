# TP1 – Docker

Ce premier TP m'a servi à prendre en main Docker. J'ai commencé par les commandes de base sur les images et les conteneurs, puis j'ai lancé un serveur Nginx. J'ai ensuite conteneurisé une petite application Flask, et j'ai fini par la relier à une base MongoDB avec Docker Compose.

## Contenu du dossier

- `app.py` : l'application Flask
- `dockerfile` : la recette de l'image de l'application
- `docker-compose.yml` : lance l'application et MongoDB ensemble
- `requirements.txt` : les dépendances Python (Flask et PyMongo)

## Installation

Docker Desktop était déjà installé sur mon poste Windows. J'ai simplement vérifié la version avec `docker --version` (27.1.1) et contrôlé que Docker Compose v2 était bien disponible.

## Manipulation de base des conteneurs

J'ai d'abord listé les images présentes sur ma machine avec `docker images`. J'ai ensuite téléchargé l'image `hello-world` depuis Docker Hub, puis je l'ai lancée : le conteneur affiche son message de bienvenue et s'arrête aussitôt.

Pour finir, j'ai supprimé le conteneur avec `docker rm`, puis l'image avec `docker rmi`. L'ordre compte : Docker refuse de supprimer une image tant qu'un conteneur l'utilise encore, même arrêté.

## Serveur web Nginx

J'ai récupéré l'image officielle Nginx et lancé un conteneur nommé `mon_nginx`, en arrière-plan, en reliant le port 8080 de ma machine au port 80 du conteneur. En ouvrant http://localhost:8080, je suis bien tombé sur la page « Welcome to nginx! ».

## Application Flask

J'ai écrit une application Flask minimale qui affiche « Hello, World! » sur la route `/`, et un Dockerfile pour la conteneuriser à partir de l'image `python:3.14`.

Voici ce que j'ai retenu en l'écrivant :
- **Ordre des copies :** je copie `requirements.txt` et j'installe les dépendances avant de copier le code. Comme Docker garde cette étape en cache, une simple modification de `app.py` ne relance pas toute l'installation.
- **Écoute sur 0.0.0.0 :** Flask doit écouter sur `0.0.0.0` et non sur `localhost`. Sinon, l'application n'est pas joignable depuis l'extérieur du conteneur. C'est le piège sur lequel je suis tombé en premier.

J'ai construit l'image avec `docker build`, lancé un conteneur sur le port 8080, et vérifié dans mon navigateur que la page s'affichait.

## Docker Compose avec MongoDB

### Modifications de l'application

J'ai ajouté une connexion à MongoDB dans `app.py` avec la bibliothèque PyMongo. Je n'ai pas écrit l'adresse de la base en dur : elle est lue dans des variables d'environnement (`MONGO_URI` et `MONGO_DB`). Le même code fonctionne donc en local, où il pointe vers `localhost`, et dans Docker, où il pointe vers le service `mongo`.

J'ai aussi ajouté une route `/db` qui envoie un « ping » à la base. Elle renvoie le statut de la connexion, le nom de la base et la liste de ses collections. Si MongoDB ne répond pas, elle renvoie une erreur avec le message correspondant.

### Le fichier Compose

Mon `docker-compose.yml` décrit deux services :
- **mongo :** il utilise l'image officielle `mongo:8.0`. Les données sont stockées dans un volume pour ne pas être perdues au redémarrage, et un test de santé vérifie que la base répond, j'ai déjà été amené à créer se genre d'image notament avec `postgre`.
- **app :** il est construit à partir de mon Dockerfile et reçoit l'adresse de la base en variable d'environnement.

### Vérification

J'ai lancé la stack avec `docker compose up -d --build`. Les deux conteneurs sont apparus dans `docker compose ps`, avec Mongo à l'état « healthy ».

J'ai ensuite appelé http://localhost:8080/db, qui m'a renvoyé un statut « ok » avec le nom de la base `tp1`. La connexion entre les deux conteneurs fonctionne donc.

## Ce que je retiens

- **Image et conteneur :** une image est un modèle figé, et un conteneur est une instance de ce modèle qui tourne. On peut lancer plusieurs conteneurs à partir d'une même image.
- **Ports :** sans association de ports, un service qui tourne dans un conteneur reste injoignable depuis la machine.
- **Variables d'environnement :** elles permettent de garder le même code d'un environnement à l'autre.
- **Docker Compose :** il simplifie beaucoup le lancement de plusieurs conteneurs liés entre eux. En une commande, on obtient le réseau, le volume et l'ordre de démarrage.
