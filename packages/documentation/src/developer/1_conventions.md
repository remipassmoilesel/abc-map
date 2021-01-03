# Conventions de développement

## Répartition des tâches entre clients et serveurs

Les clients doivent effectuer un maximum de tâches. L'application frontend doit être quasiment
autonome.     


## Frontend: Redux vs services

Les services définis dans `services.ts` sont l'API à privilégier.            

Redux est utilisé quand il faut impacter l'interface lors du changement d'un paramètre.       


