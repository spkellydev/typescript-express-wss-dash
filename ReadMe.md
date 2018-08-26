# Typescript Express WSS Dashboard API

The purpose of this application is to serve as a RESTful API and Web Socket Server for the React Analytics dashboard.

### Dependencies

- `tsc -w` - this application expect the Typescript complier to be installed globally

```sh
> npm install -g typescript
```

- `nodemon` - this application expects nodemon to be be runnable from `package.json`

```sh
> npm install -g nodemon
```

## Services

#### Google Analytics API

Google Analytics API creditienals should be registered as a service account. The scope of this project is to allow for managers to set up the onboarding of the client, so that the client can have a dashboard for all of their services.

- Register as a service account
- Download JSON key
- Upload JSON key
- Add email address to analytics profile
- Create authorized user
