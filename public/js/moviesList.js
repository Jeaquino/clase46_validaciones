window.onload = async function(){
    let body = document.querySelector('body');
    let moviesListTitulo = document.querySelector('.moviesListTitulo');
    const lista = document.querySelector(".movies-list");
    const preview = document.querySelector('#preview');
    const next = document.querySelector('#next');
    const section = document.querySelector('.section-list')
    const pageList = document.querySelector('.page-list')
    let page = 1;
    let search = 'shrek';
    let limit;

    const addButtonPage = (limit) => {
        for(let i = 1; i <= limit; i++){
            const button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('click', async function(e){
                const ul = await agregarPeliculas(i,search);
                const oldList = document.querySelector(`#lista${page}`)
                section.replaceChild(ul,oldList);
            })
            pageList.appendChild(button)
        }
    }

    const getMovies = async (page,search) => {
        try{
            const response = await fetch(`http://www.omdbapi.com/?apikey=d4e35e92&s=${search}&page=${page}`)
            const movies = await response.json();
            limit = Number.parseInt(movies.totalResults / 10) + 1;
            addButtonPage(limit)
            return movies;
        }catch(e){
            console.log(e);
        }
    }

    async function agregarPeliculas(page,search) {
        const movies = await getMovies(page, search);
        const ul = document.createElement('ul');
        ul.id = `lista${page}`;
        movies.Search.forEach(element => {
            
            const li = document.createElement('li');
            const div = document.createElement('div');
            const img = document.createElement('img');
            const h2 = document.createElement('h2');

            h2.innerText = element.Title;
            img.src = element.Poster == 'N/A' ? 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg' : element.Poster;
            div.appendChild(h2);
            div.appendChild(img);
            li.appendChild(div);
            ul.appendChild(li);
        });

        return ul;
    }

    if(page == 1 ){
        preview.style.display = "none";
    }
    const ul = await agregarPeliculas(page,search);
    section.appendChild(ul);

    body.classList.add('fondoMoviesList');
    
    console.log(body);
    moviesListTitulo.innerHTML = 'LISTADO DE PELÍCULAS';
    moviesListTitulo.style.color ='white';
    moviesListTitulo.style.backgroundColor = 'teal';
    moviesListTitulo.style.padding = '20px';
    
    next.addEventListener('click', async function(e){
        page += 1;
        
        if(page > 1 ){
            preview.style.display = "block";
        }

        const ul = await agregarPeliculas(page,search);
        
        if(page >= limit){
            next.style.display = 'none';
        }

        const oldList = document.querySelector(`#lista${page-1}`) 
        section.replaceChild(ul,oldList);
        window.scrollTo(0, 0);
    })

    preview.addEventListener('click', async function(e){
        page -= 1;
        
        if(page <= 1 ){
            preview.style.display = "none";
        }

        const ul = await agregarPeliculas(page,search);
        
        if(page < limit){
            next.style.display = 'block';
        }

        const oldList = document.querySelector(`#lista${page+1}`) 
        section.replaceChild(ul,oldList);
        window.scrollTo(0, 0);
    })
}