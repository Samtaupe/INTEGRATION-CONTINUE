# TP2-KUBERNETES – Configuration et isolation

Ce deuxième TP Kubernetes m'a permis de sortir la configuration et les secrets des images, et d'isoler mes déploiements dans des namespaces au sein d'un même cluster.

## Contenu du dossier

- `README.md` : ce compte-rendu
- `namespaces.yaml` : les deux Namespaces `dev` et `test`
- `whoami.yaml` : la ConfigMap `api-config`, le Deployment `api` (2 réplicas de `traefik/whoami`) et son Service
- `index.html` : la page servie par nginx, chargée dans la ConfigMap `site`
- `site.yaml` : le Deployment `site` (nginx) qui monte la ConfigMap `site` en fichiers

## Namespaces

J'ai créé les namespaces `dev` et `test` avec `k apply -f namespaces.yaml`. Ils apparaissent dans `k get ns` à côté de `default` et `kube-system`.

## ConfigMaps

### En variables d'environnement

La ConfigMap `api-config` est injectée dans les Pods `api` avec `envFrom`. Depuis un Pod busybox lancé dans `dev`, `wget -qO- http://api` renvoie une réponse avec la ligne `Name: api-dev`.

J'ai ensuite changé `WHOAMI_NAME` en `api-dev-2` et réappliqué le fichier : la réponse affiche toujours `api-dev`. Après un `k rollout restart deploy api`, les nouveaux Pods affichent bien `api-dev-2`.

Au passage, ma première tentative a échoué avec des erreurs `unknown field "spec.containers"` : l'indentation avait été perdue en copiant le YAML depuis le PDF.

### Montée en fichiers

J'ai créé la ConfigMap `site` avec `k create configmap site --from-file=index.html`, puis je l'ai montée dans `/usr/share/nginx/html`.

J'ai ensuite modifié la page directement dans le cluster avec `k edit configmap site`. Au bout d'environ une minute, la nouvelle version s'affiche bien en rafraîchissant, sans redémarrer le Pod.
