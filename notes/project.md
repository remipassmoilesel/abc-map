# Projet

## Description

Un projet est un objet décrivant un projet de carte.

Il ne contient que des métadonnées: URL de serveurs, références, etc ....

## Couches

Types de couches:
- Couches de tuiles distantes
- Couches de tuiles locales
- Couches de features locales

## Diffusion des données

Les couches pouvant contenir des milliers de features, il est important de ne mettre à disposition du client
que les données dont il a besoin.

Solution: stream par IPC ?