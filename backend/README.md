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
mongodb://croesus:<password>@croesus-shard-zz-yy.xxxxx.mongodb.net:27017,xxxxxxxxxxx,xxxxxxxxxxxx,xxxxxxx
