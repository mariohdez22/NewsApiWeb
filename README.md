# GUIA DE INSTALACION - WEB DE NOTICIAS (GYS NEWS)

### Instroduccion: 
GYS NEWS, es un sitio web de noticias, bastante basica pero intuitiva y posee actualizacion periodica de noticias, para mantener el sitio actualizado, ademas posee un diseño atractivo para los usuarios.

## Cambiar tiempo de actualizacion en tiempo real

### SetInterval
``` javascript
setInterval(function() {
    let categoriaAleatoria;
    do {
        categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    } while (categoriaAleatoria === ultimaCategoria);

    ultimaCategoria = categoriaAleatoria; // Actualizamos la última categoría seleccionada
    buscar(categoriaAleatoria);
}, 100000);
```

### Cambiar los minutos
cambia el tiempo de actualizacion de la pagina en este apartado

``` javascript
}, 200000);

```

> [!WARNING]
> Asegurate de no agregar un tiempo de actualizacion menor a 1 minuto, por que podrias correr el riesgo de gastar las peticiones disponibles de newsApi, las cuales son 1000 maximas

## Pasos para la ejecucion del proyecto:

> ### Paso 1: Descargar el proyecto

Descargamos el proyecto mediante este github

<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo de GitHub" width="100"/>

y lo ejecutamos en visual code

<img src="https://digitaleducas.com/tutoriales/sites/default/files/inline-images/visualstudio_code-card.png" alt="Logo de GitHub" width="200"/>

Para obtener una mejor experiencia trabajando en el sistema

<br>

> ### Paso 2: Instalar Live Server

Una vez abierto visual code instalamos live server

<img src="https://hashnode.com/utility/r?url=https%3A%2F%2Fcdn.hashnode.com%2Fres%2Fhashnode%2Fimage%2Fupload%2Fv1673085513915%2F380b4b03-167e-4ee7-b300-1dea0ce1685a.jpeg%3Fw%3D1200%26h%3D630%26fit%3Dcrop%26crop%3Dentropy%26auto%3Dcompress%2Cformat%26format%3Dwebp%26fm%3Dpng" alt="Logo de GitHub" width="300"/>

El cual nos servira para poder ejecutar el sistema en un servidor local propio de visual code

<br>

> ### Paso 3: Ejecucion de live server en visual code 

Ahora que hemos instalado **Live Server** en visual code, procederemos a encenderlo en la parte de abajo donde dice **Go Live** y se mostrara el sitio cargado en el navegador

## Descripcion de cada uno de los apartados del proyecto:

### HTML

Para el apartado del HTML es una estructura basica la cual posee los botones para las categorias, el buscador y el div que sera el contenedor para cargar las vistas

``` html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/estilos.css">
    <title>Noticias</title>
</head>
<body>
    <div class="container">
        
        <h1>GYS NEWS</h1>
        <header>
            <nav>
                <span class="cat" onclick="buscar('Tecnología')">Tecnología</span>
                <span class="cat" onclick="buscar('programación')">Programación</span>
                <span class="cat" onclick="buscar('deportes')">Deportes</span>
                <span class="cat" onclick="buscar('economía')">Economía</span>
                <span class="cat" onclick="buscar('educación')">Educación</span>
            </nav>
            <div class="busqueda">
                <input type="text" placeholder="Qué desea buscar" id="busqueda">
                <button onclick="buscarTema()">Buscar</button>
            </div>
        </header>

        <div class="container-noticias">

        </div>
        
    </div>
    
    <script src="../js/app.js"></script>
</body>
</html>

```

<br>

### Javascript

En el apartado de javascript estara el proceso principal del sitio, donde se consumira la API de NEWSAPI, y se procedera a realizar el proceso de la muestra de las tarjetas, y la utilizacion de DOM para generar dichas tarjetas desde JS, ademas estaran los procesos de busqueda 
y el metodo de carga en segundo plano ( **SetInterval** )

``` javascript

let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnologia";
let currentPage = 1; // Variable para el control de la paginación
let ultimaCategoria = null;

let noticias = {
    "apiKey": "61cfc71ead764aad8e7486b4127de77a",
    fetchNoticias:function(categoria, page) 
    {
        fetch(
            "https://newsapi.org/v2/everything?q="
            +categoria+
            "&page=" + page + // Agregamos el parámetro de paginación
            "&language=es&apiKey="+this.apiKey
        )
        .then((response)=>response.json())
        .then((data)=>this.displayNoticias(data));
    },
    displayNoticias:function(data)
    {
        //elimino todo si se ha seleccionado un tema nuevo o se está en la primera página
        if (pageInicial == 0 || currentPage == 1){
            document.querySelector(".container-noticias").textContent = "";
        }

        //cargo la cantidad de noticias indicada en cantidadNoticias
        for (let i = pageInicial; i <= pageFinal; i++)
        {
            if (!data.articles[i]) break; // Evitar error si no hay más artículos

            const {title} = data.articles[i];
            let h2 = document.createElement("h2");
            h2.textContent = title;

            const {urlToImage} = data.articles[i];
            let img = document.createElement("img");
            img.setAttribute("src", urlToImage);

            let info_item = document.createElement("div");
            info_item.className = "info_item";
            const {publishedAt} = data.articles[i];
            let fecha = document.createElement("span");
            let date = publishedAt;
            date = date.split("T")[0].split("-").reverse().join("-");
            fecha.className = "fecha";
            fecha.textContent = date;

            const {name} = data.articles[i].source;
            let fuente = document.createElement("span");
            fuente.className = "fuente";
            fuente.textContent = name;

            info_item.appendChild(fecha);
            info_item.appendChild(fuente);

            const {url} = data.articles[i];

            let item = document.createElement("div");
            item.className = "item";
            item.appendChild(h2);
            item.appendChild(img);
            item.appendChild(info_item);
            item.setAttribute("onclick", "location.href='"+ url +"'");
            document.querySelector(".container-noticias").appendChild(item);
        }

        let btnSiguiente = document.createElement("span");
        btnSiguiente.id= "btnSiguiente";
        btnSiguiente.textContent = "Ver Mas";
        btnSiguiente.setAttribute("onclick", "siguiente()");
        document.querySelector(".container-noticias").appendChild(btnSiguiente);
    }
        
}

const categorias = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];

function buscar(cat){
    pageInicial = 0;
    pageFinal = cantidadNoticias;
    temaActual = cat;
    currentPage = 1; // Reiniciar la paginación al buscar un nuevo tema
    noticias.fetchNoticias(cat, currentPage);
}

function buscarTema(){
    pageInicial = 0;
    pageFinal = cantidadNoticias;

    let tema = document.querySelector("#busqueda").value;
    temaActual = tema;
    currentPage = 1; // Reiniciar la paginación al buscar un nuevo tema
    noticias.fetchNoticias(temaActual, currentPage);
}

function siguiente(){
    pageInicial = pageFinal + 1;
    pageFinal = pageFinal + cantidadNoticias + 1;
    //eliminamos el botón siguiente
    document.querySelector("#btnSiguiente").remove();
    noticias.fetchNoticias(temaActual, currentPage);
}

// Recargar automáticamente cada 1 minuto (60000 milisegundos)
setInterval(function() {
    let categoriaAleatoria;
    do {
        categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    } while (categoriaAleatoria === ultimaCategoria);

    ultimaCategoria = categoriaAleatoria; // Actualizamos la última categoría seleccionada
    buscar(categoriaAleatoria);
}, 100000);

noticias.fetchNoticias(temaActual, currentPage);

```

<br>

### CSS

En el apartado de css se alojara el diseño que corresponde al html y a las tarjetas que se generan desde javascript

``` css

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700&display=swap');
*{
    box-sizing: border-box;
    font-family: 'Montserrat';
}
.container{
    max-width: 1200px;
    margin: auto;
}
h1{
    text-align: center;
    color: #ff3a7a;
}
header{
    display: flex;
    justify-content: space-between;
}
nav{
    text-align: center;
    margin-bottom: 20px;
}
nav span{
    display: inline-block;
    background-color: #f5f5f5;
    color: #2f2f2f;
    padding: 5px 10px;
    border-radius: 30px;
    margin: 0 5px;
    cursor: pointer;
}
nav span:hover{
    background-color: #ff3a7a;
    color: #ffffff;
}
header input{
    padding: 5px 10px;
    border: none;
    border: 2px solid #ccc;
    border-radius: 30px;
}
header button{
    border: none;
    padding: 7px 10px;
    border-radius: 30px;
    border: 2px solid #ccc;
}
.container-noticias{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap:30px;
    padding-bottom: 20px;
}
.container-noticias .item{
    background-color: #ffffff;
    max-width: 360px;
    border:1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    transition: .3s;
}
.container-noticias .item:hover{
    box-shadow: 0 0 10px 5px #ccc;
}
.container-noticias .item:hover h2{
    text-decoration: underline;
}
.container-noticias .item .info_item{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.container-noticias .item img{
    width: 100%;
}
.container-noticias #btnSiguiente{
    cursor: pointer;
}
.container-noticias #btnSiguiente:hover{
    color: #fc0505;
}

```

<br>

## Finalizacion y conclusiones del proyecto:

Para finalizar, GYS NEWS es un sitio facil de ejecutar, al ser solo un proyecto con 3 archivos, uno html, uno js, y el ultimo siendo de css, ademas de que representa muy bien el consumo de apis, y la utilizacion de NEWSAPI para la visualizacion de las noticias








