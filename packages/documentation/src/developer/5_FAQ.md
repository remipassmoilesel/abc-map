# FAQ

## La carte OpenLayers ne s'affiche pas

- Vérifier les dimensions de la carte, appeler Map.updateSize() si nécéssaire
- Vérifier les couches: elles ne doivent pas être partagées entre plusieurs cartes


## index.js:1 Warning: findDOMNode is deprecated in StrictMode

Cette erreur vient de react-bootstrap, voir: https://github.com/react-bootstrap/react-bootstrap/issues/5075
