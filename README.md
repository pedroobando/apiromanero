# apipeople

## Description
  apirest para guardar solo datos de personas, conexion de base de datos mongo.



## Running the app

```bash
# instalacion
$ npm install

# development
$ npm run dev

# production mode
$ npm run build

# start production mode
$ npm start
```

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

# Objeto Json
  {
    "dni": 10292569,
    "name": "Pedro Obando",
    "enabled": true,
    "usuario": false,
    "cliente": false,
    "proveedor": false,
    "conductor": false,
    "locations": {
      "phones": [],
      "address": "",
      "email": ""
    }
  }
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
  $ docker build -t apilogistimg .

# Crear el contenedor
  $ docker run --name apilogist -it -d -p 3001:3001 apilogistimg

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
