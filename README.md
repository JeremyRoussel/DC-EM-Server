# MegaMail Back-End
This is a backend node server to provides access control to a front-end through JWT verification.

It has .env declared values for a hosted database, not included in this repo.

It also includes whitelist url protection, and enables CORS for local development.

Database entries for the users table have the form:
ID - SERIAL
user_Name - REQUIRED, NOT_NULL
email - REQUIRED, UNIQUE, NOT_NULL
password - REQUIRED, NOT_NULL

View the app here: Insert link to hosted site.

MegaMail Front-End: https://github.com/JeremyRoussel/DC-EM-React

# Contributors
## Jeremy Roussel

https://github.com/JeremyRoussel

## Chris David

https://github.com/CM-David

## Dan Gelok

https://github.com/dgelok

## Woody Connell

https://github.com/woody-connell
