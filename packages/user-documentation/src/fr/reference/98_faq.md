---
title: FAQ
layout: main-layout.njk
---

## Puis-je utiliser Abc-Map pour un usage commercial ?

Oui, vous êtes libre d'utiliser Abc-Map pour un usage commercial.

Vous êtes également libre de modifier, partager, distribuer ce logiciel dans le cadre de la licence <a target="_blank" href="https://www.gnu.org/licenses/agpl-3.0.html">GNU AGPLv3</a>.
Cette licence est expliquée <a target="_blank" href="https://www.gnu.org/licenses/quick-guide-gplv3.fr.html">ici</a>.

Cependant, pensez à respecter les licences des données que vous utilisez.

## Quels sont les formats de données utilisables dans Abc-Map ?

Vous pouvez utiliser dans ce logiciel:

- des fichiers GPX
- des fichiers KML
- des fichiers GeoJSON
- des fichiers TopoJSON
- des fichiers Shapefile
- des couches WMS
- des couches WMTS
- des couches XYZ
- des classeurs CSV

## Je veux ajouter du texte sans ajouter une géométrie

Pour l'instant ce n'est pas possible ! N'hésitez pas à soutenir le projet.

## Je veux ajouter des flèches

Pour l'instant ce n'est pas possible ! N'hésitez pas à soutenir le projet.

## Après avoir importé un fichier je ne vois rien sur la carte

Le fichier est peut-être non supporté, défectueux, ou le système de coordonnées n'est pas supporté. Créez une <a href="https://gitlab.com/abc-map/abc-map/-/issues" target="_blank">Issue</a>.

## Je veux télécharger la version 1

Aïe ! Puisque vous insistez, <a href="https://sourceforge.net/projects/abc-map/" target="_blank">c'est ici !</a>

## J'ai besoin de faire XXX mais ce n'est pas possible

Créez une <a href="https://gitlab.com/abc-map/abc-map/-/issues/new?issue" target="_blank">Issue</a> et décrivez votre besoin aussi précisément que possible (vous devez créer un compte Gitlab, c'est gratuit). Vous receverez une réponse rapidement.

## Où est le code source d'Abc-Map ?

Le code source de l'application est disponible <a target="_blank" href="https://gitlab.com/abc-map/abc-map">ici</a>.

## Les nombres que j'utilise ne fonctionnent pas

Si vous utilisez des données numériques et que les résultats de traitement sont bizarres, vous devez peut-être vérifier le format de vos
nombres.

Ces formats fonctionnent:

```
123
1 234
1 123.123
1 123,123
```

Mais ces formats ne fonctionnent pas:

```
1,123,123
1,123,123.123
```
