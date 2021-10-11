# How to name translations ?

Create one file per language. E.g:   
```
  i18n/translations/en.json
  i18n/translations/fr.json
  i18n/translations/...
```

Create / use one namespace by view or by shared component. E.g:  

```
  {
    "LandingView": { ... },
    "MapView": { ... },
    "LoginDialog": { ... }
  }
```

Use sub namespaces if necessary. E.g.:  

```
  {
    "MapView": { 
      "PrivateComponent1": { ... }
      "PrivateComponent2": { ... }
     }
  }
```

Then use short english keys describing the words translated. E.g.:  

```
  {
    "LandingView": {
      "Welcome_AbcMap_is_a_free_software": "Abc-Map is a free cartography software, easy to use and to understand",
      "Connection_is_optional": "Connection is optional! You can use Abc-Map without registering 😉"
    }
  } 
```
