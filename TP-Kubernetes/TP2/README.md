# TP2-KUBERNETES – Configuration et isolation

Ce deuxième TP Kubernetes m'a permis de sortir la configuration et les secrets des images, et d'isoler mes déploiements dans des namespaces au sein d'un même cluster.

## Contenu du dossier

- `README.md` : ce compte-rendu
- `namespaces.yaml` : les deux Namespaces `dev` et `test`

## Namespaces

J'ai créé les namespaces `dev` et `test` avec `k apply -f namespaces.yaml`. Ils apparaissent dans `k get ns` à côté de `default` et `kube-system`.
