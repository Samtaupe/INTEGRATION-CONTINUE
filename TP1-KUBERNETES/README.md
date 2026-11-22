# TP1 – Découverte de Kubernetes

Ce premier TP Kubernetes m'a servi à lancer un cluster jetable sur mon poste, à en explorer les composants, puis à déployer et exposer une première application.

## Contenu du dossier

- `README.md` : ce compte-rendu
- `pod.yaml` : le manifest du Pod `hello` (nginx), avec les labels `run: hello` et `tier: front`

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
