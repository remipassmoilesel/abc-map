<a name="basics"></a>

# Notions basiques

## Les couches

Une carte est composée de couches qui se superposent et qui produisent l'image finale de la carte.

Les couches contiennent les données d'une carte, et elles permettent d'organiser ces données.

Il y a deux types de couches dans Abc-Map: `les fonds de carte` et les `couches de géométries`.

**Les fonds de carte ou couches raster**  
Ces couches contiennent des images. Elles ne peuvent pas être modifiées avec les outils de dessin.

**Les couches de géométries ou couches vectorielles**  
Ces couches contiennent des géométries et peuvent être modifiées avec les outils de dessin.

## Les projets

Les projets permettent de sauvegarder votre travail. Lorsque vous exportez votre projet, vous créez un fichier qui contient tout votre travail en cours.

Un projet contient:

- Toutes les couches et données de votre carte
- Les mises en page de votre carte
- Les cadres de texte et les images de votre carte
- Les images de vos mises en pages et partages

Les projets exportés ont l'extension de fichier `.abm2`. Il ne sont utilisables qu'avec Abc-Map. Ce sont des
<a href="https://fr.wikipedia.org/wiki/ZIP_(format_de_fichier)" target="_blank">archives Zip</a> contenant toutes les informations de votre projet dans un
format proche de GeoJSON.

### Identifiants

Si votre projet contient des identifiants d'accès à des services tiers (par exemple des identifiants de couches de tuiles XYZ), alors ces identifiants seront
sauvegardés avec votre projet.

Attention, si vous partagez votre projet alors vous partagerez vos identifiants.

<div class='alert alert-info'>
Dans une version précédente, les projets était protégés par mot de passe mais cette fonctionnalité a été enlevée.
</div>
