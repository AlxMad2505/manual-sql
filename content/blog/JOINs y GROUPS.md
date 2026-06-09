# Entendiendo los JOINs y GROUPS en MySQL

Para ilustrar cómo funcionan los diferentes tipos de `JOIN` en MySQL, utilizaremos dos tablas de la base de datos `colegio`:

1. **`alumnos`**: Contiene la información personal de cada estudiante, donde el identificador único es `clave_alu`.
2. **`pagos`**: Registra las transacciones financieras y se relaciona con los estudiantes a través de la columna `clave_alu`.

Primero podemos llevar a cabo una consulta con la tabla `alumnos`:

```sql
SELECT clave_alu, nombre, ap_paterno
FROM alumnos;
```

Los primeros 5 resultados que obtenemos son los siguientes:

| clave_alu | nombre         | ap_paterno |
| --------- | -------------- | ---------- |
| 11030172  | ARGELIA        | BORBOLLA   |
| 11030173  | KARLA MARIANA  | CASTRO     |
| 11030177  | OCTAVIO        | FERRUSCA   |
| 11030178  | RAFAEL         | GARCIA     |
| 11030183  | RAMON HUMBERTO | JIMENEZ    |


En el caso de la consulta a la tabla de `pagos`, podemos mandar a llamar también la columna `clave_alu`:

```sql
SELECT clave_alu, pago, fecha_pago
FROM pagos;
```

Los primeros 15 resultados que obtenemos son los siguientes:

| clave_alu | pago  | fecha_pago          |
| --------- | ----- | ------------------- |
| 11040207  | 7000  | 2017-03-15 00:00:00 |
| 11070167  | 5600  | 2017-03-15 00:00:00 |
| 11070129  | 5600  | 2017-03-15 00:00:00 |
| 11070166  | 5600  | 2017-03-15 00:00:00 |
| 11040155  | 7000  | 2017-03-15 00:00:00 |
| 11030178  | 16900 | 2017-11-26 09:16:31 |
| 11070119  | 5600  | 2017-03-15 00:00:00 |
| 11060201  | 2600  | 2017-10-31 00:00:00 |
| 11040275  | 7000  | 2017-03-15 00:00:00 |


## 1. JOINs en MySQL

Hasta este punto hemos visto las tablas alumnos y pagos por separado. La tabla alumnos contiene información personal de cada estudiante, mientras que la tabla pagos almacena los pagos realizados. 

Sin embargo, en la tabla pagos únicamente se guarda el identificador del alumno y no su nombre, por lo que si quisiéramos saber quién realizó cada pago tendríamos que hacer consultas adicionales y relacionar manualmente los datos de ambas tablas. 

Los JOIN nos permiten resolver este problema de forma sencilla, ya que unen la información de dos o más tablas a través de un campo en común. De esta manera podemos obtener en una sola consulta datos del alumno y de sus pagos, generando resultados más completos y fáciles de interpretar.

La clave para cualquier `JOIN` es encontrar una columna en común (en este caso, `clave_alu`) que sirve como puente entre ambas tablas.

### 1.1. INNER JOIN: Intersección Exacta

El `INNER JOIN` (o simplemente `JOIN`) devuelve **únicamente** las filas donde hay una coincidencia en ambas tablas. Si un alumno no ha hecho pagos, o si un pago no tiene un alumno válido asociado, no aparecerán en el resultado.

**Ejemplo:** Queremos obtener el nombre completo del alumno junto con el monto de su pago y la fecha en que lo realizó.

```sql
SELECT a.clave_alu, a.nombre, a.ap_paterno, p.pago, p.fecha_pago
FROM alumnos AS a
INNER JOIN pagos AS p ON(a.clave_alu = p.clave_alu);
```

**Explicación técnica:** 
`FROM alumnos AS a`: Definimos nuestra primera tabla y le damos un alias (`a`) para abreviar su escritura en la consulta.

- `INNER JOIN pagos AS p`: Indicamos la segunda tabla a unir (`p`).
- `ON a.clave_alu = p.clave_alu`: Es la **condición de unión**. MySQL comparará cada `clave_alu` de la tabla de alumnos con la tabla de pagos y solo devolverá las filas en donde el valor sea idéntico.

**Resultado:**

| clave_alu | nombre       | ap_paterno | pago | fecha_pago          |
| --------- | ------------ | ---------- | ---- | ------------------- |
| 11040207  | STEFANIA     | OROZCO     | 7000 | 2017-03-15 00:00:00 |
| 11070167  | ROGELIO      | PI         | 5600 | 2017-03-15 00:00:00 |
| 11070129  | CARMEN SOFIA | COPADO     | 5600 | 2017-03-15 00:00:00 |
| 11070166  | JORGE        | PEREZ      | 5600 | 2017-03-15 00:00:00 |
| 11040155  | RODRIGO      | LANDAVAZO  | 7000 | 2017-03-15 00:00:00 |

### 1.2. LEFT JOIN: Priorizando la Tabla Izquierda

El `LEFT JOIN` devuelve **todas las filas de la tabla de la izquierda** (la primera que declaras en el `FROM`), independientemente de si tienen coincidencias en la tabla de la derecha. Si no hay coincidencia, MySQL llena los espacios faltantes con valores nulos (`NULL`).

**Ejemplo:** Queremos una lista de todos nuestros alumnos para revisar su estado de cuenta. Si algún alumno de la lista aún no ha pagado, el sistema nos mostrará el campo del pago vacío.

```sql
SELECT a.clave_alu, a.nombre, a.ap_paterno, p.pago
FROM alumnos AS a
LEFT JOIN pagos AS p ON(a.clave_alu = p.clave_alu);
```

**Explicación técnica:**
La tabla izquierda es `alumnos`.

- El motor de base de datos recorrerá todos los registros de los alumnos. Cuando encuentre a un estudiante que no exista en la tabla `pagos` (es decir, que no haya emitido un pago), de igual forma lo imprimirá en el resultado final, pero en la columna `p.pago` mostrará un `NULL`.

**Resultado:**

| clave_alu | nombre         | ap_paterno | pago   |
| --------- | -------------- | ---------- | ------ |
| 11030172  | ARGELIA        | BORBOLLA   | 2800   |
| 11030183  | RAMON HUMBERTO | JIMENEZ    | `null` |
| 11030229  | EMILIO         | OLVERA     | 7000   |
| 11030213  | RAUL ANDRES    | COSS       | `null` |
| 11030217  | CESAR          | FERRUSCA   | 2800   |

### 1.3. RIGHT JOIN: Priorizando la Tabla Derecha

El `RIGHT JOIN` es la contraparte exacta del `LEFT JOIN`. Devuelve **todas las filas de la tabla de la derecha**, y las coincidencias de la izquierda. Si hay datos en la derecha que no tienen relación con la izquierda, devuelve `NULL` en las columnas correspondientes a la tabla izquierda.

**Ejemplo:** Queremos ver todos los pagos registrados en el sistema, asegurándonos de que no haya pagos sin un alumno asignado (lo que podríamos llamar pagos "fantasma").

```sql 
SELECT p.clave_alu, p.id AS folio_pago, p.pago, p.fecha_pago, a.nombre, a.ap_paterno 
FROM alumnos AS a 
RIGHT JOIN pagos AS p ON(a.clave_alu = p.clave_alu);
```

**Resultado:**

| clave_alu | folio_pago | pago  | fecha_pago          | nombre       | ap_paterno |
| --------- | ---------- | ----- | ------------------- | ------------ | ---------- |
| 11040207  | 24574      | 7000  | 2017-03-15 00:00:00 | STEFANIA     | OROZCO     |
| 11070167  | 24575      | 5600  | 2017-03-15 00:00:00 | ROGELIO      | PI         |
| 11070129  | 24576      | 5600  | 2017-03-15 00:00:00 | CARMEN SOFIA | COPADO     |
| 11030178  | 25554      | 16900 | 2017-11-23 00:00:00 | RAFAEL       | GARCIA     |
| 11030178  | 25833      | 7000  | 2017-06-20 00:00:00 | RAFAEL       | GARCIA     |

### 1.4. Casos de uso de los JOINs

- **INNER JOIN:** Cuando necesites datos estrictamente consistentes en ambos lados.
- **LEFT JOIN:** Cuando necesites un reporte completo de tu entidad principal, tenga o no registros secundarios asociados.
- **RIGHT JOIN:** Mismo principio que el LEFT, pero dándole prioridad a la segunda tabla.

### 1.5. Agrupamientos en MySQL

Cuando trabajamos con bases de datos, muchas veces no queremos ver los registros individuales, sino obtener datos resumidos o estadísticos. Para esto sirven los agrupamientos.

`GROUP BY` toma múltiples filas que comparten el mismo valor en una columna y las une en una sola fila resumen.

## 2. GROUPS en MySQL

Para usar `GROUP BY`, casi siempre necesitamos acompañarlo de una función de agregación, la cual decide qué hacer con los datos numéricos de las filas que se van a fusionar. Las principales son:

* `COUNT()`: Cuenta el número de registros.
* `SUM()`: Suma los valores de una columna.
* `AVG()`: Calcula el promedio de los valores.

### 2.1. Ejemplo con SUM(): Total pagado por cada alumno

Si queremos saber cuánto dinero en total ha pagado cada estudiante, necesitamos agrupar por el identificador del alumno y sumar sus pagos.

```sql
SELECT a.clave_alu, a.nombre, a.ap_paterno, SUM(p.pago) AS total_pagado
FROM alumnos AS a
INNER JOIN pagos AS p ON(a.clave_alu = p.clave_alu)
GROUP BY a.clave_alu, a.nombre, a.ap_paterno
ORDER BY SUM(p.pago) DESC;
```

**Explicación técnica:**

- `GROUP BY a.clave_alu...`: Le indicamos a MySQL que si encuentra la misma clave de alumno en varias filas (como un alumno que ha hecho 2 o 3 pagos), colapse esas filas en una sola.
- `SUM(p.pago)`: Al colapsar las filas de un mismo alumno, esta función toma todos sus pagos individuales y los suma para mostrar un único total.

**Resultado:**

| clave_alu | nombre            | ap_paterno | total_pagado |
| --------- | ----------------- | ---------- | ------------ |
| 11040234  | KARLA PAULINA     | ESCUDERO   | 36000        |
| 11040297  | PAULINA ALEXANDRA | RIOS       | 36000        |
| 11030208  | JOSE DE JESUS     | ALVAREZ    | 36000        |
| 11060209  | ROBERTO           | VAZQUEZ    | 35900        |
| 11040268  | ROSA MARIA        | ALVARADO   | 35900        |

### 2.2. Ejemplo con COUNT(): Cantidad de transacciones por alumno

Si lo que nos interesa no es el dinero total, sino cuántas veces ha ido el alumno a realizar un pago a ventanilla o plataforma, podemos usar la función `COUNT()`:

```sql
SELECT a.clave_alu, a.nombre, COUNT(p.id) AS numero_de_pagos
FROM alumnos AS a
INNER JOIN pagos AS p ON(a.clave_alu = p.clave_alu)
GROUP BY a.clave_alu, a.nombre
ORDER BY COUNT(p.id) DESC;
```

**Explicación técnica:**

- Aquí, en lugar de sumar los montos, `COUNT(p.id)` cuenta cuántos registros de la tabla `pagos` corresponden a cada `clave_alu`. Si un alumno tiene dos pagos, el resultado de su fila en esta columna será `2`.

**Resultado:**

| clave_alu | nombre          | numero_de_pagos |
| --------- | --------------- | --------------- |
| 11040248  | ARTURO          | 17              |
| 11060117  | ADRIAN          | 14              |
| 11040184  | ANA THALIA      | 12              |
| 11040157  | ALEJANDRA NOEMI | 12              |
| 11040229  | LUIS DAVID      | 12              |
### 2.3 Ejemplo con MAX(), MIN() y AVG(): Pagos más altos y bajos y promedios

La función `MAX()` nos devuelve el valor más alto de un grupo, mientras que `MIN()` extrae el valor más bajo. Son de mucha utilidad para identificar el límite superior y el límite inferior de una serie de valores, en este caso podemos utilizarlo para identificar estos límites en los pagos individuales de cada alumno.

La función `AVG()` calcula la media aritmética de los valores numéricos dentro de un grupo, suma todos los valores del grupo y los divide automáticamente entre la cantidad de registros que lo conforman.

```sql 
SELECT a.clave_alu, a.nombre, AVG(p.pago) AS promedio_pagos,
MIN(p.pago) AS pago_mas_bajo, MAX(p.pago) AS pago_mas_alto 
FROM alumnos AS a INNER JOIN pagos AS p ON(a.clave_alu = p.clave_alu)
GROUP BY a.clave_alu, a.nombre;
```

**Resultado:** 

| clave_alu | nombre         | promedio_pagos     | pago_mas_bajo | pago_mas_alto |
| --------- | -------------- | ------------------ | ------------- | ------------- |
| 11070253  | SALVADOR       | 2963.6363636363635 | 2320          | 7000          |
| 11040239  | CARMEN ANDREA  | 3190.909090909091  | 2800          | 7000          |
| 11040182  | RUTH GIOVANNA  | 3181.818181818182  | 2800          | 7000          |
| 11070112  | LUIS EMILIO    | 2810               | 2500          | 5600          |
| 11070244  | CARLA GABRIELA | 3227.2727272727275 | 2800          | 7000          |

### 2.4. Ejemplo con HAVING: Alumnos que han pagado menos de $12,000 en total

Si intentas usar `WHERE SUM(p.pago) < 12000`, MySQL lanzará un error de sintaxis porque `WHERE` no entiende de sumatorias ni de grupos. La forma correcta es:

```sql
SELECT a.clave_alu, a.nombre, SUM(p.pago) AS total_invertido
FROM alumnos AS a
INNER JOIN pagos AS p ON(a.clave_alu = p.clave_alu)
GROUP BY a.clave_alu, a.nombre
HAVING SUM(p.pago) < 12000
ORDER BY SUM(p.pago) DESC;
```

**Explicación técnica:**

1. MySQL junta las tablas con el `INNER JOIN`.
2. Agrupa los registros por alumno y calcula la suma total de sus pagos.
3. Analiza los resultados finales agregados y descarta de la visualización a los alumnos cuyo `total_invertido` sea menor o igual a 600.

**Resultado:**

| clave_alu | nombre      | total_invertido |
| --------- | ----------- | --------------- |
| 11060074  | JOSE DANIEL | 11450           |
| 11060192  | DANIELA     | 11450           |
| 11070025  | ANDREA      | 11300           |
| 11060201  | OSCAR       | 10800           |
| 11040149  | JUAN MANUEL | 7000            |

### 2.5. Diferencias entre WHERE y HAVING

- `WHERE` filtra filas **antes** de que ocurra el agrupamiento.
- `HAVING` filtra filas **después** de que los datos ya fueron agrupados y calculados.