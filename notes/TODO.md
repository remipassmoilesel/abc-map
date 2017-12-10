# TODO

## Comportement

- Une commande "Signaler un problème" doit être disponible et doit rediriger vers une adresse récupérée en ligne
- L'application doit proposer des mises à jour et se mettre a jour simplement (voir electron auto update)
- ~~Un nouveau project doit avoir comme première couche une carte Openstreetmap.~~

## Fonctionnalités

- ~~Recherche Nominatim~~

## Structure

- Filtrer sur le main process les collections geojson pour éviter des surcharges. Utiliser l'aire des objets pour 
déterminer si leur affichage est pertinent
- ~~Ajouter une factory GeojsonLayer > Leaflet layer~~
- Les couches de données doivent renvoyer une référence vers une base de donnée
- Les couches leaflet de données doivent prendre en BDD le stricte nécéssaire de données (recherche geo)
- ~~Utiliser une interface typée pour le Vuex store~~
- Meilleur arrêt mongodb (db.shutdown())
- Composant dev de démarrage / redémarrage mongodb

## Ressources

- https://github.com/mbloch/mapshaper: simplification et transformation de shapefiles