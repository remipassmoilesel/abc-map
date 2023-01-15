# Create Abc-Map module

This package helps to create Abc-Map module.

Usage:

```
    $ npx -p @abc-map/create-module create-module --name my-module
```

Why ? See [developer documentation](https://gitlab.com/abc-map/abc-map/-/tree/master/documentation/6_modules.md) to learn more.

## Environment variables

- Use `ABC_CREATE_MODULE_DEBUG=true` to increase log verbosity
- Use `ABC_CREATE_MODULE_SOURCE_URL='https://somewhere.net/template.zip'` to change template address.
- Use `ABC_CREATE_MODULE_HEADERS='{"Private-Token":"XXXXXXXXXXXXXXXXXXXXXXXXXXX"}'` to add headers to download requests.
