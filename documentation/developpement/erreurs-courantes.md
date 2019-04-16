# Erreurs courantes

## error TS5055: Cannot write file '/home/remipassmoilesel/projects/abc-map/shared/dist/routes/Routes.d.ts' because it would overwrite input file.       

Un fichier du projet référence un fichier de son dossier de build ("dist")


## Un évenements NgRx est lancé deux fois

Arrive notamment avec les devtools redux.

Un objet State est injecté quelque part, c'est une mauvaise pratique. Utiliser store.subscribe.
