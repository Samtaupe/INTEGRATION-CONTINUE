# TP1 – Découverte de Kubernetes

Ce premier TP Kubernetes m'a servi à lancer un cluster jetable sur mon poste, à en explorer les composants, puis à déployer et exposer une première application.

## Contenu du dossier

- `README.md` : ce compte-rendu
- `pod.yaml` : le manifest du Pod `hello` (nginx), avec les labels `run: hello` et `tier: front`
- `deployment.yaml` : le Deployment `web` (3 réplicas de `traefik/whoami`)
- `service.yaml` : le Service `web` devant les Pods `app=web`

## Premier Pod

### Lancer et inspecter un Pod

J'ai lancé un premier Pod nginx avec `k run hello --image=nginx:1.27`. `k get pods -o wide` me l'affiche à l'état `Running`.

`k logs hello` affiche les logs de démarrage de nginx. Avec `k exec -it hello -- bash`, j'ai ouvert un shell dans le conteneur : `ls /usr/share/nginx/html` contient bien `index.html` et `50x.html

### Tester l'IP du Pod

La réponse contient bien `<title>Welcome to nginx!</title>`.

### Passer au déclaratif

Le fichier `pod.yml` a été ajouter dans mon dossier de travail après avoir effectuer la commande :

```bash
k run hello --image=nginx:1.27 --dry-run=client -o yaml > pod.yaml
```

Dans `pod.yaml`, j'ai ajouté le label `tier: front` et supprimé les champs vides (`resources: {}` et `status: {}`). J'ai ensuite supprimé le Pod créé à la main pour le recréer à partir du fichier :

Pour finir, j'ai supprimé le Pod avec `k delete pod hello`. Il disparaît et ne revient pas : `k get pods` répond « No resources found ».

## Deployments et ReplicaSets

Le Deployment crée le ReplicaSet `web-9d48888d`, qui crée les 3 Pods. Le suffixe `9d48888d` est un hash du template de Pod.

### Auto-réparation et mise à l'échelle

Quand je supprime les 3 Pods, le ReplicaSet en recrée 3 nouveaux. En repassant de 5 à 3 réplicas, c'est le contrôleur ReplicaSet qui choisit les Pods à supprimer : il a retiré les 2 plus récents.

### Mise à jour et retour arrière

Le passage en `v1.10.2` crée un nouveau ReplicaSet, et l'ancien est gardé à 0 réplica. `k rollout undo` le remet à 3 et revient en `v1.10.1`.

Après l'undo, le cluster tourne en `v1.10.1` alors que `deployment.yaml` indique `v1.10.2`.

## Exposer avec un Service

Le Service `web` reçoit une IP fixe. Ses Endpoints sont exactement les IP des 3 Pods `app=web`.

Depuis un Pod busybox, 6 requêtes sur `http://web` sont réparties entre les 3 Pods. La répartition est aléatoire, pas chacun son tour.

Avec le port-forward, http://localhost:8080 affiche toujours le même Hostname.
