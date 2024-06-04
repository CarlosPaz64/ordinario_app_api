# Proyecto correspondiente al examen ordinario de Aplicaciones de Base de Datos (Proyecto de la API que consume la aplicación)
Este proyecto contiene los querys, las conexiones y los servicios necesarios para hacer funcionar al proyecto de la aplicación de:
+ **[Aplicación de gestión de tareas](https://github.com/CarlosPaz64/ordinario_app_database.git)**
+ El esquema de base de datos a utilizar es el siguiente:
```
CREATE DATABASE IF NOT EXISTS tasks_organizer;

USE tasks_organizer;

CREATE TABLE IF NOT EXISTS users(
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(40) NOT NULL, 
apellidos VARCHAR(100) NOT NULL,
correo VARCHAR(100) NOT NULL UNIQUE,
contrasenia_hashed TEXT
);

CREATE TABLE IF NOT EXISTS tasks(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion LONGTEXT NOT NULL,
    estatus ENUM('To do', 'Doing', 'Done') NOT NULL DEFAULT 'To do',
    fecha_finalizacion DATE NOT NULL,
    importancia ENUM('critical', 'important', 'optional') NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES users(id)
);


-- DROP DATABASE tasks_organizer;
```
+ Las variables de entorno de este proyecto son las siguientes:
```
DB_CONNECTIONS=10
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=prueba123
DB_NAME=tasks_organizer
SECRET_SESSION=solo_quiero_aprobar_la_materia
PASSWORD_SALT_ROUNDS=10
RSA_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIJJgIBAAKCAgBeSgjz2qIJxJW/R3+9YK5vIx+SSVDkhMNqqNwOTUDU53bVAwH3\n07H4ptZ+boDhHy3RsfOkZtGVxOahwfZSX5MT/aRqU/Xw3Lv15zh53ERmxRBv3bXX\n4qneQYEnCkN4ZBCCoX8dpO4GTmZGoctKEkl4wGRA1eFVNYB7x4ZCgt3mKboQzaVd\nVBCZPv1zGvyfNjp1P+egu+vfF1lK648hv8YOj9AoWjOSxZYLU38ySnGXajcjYG92\nhbCJ5bsSp0TaLgiLTp567821PWL271TdJa2xkT5xBD7O2YU1DQc+9VabYERkmX9+\nJV43BJUAY3fOtslFUIBZgYbouj4MUH4ds7058zoIDoJN1dJ7/38PeI7thUrMYzAJ\nLaDWB+NtAGshLe7vZywuxwEIgHV94KboDMTcqXSGrIX1KHmakrgFn16rj+v7m0Os\nttmPk/4OTzc1d3qb7UaUk3YRpWFdAq4mBN3uZQ+/JKyeBshe77GG0grHS3Qy8hgP\nG68R95Iw0e+EWjF2BYp0jGO7sQbvVgplHIB1JucPDeaHpAXy5MXqgHFy96ngu9Wk\n0vzr0RFciR6nqpMFy7RE7BaqQEfPsoENPLI1t6SrOHBLDQ8/hUbTvrIr8ntl+OKO\noLAx5gddPxopccY0cYOIPpf69uOlcjiL3/ce6CETjFFAdjn0aoWgoRYcRwIDAQAB\nAoICACpidWvI2BYz/Gyjo1Rp5X+n9kU4F9jhpUaI6YK0T3RlKBHQ7E2PJ+1ycfEb\nk2ufLGWa7L72SThd7p7AJg4ZUHAoEISLgX7oesWrTsPYtBbOdvkSXO/SwDFcmMYH\n4xR3RsSx/AZDYYwMKgWOLWf6mHRjZ62Nd2FqT3tU0ZGMaltQXoe3KaKua1e37Q6V\nDwIyykxykZi7YOhEAqufABRXtJxPIW9CPPS5RR2KRx9AP5ek82w/qVtJ9XXHgzR7\nZIP/NXAJw0vYCEx0b8w5AZj3mwC7HaqIEgPB3BNg6+TtPCVUPOpL5fe6rINm1+P4\n0p5lpEw4R7n0c8SiE8pNVKPdbC3YwnbhJFc0x3aJhh81wj1WkHn2lO7P8t+Q5ahb\nK1TFXz923CjA+vLT0h5hjVdT7K9MOR6/WZIjyiayfvCsM2pnZj+sMQxui5GKZpbf\nywMFSIdwkTShcqOvle1jJLTcj1kRWR6AOZ9LIUUcHDBbfaNGSWmOZ+DdIFaOoCMy\nEo8lJ0JVaJ4iuZLkY4R6i4OBDfJfOTZqC1NV8Jc5iCzcTtj3aoI/qOYej/f442tj\nW1j0IQkElkP3baJ2tVlQ3mcWjizbviWNRpJb7BY21uoM8OOnInvH+1a99JfHf0EY\n+w+GCbPj0W1Xss6t+KLfTKiAe8ryW4h2Tf4uoDJ91KV9UEyhAoIBAQCjPTY4G8jy\nwsBR4hzto6r+juBbBLCmiaohNy6+Ai8wrHEnHEBmmUjnUeBP/UOecH2Rmv5aenjg\nZL5oF8uKoHdSWzic4H290jUkQUbPSMsBD1GTVQUcHvi5iGImSDDNy1h8m/ccaP+a\nuYSJa/L5FT23J1JYLxaHFY/scAVhLHksIkW4vzeVXTppqZckgK7Mz+8to4IfzBT1\nPWvFVvgQExa6FgGZlWh463D235nacUotUxlyFgOmRnUxnxQigPyy6Htazaed96QR\n+AXxgwmXsHpY6ZUrkJ60yEHLJXIrprSFTrRFl0ltC+gxpjE4DydvD8zRjsNY447F\ni+ktBZXdVlKLAoIBAQCT3oNSAp5j7LO1tMklTkvMyt0g5H6vdz/jtSpV18rPTuUV\nc3MTlylPnZm1rvPp7rVJnvj4Zg3x14YHMTbAarme/UCpOLzCHAi8WFl3gNTAxcMG\naYDYJn6SbvTfgiW6STZrRCDLigKOZR90IRx85mSqeHdsDOsM7MIuzrt2aZA9ZuPb\n8MglSsrYtK+y4FBSziSag7ONxWF3TwAQzhirbTnhBNvQFotUNeuIleYT3yMrD+k+\nD362Pqenma6LGgeqlupZIRvnq4ICpZ0rynSlgPndFncjHOfzUMGG9OQ59mybVCJP\nH0vX6CEVm9okIOmydN0+l6REVbTHQKXLvdCPoUC1AoIBACBDY+j5DOF2Pn6wmxkY\n5R4E7TDwH137DYYdGv7w/ZS4MHETc2MT3sXhd903aFrzTs4tfSIy3Js1LjDyqwcO\nKic74leXQyL2Xgx5Xl5vu7fM6EmfXzAsquo4m3WHhSXXj/io9tFFq2dQTXK/xDkY\nyqbdfbfyLpiqWVTY2ydWm+huKauXF4xM7dOeckIDsQjH/DTgAUL5mhbSee95/fNn\nYnGLEeviDNEBb8VLcmQrSgblSr0yvqvpdxZEo70iE0/lBSRwSzW8kU//3mTailXR\nyoyyNgpzPfrrLZ3SG9umyj0izhyHBzsnRFAz0byLujaIP+oXNmLmLvy6Z26/kNw7\nSHsCggEALmZzhMeHlkmPduRc/hTcmk3KJ+kri7n61WRi/X7yiCz0m8+Xe71CXFZT\nBnz40x5xysFU1PWJSKtdxmH+EVEsICTOJovER5DueNOsd2B44mjsMtXmdW1W6HJi\n6sP3PMZ+ihhdxiDvfmli/ljpjJPrYMbeioxfMbYVlQSQNK8ZcPsZY0niNDmM/4Vr\nYNEcw28mc0oCjOk0FXE3zw4tFZX3xJF2vIxmei1VVI3dHb02VuvuP+gy1dNBXslN\nyR6I61HiBcfq7r6V1GjNshEcm1amkWbcSatnaaWcpNGx0DJwkClNftCORxjzUMmQ\nISgmzTX4uwxwonTWfnPd0tokWP27xQKCAQAy/ZoujWihqAqp3HnRy7DeKUwQpgvc\nH3VRktHVjTkk1XkjjnDMFgbXg88nEmnnkAGDHbYlJhOM7VsO8bZqkh+RtPZLlW1F\n8jU1b8o9LT4ccvqJWD2kJrWXtXkH8Z/8tIFAS5xy0ZvyFpelLGzesftiZlHpCuSy\nqF6VyliclFm0j9j9/vaHVj8+pvHhrDWda0ICW/xqhsPI9ieuS3yM3A0WCUJS2TVq\n4XMuYJgyx2OshuUx8BTMElFbZ5fiCNw5nedkU6Ed1959kDC/xWVFVIvYCtMaBrzj\naNM53NrktEy5oh5v7GEkFONlqB2eCpgwUxPOtSgfruDPrA4sY2crY5XY\n-----END RSA PRIVATE KEY-----"
AES_PRIVATE_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```
> **NOTA IMPORTANTE:** Favor de no cambiar el valor de RSA_PRIVATE_KEY ya que la API ya está configurada con esa nomenclatura.

+ Así mismo considerar que el archivo ``` app.js ``` contiene una configuración de CORS que le permite al ```localhost:3000``` hacer solicitudes. Por ello, si se desea cambiar el puerto del proyecto considerar lo siguente:
```
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from http://localhost:3000
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
```

+ Finalmente, se deberá de tener encendido este proyecto y el de la aplicación encendidos para que funcione :D
