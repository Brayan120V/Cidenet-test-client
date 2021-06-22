# Cidenet client

## Project setup
```
npm install
```

### Connect with the server

Go to src/services/Api.js and put the server ip and the port

```
baseURL: `http://PUT_HERE_THE_SERVER_IP:PORT/api/v1/`
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Trubleshoting: 

* serve doesn't run: 

Please verify that your node version is > 10.0, the server is running and the server IP in Api.js is correct.