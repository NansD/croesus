# Croesus backend

mandatory environment variable to use :

```
MONGODB_CONNECTION_STRING
```

example

```
npm run start --  --MONGODB_CONNECTION_STRING mongodb://127.0.0.1/croesus
```

in production, the connection string looks like that :
mongodb+srv://croesus:<password>@croesus.xxxxx.mongodb.net/croesus?retryWrites=true&w=majority
