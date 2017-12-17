# Tests

## Client

Les tests de client sont embarqués et éxécutés directement dans le processus renderer de l'application.

Cette solution s'est imposée à cause de trop nombreuses difficultés d'installation d'outils de test (Spectron, Karma, 
mocha-electron, etc...)

Voir le fichier `test.ts`.

Perpectives:

- Mettre à disposition les logs et le code de retour pour la CI sur le main process.
- Webdriver.io
