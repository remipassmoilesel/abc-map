# TODO

## Comportement

- Je veux pouvoir exploiter les données météo du réseau AROME ?

    https://donneespubliques.meteofrance.fr/?fond=geoservices&id_dossier=14

- Je veux afficher ma position, ma vitesse et ma direction à l'aide d'un capteur (antenne gps, telephone portable)
- Je veux exporter ma carte sous forme de fichier HTML + JS + données JSON
- Je veux exprimer mon projet sous forme de phrase simple, voir des propositions et afficher des assistants 
correspondant à mes besoins.

    Exemple: carte de marseille avec classeur excel
             Afficher marseille
             Assistant de carte
             Assistant Excel
    
- Une commande "Signaler un problème" doit être disponible et doit rediriger vers une adresse récupérée en ligne
- L'application doit proposer des mises à jour et se mettre a jour simplement (voir electron auto update)
- ~~Un nouveau project doit avoir comme première couche une carte Openstreetmap.~~

## Fonctionnalités

- Edition de GeoJSON avec tableur
- ~~Recherche Nominatim~~

## Structure

- Supprimer un projet supprime toutes les couches de données associées
- Réduire les node_modules avec https://www.npmjs.com/package/modclean
- Composant séparé pour édition de couche en tant que classeur
- Instance Jenkins avec builds pour toutes plateformes
- Procédure de test avec: api, gui, build et lancement
- Tests avec ipc mock
- Filtrer sur le main process les collections geojson pour éviter des surcharges. Utiliser l'aire des objets pour 
déterminer si leur affichage est pertinent
- ~~Ajouter une factory GeojsonLayer > Leaflet layer~~
- Les couches de données doivent renvoyer une référence vers une base de donnée
- Les couches leaflet de données doivent prendre en BDD le stricte nécéssaire de données (recherche geo)
- ~~Utiliser une interface typée pour le Vuex store~~
- Meilleur arrêt mongodb (db.shutdown())
- Composant dev de démarrage / redémarrage mongodb

## Ressources

- Voir https://github.com/electron/electron/issues/10905 pour passage à electron 1.8
- https://github.com/mbloch/mapshaper: simplification et transformation de shapefiles