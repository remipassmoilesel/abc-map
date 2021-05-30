# Backlog

## Internationalization

Frontend should be available in French and in English, with an extensible system.   


## Geopackage import

A user should be able to import geopackages in map. A DataReader can be created.


## Geopackage export

A user should be able to export maps or layers as geopackages. A DataWriter can be created.


## Shapefile export

A user should be able to export layers as shapefiles. A DataWriter can be created.


## Web worker usage

Web worker should be used in several tasks of frontend:
- Zip / unzip of project
- Data processing
- ...


## Datastore artefact with prompt

A user should be able to use preconfigured data layer as an artifact.       

For example, he should be able to use Mapbox layers with his own API keys, by selecting a model from the datastore and
enter the necessary information in a prompt.     

Information prompt can be described in resource manifests such as for a WMS layer:    

    remoteUrl: 'https://company.com/wms/$$key'    # $$key will be replaced by prompted value
    remoteLayerName: 'usa:states'
    username: '$$username'                        # $$userame will be replaced by prompted value
    password: '$$password'                        # $$password will be replaced by prompted value
    prompt:                   
    - name: key                                   # Prompt definitions
      labels:
      en: "API Key"
      fr: "Clé d'API"
    - name: username
      labels:
      en: "Username"
      fr: "Nom d'utilisateur"
    - name: password
      labels:
      en: "Password"
      fr: "Mot de passe"


With these prompt statements, we can build a suitable interface to enter the necessary variables, and use 
the data on map.

