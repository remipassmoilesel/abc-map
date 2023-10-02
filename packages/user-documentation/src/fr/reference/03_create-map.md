---
title: Créer une carte
layout: main-layout.njk
---

## Choisir un fond de carte

Sur la page carte, conservez le fond de carte par défaut, ou choisissez un fond de carte en cliquant sur
`Ajouter une couche`.

Vous pouvez utiliser:

- Des couches prédéfinies (des couches préparées et configurées pour être utilisées facilement)
- Des couches <a href="https://fr.wikipedia.org/wiki/Web_Map_Service" target="_blank">WMS</a>
- Des couches <a href="https://fr.wikipedia.org/wiki/Web_Map_Tile_Service" target="_blank">WMTS</a>
- Des couches <a href="https://developers.planet.com/planetschool/xyz-tiles-and-slippy-maps/">XYZ</a>

<video controls src="../assets/add-predefined-layer.mp4" preload="none"></video>

## Quelle couche choisir ?

Essayez tout d'abord les `couches prédéfinies`, ce sont les plus simples à utiliser.

Vous pouvez aussi importer des fonds de carte à partir du magasin de données.

Si vous ne trouvez pas votre bonheur, utilisez votre moteur de recherche préféré pour trouver alternative.
Essayez par exemple de rechercher <a href="https://duckduckgo.com/?q=couche+wms+france&t=h_&ia=web" target="_blank">"couche wms france"</a>. Vous devrez ensuite remplir le formulaire d'ajout de couche,
généralement avec une URL et des identifiants fournis par le propriétaire des données.

<video controls src="../assets/add-datastore-layer.mp4" preload="none"></video>

## Importer des données

Vous pouvez importer des données de plusieurs manières:

- En utilisant le `Catalogue de données`, qui fournit des données sélectionnées (le catalogue est en cours de remplissage)
- En déposant des fichiers de votre ordinateur sur la page `Carte`
- En cliquant sur le contrôle d'import de données de la page `Carte`, puis en sélectionnant des fichiers de
  votre ordinateur

<video controls src="../assets/import-by-drop.mp4" preload="none"></video>

## Ajouter et modifier des formes

Utilisez les outils de dessin pour créer ou modifier des géométries et leurs propriétés. Le fonctionnement de chaque outil  
est expliqué dans son aide respective.

Gardez en tête que:

- Les outils de dessin ne fonctionnent que lorsqu'une couche de géométries est active
- Chaque outil ne modifie que son type de géométrie associé: l'outil polygone ne modifie que les polygones, l'outil point  
  ne modifie que les points, ...

<video controls src="../assets/create-points.mp4" preload="none"></video>

## Appliquer un traitement de données

Sur la page "Traitement de données", vous pouvez appliquer un traitement de données. Les traitements sont expliquées
sur leurs pages correspondantes.

<video controls src="../assets/color-gradients.mp4" preload="none"></video>

## Créer une légende et ajouter une échelle

Sur la page "Mise en page", cliquez sur "Créer une nouvelle page A4" puis sur "Ajouter un cadre de texte".

Un cadre apparait, vous pouvez le redimensionner, ajouter des images ou documenter vos symboles.

Ajoutez un titre et une description pour chaque forme utilisée sur votre carte.

<video controls src="../assets/create-scale-legend.mp4" preload="none"></video>

## Mettre en page et exporter votre carte

Sur la page "Mise en page", créez une ou plusieurs pages en fonction de vos besoins. Lorsque votre création est prête
exportez-la au format `PDF` ou `PNG`:

- Le format PDF permet de créer un document autonome, utilisable sur tout ordinateur ou smartphone
- Le format PNG permet d'intégrer votre carte dans un document, par exemple dans un traitement de texte

<video controls src="../assets/pdf-export.mp4" preload="none"></video>

Vous pouvez aussi exporter les couches de géométries au format GeoJSON, KML ou GPX en utilisant le module d'export de couches.

## Partager votre carte

Vous pouvez partager votre carte en ligne, via un lien ou en l'intégrant sur votre site.

<div class="alert alert-warning">
  <b>⚠️ Attention</b><br />
  Si votre carte contient des identifiants, ces identifiants seront accessibles publiquement.<br />  
  Si ces identifiants donnent accès à des services payants, cela peut entrainer une facturation excessive.<br />  
</div>

<video controls src="../assets/shared-map.mp4" preload="none"></video>

## Sauvegarder en ligne ou exporter votre projet

Inscrivez-vous pour sauvegarder votre projet en ligne, c'est gratuit !

Ou exportez votre projet pour l'enregistrer sur votre ordinateur. Vous pourrez le réimporter par la suite.

<video controls src="../assets/export-project.mp4" preload="none"></video>
