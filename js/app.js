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




