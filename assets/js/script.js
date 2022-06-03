import {api_key} from "../../apikey.js" // Importa o arquivo da api.

async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1` // Url da api.
    const fetchResponse = await fetch(url) // Faz a requisição da api.
    const {results} = await fetchResponse.json() // Transforma em json.
    return results // Retorna o resultado.
}

async function getAllPopularMovies() {
  const movies = await getPopularMovies()
  movies.forEach(movie => renderMovie(movie))
}

window.onload = function() {
  getAllPopularMovies()  // Adiciona a função no site.
}

function renderMovie(movie) {
    const {id, title, poster_path, vote_average, release_date, overview} = movie // É definido o código do filme, nome, foto, pontuação, data e texto sobre ele.
    const year = new Date(release_date).getFullYear() // O ano do filme.
    const image = `https://image.tmdb.org/t/p/w500${poster_path}`

    const moviesElement = document.createElement('main') // Cria a tag.
    moviesElement.classList.add('main') // Adiciona classe a ela
    document.body.appendChild(moviesElement) // Adiciona a tag no html.

    const container = document.createElement('div') 
    container.classList.add('main__container') 
    moviesElement.appendChild(container) 

    const moviePicture = document.createElement('div')
    moviePicture.classList.add('main__picture')
    container.appendChild(moviePicture) 

    const imageMovie = document.createElement('img')
    imageMovie.classList.add('main__img')
    imageMovie.src = image
    imageMovie.alt = `${title} Poster` // Adiciona a foto do filme.
    moviePicture.appendChild(imageMovie)

    const vote = document.createElement('div')
    vote.classList.add('main__vote')
    container.appendChild(vote)

    const text = document.createElement('p')
    text.classList.add('main__text')
    text.textContent = `${title} (${year})` // Adiciona o nome e o ano filme.
    vote.appendChild(text)

    const rate = document.createElement('span')
    rate.classList.add('main__rate')
    vote.appendChild(rate)

    const imageRate = document.createElement('img')
    imageRate.classList.add('main__img_rate')
    imageRate.src = 'assets/img/star.svg'
    rate.appendChild(imageRate)

    const textRate = document.createElement('p')
    textRate.classList.add('main__rate_number')
    textRate.textContent = `${vote_average}`
    rate.appendChild(textRate)

    const favorite = document.createElement('span')
    favorite.classList.add('main__classification')
    vote.appendChild(favorite)

    const button = document.createElement('button')
    button.classList.add('main__button')
    favorite.appendChild(button)

    const imageFavorite = document.createElement('img')
    imageFavorite.classList.add('main__img_rate')
    imageFavorite.src = 'assets/img/heart.svg'
    button.appendChild(imageFavorite)

    const textFavorite = document.createElement('p')
    textFavorite.classList.add('main__rate_favorite')
    textFavorite.textContent = "Favoritar"
    favorite.appendChild(textFavorite)

    const textAbout = document.createElement('div')
    textAbout.classList.add('main__about_movie')
    container.appendChild(textAbout)
    
    const textMovie = document.createElement('p')
    textMovie.classList.add('main__text_movie')
    textMovie.textContent = `${overview}`
    textAbout.appendChild(textMovie)
}