# Architecture of Abc-Map

Abc-Map is designed to be scalable but also to operate in an environment with limited resources.

For this purpose the number of mandatory processes for an instance is limited:
- One backend server, which serves frontend as static ressources
- One Mongodb server, which can be external and shared with other applications
- One SMTP server, which can be external and shared with other applications

Backend is stateless, so it can be horizontally scaled.


## TODO

- Describe repository
- Describe CLI
- Describe CI
- Describe tests
