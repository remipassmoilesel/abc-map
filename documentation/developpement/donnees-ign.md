# Données IGN

## Créer une clef d'accès aux données IGN

- Se rendre à l'adresse: http://professionnels.ign.fr/user/register
- Choisir "Je suis un particulier"
- Renseigner les formulaires avec mail + mot de passe (HTTP, dommage)
- Se rendre sur http://professionnels.ign.fr/ign/contrats
- Remplir le formulaire
- Récupérer ensuite la clef sur: 


## WMS: Get capabilities

https://wxs.ign.fr/CLEF/geoportail/r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities


## Authentification par mot de passe

      this.map.addLayer(new OlTile({
        source: new OlTileWMS({
          url: 'https://wxs.ign.fr/CLEF/geoportail/r/wms',
          params: {LAYERS: 'LAYER_TITLE', TILED: true},
          tileLoadFunction: this.tileCustomLoader
        })
      }))

      tileCustomLoader = (tile: any, src: any) => {
        const client = new XMLHttpRequest();
        client.open('GET', src);
        client.setRequestHeader("Authorization", "Basic " + window.btoa("USER:PASSWORD"));
        client.onload = function() {
          tile.getImage().src = src;
        };
        client.send();
      }


## Documentation

Documentation: https://geoservices.ign.fr/documentation/geoservices

URL: Voir la page "Mes commandes" http://professionnels.ign.fr/user/792247/orders
