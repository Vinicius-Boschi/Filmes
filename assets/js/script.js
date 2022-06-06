import {api_key} from "../../apikey.js" // Importa o arquivo da api.
import {renderMovie} from "./renderMovie.js" // Importa o arquivo que contém a função de renderizar os filmes.

async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1` // Url da api.
    const fetchResponse = await fetch(url) // Faz a requisição da api.
    const {results} = await fetchResponse.json() // Transforma em json.
    return results // Retorna o resultado.
}

async function getAllPopularMovies() {
  const movies = await getPopularMovies() // Pega a função que faz a requisição da api.
  movies.forEach(movie => renderMovie(movie)) // Percorre todo o array dos filmes.
}

window.onload = function() {
  getAllPopularMovies()  // Adiciona a função no site.
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