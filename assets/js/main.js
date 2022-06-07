import { api_key } from "../../apikey.js" // Importa o arquivo da api.

const container = document.querySelector('.main__container')
const input = document.querySelector('input')
const searchButton = document.querySelector('.header__icon')
const checkbox = document.querySelector('input[type="checkbox"]')

checkbox.addEventListener('change', checkboxStatus) // Fica esperando o checbox mudar.
searchButton.addEventListener('click', searchMovie) // Quando o botão do input for clicado.
input.addEventListener('keyup', function(event) { // Detecta quando você para de digitar.
  console.log(event.key) // Mostra no console as letras que forem escritas no teclado.
  if(event.keyCode == 13) { // Funciona tanto apertando no botão, como apertando no ENTER.
    searchMovie()
    return
  }
})

function checkboxStatus() { // Função que checa se o botão está clicado ou não.
  const isChecked = checkbox.checked // Variável pra ver se o checbox foi selecionado.
  if(isChecked) { 
    cleanAllMovies() // Se estiver clicado, vai limpar todos os filmes.
    const movies = getFavoriteMovies() || [] // Coloca a função ou um array vazio.
    movies.forEach(movie => renderMovie(movie)) // Adiciona a função com as novas informações.
  } else {
    cleanAllMovies() // Se não ele limpa tudo e adiciona a função novamente.
    getAllPopularMovies()
  }
}

async function searchMovie() {
  const inputValue = input.value
  if (inputValue != '') { // Se o input for igual a '', ele limpa tudo e adiciona a função novamente.
    cleanAllMovies()
    const movies = await searchMovieByName(inputValue) // Vai procurar o filme que foi digitado.
    movies.forEach(movie => renderMovie(movie))
  }
}

function cleanAllMovies() {
  container.innerHTML = '' // Limpa as informações.
}

async function searchMovieByName(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${title}&language=en-US&page=1` // Url da api.
  const fetchResponse = await fetch(url) // Faz a requisição da api.
  const { results } = await fetchResponse.json() // Transforma em json.
  return results // Retorna o resultado.
}

async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1` 
  const fetchResponse = await fetch(url) 
  const { results } = await fetchResponse.json() 
  return results 
}

function favoriteButtonPressed(event, movie) {
  const favoriteState = {
    favorite: 'assets/img/heart_full.svg', // Se for favorito, vai ser adicionado essa imagem.
    notFavorite: 'assets/img/heart.svg' // Se não for, vais er adicionado essa.
  }

  if(event.target.src.includes(favoriteState.notFavorite)) {
    event.target.src = favoriteState.favorite // Aqui o filme será favoritado.
    saveToLocalStorage(movie) // Vai salvar no localStorage.
  } else {
    event.target.src = favoriteState.notFavorite // Aqui ele será desfavoritado.
    removeFromLocalStorage(movie.id) // Vai ser removido do localStorage.
  }
}

function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem('favoriteMovies')) // Vai retornar e pegar os itens salvos.
}

function saveToLocalStorage(movie) {
  const movies = getFavoriteMovies() || [] // Pega os filmes favoritos ou um array vazio.
  movies.push(movie) // Coloca os filmes no array.
  const moviesJSON = JSON.stringify(movies) 
  localStorage.setItem('favoriteMovies', moviesJSON) // Vai setar os filmes favoritos no localStorage.
}

function checkMovieIsFavorited(id) {
  const movies = getFavoriteMovies() || []
  return movies.find(movie => movie.id == id) // Pega o id dos filmes.
}

function removeFromLocalStorage(id) {
  const movies = getFavoriteMovies() || []
  const findMovie = movies.find(movie => movie.id === id) // Procura os filmes.
  const newMovies = movies.filter(movie => movie.id != findMovie.id) // Verifica se já tem o filme como favorito ou não.
  localStorage.setItem('favoriteMovies', JSON.stringify(newMovies)) // Adiciona o resultado.
}

async function getAllPopularMovies() {
  const movies = await getPopularMovies() // Pega a função que faz a requisição da api.
  movies.forEach(movie => renderMovie(movie)) // Percorre todo o array dos filmes.
}

window.onload = function() {
  getAllPopularMovies()  // Adiciona a função no site.
}

function renderMovie(movie) {

  const { id, title, poster_path, vote_average, release_date, overview } = movie
  const isFavorited = checkMovieIsFavorited(id)

  const year = new Date(release_date).getFullYear()
  const image = `https://image.tmdb.org/t/p/w500${poster_path}`

  const movieElement = document.createElement('div')
  movieElement.classList.add('main__movie')
  container.appendChild(movieElement)

  const movieInformations = document.createElement('div')
  movieInformations.classList.add('main__informations')

  const movieImageContainer = document.createElement('div')
  movieImageContainer.classList.add('main__picture')
  const movieImage = document.createElement('img')
  movieImage.classList.add('main__img')
  movieImage.src = image
  movieImage.alt = `${title} Poster`
  movieImageContainer.appendChild(movieImage)
  movieInformations.appendChild(movieImageContainer)

  const movieTextContainer = document.createElement('div')
  movieTextContainer.classList.add('main__text')
  const movieTitle = document.createElement('h4')
  movieTitle.textContent = `${title} (${year})`
  movieTextContainer.appendChild(movieTitle)
  movieInformations.appendChild(movieTextContainer)

  const informations = document.createElement('div')
  informations.classList.add('main__informations')
  movieTextContainer.appendChild(informations)

  const ratingContainer = document.createElement('div')
  ratingContainer.classList.add('main__rating')
  const starImage = document.createElement('img')
  starImage.src = 'assets/img/star.svg'
  starImage.alt = 'Star'
  const movieRate = document.createElement('span')
  movieRate.classList.add('main__rate')
  movieRate.textContent = vote_average
  ratingContainer.appendChild(starImage)
  ratingContainer.appendChild(movieRate)
  informations.appendChild(ratingContainer)

  const favorite = document.createElement('div')
  favorite.classList.add('main__favorite')
  const favoriteImage = document.createElement('img')
  favoriteImage.src = isFavorited ? 'assets/img/heart-fill.svg' : 'assets/img/heart.svg'
  favoriteImage.alt = 'Heart'
  favoriteImage.classList.add('favoriteImage')
  favoriteImage.addEventListener('click', (event) => favoriteButtonPressed(event, movie))
  const favoriteText = document.createElement('span')
  favoriteText.classList.add('main__favorite')
  favoriteText.textContent = 'Favoritar'
  favorite.appendChild(favoriteImage)
  favorite.appendChild(favoriteText)
  informations.appendChild(favorite)

  const movieDescriptionContainer = document.createElement('div')
  movieDescriptionContainer.classList.add('main__description')
  const movieDescription = document.createElement('span')
  movieDescription.textContent = overview
  movieDescriptionContainer.appendChild(movieDescription)
  
  movieElement.appendChild(movieInformations)
  movieElement.appendChild(movieDescriptionContainer)
}

let button = $(".btn")

$(window).scroll(function() {
  if($(window).scrollTop() >= 400) { // Se for maior que 400 o botão irá aparecer na página.
    button.addClass("show") // Aqui o botão aparece na página.
  } else {
    button.removeClass("show") // Botão desaparece.
  }
})

button.on("click", function(e) { // Quando clicar no botão irá fazer uma animação de clique.
  e.preventDefault();
  $("html, body").animate({scrollTop: 0}, "400") // O botão irá subir a página com uma animação.
})