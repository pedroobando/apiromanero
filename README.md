# apiromanero

## Description
  apirest datos de la aplicacion romanero, conexion de base de datos mongo.

## La base de datos

```bash
  # mongo
  base de datos es Mongo, la cual se ejecuta desde un contenidor Docker.
  mediante el comando,
  $ docker-compose up

# docker-compose.yml
  Contiene la configuracion del contenedor docker y mongo,
  instala de una ves la base de datos y la aplicacion mongo-express,
  permitiendo administrar de forma grafica el servidor de base de datos.
```

## rutas

```bash
  Usuarios
  http:/...:xxxx/api/users
```

```bash
  Conductores
  http:/...:xxxx/api/conductores
```



## Objetos Json 

### Usuario 
```bash
  {
    "_id": "5ed2dd7a4d24b417bee90cc0",
    "login": "antonio",
    "pass": "12234",
    "email": "antoniomartinez@gmail.com",
    "nombre": "Antonio Martinez",
    "roll": "Administrador",
    "lastlogin": {
      "date": "Sat May 30 2020",
      "mdate": "Sab, 30 May, 2020",
      "time": "06:26:02 PM",
      "stamps": 1590877562568
    }
  },
```


## kill process active

```bash
# Primero, querrá saber qué proceso está utilizando el puerto 3000
$ sudo lsof -i :3000

# Esto enumerará todos los PID que escuchan en este puerto, una vez que tenga el PID puede terminarlo:
$ kill -9 {PID}
```

## Guias Varias

[Guia Conexion serial ttl](https://ubuntuperonista.blogspot.com/2017/09/como-me-conecto-traves-de-conexion-serial-ttl-ubuntu.html), [Guia de serialport](https://github.com/node-serialport/node-serialport#readme)

## Guia de SerialPort

```bash
# Muestra los puertos USB
  $ dmesg | grep tty

# Activa los permisos para lectura puerto
  $ sudo chmod a+rw /dev/ttyACM0
```

## Guia Docker

```bash
# Crear la imagen
  $ docker build -t apiromaimg .

# Crear el contenedor
# puerto_expuesto: puerto_interno
# -it: modo interactivo
# -d: modo deployment
  $ docker run --name apiromanero -it -d --restart always -p 3001:3003 apiromaimg

# Guida de node Docker
  https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Entrar a un contenedor
  $ docker exec -i -t contenedorId /bin/bash #
  $ docker exec -i -t contenedorId /bin/sh # <= alpine

# Extraer la base datos del contenedor
  $ docker cp contenedorId:/app/logisticadb.sqlite  .

# Copiar archivo al contenedor
  $ docker cp nombredelarchivo  contenedorId:/rutadestino
```

## License

  Pedro Obando is [MIT licensed](LICENSE).
