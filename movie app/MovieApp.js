const API_KEY = 'f2a6b4303fd1d234a09a387fe6af0a50';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const searchInput = document.getElementById('search-input');
const moviesDisplay = document.getElementById('movies-display');
const movieModal = document.getElementById('movie-modal');
const movieDetails = document.getElementById('movie-details');
const closeModal = document.getElementById('close-modal');
const watchlistMovies = document.getElementById('watchlist-movies');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Загружаем популярные фильмы при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchTopMovies);
searchInput.addEventListener('input', () => searchMovies(searchInput.value));
closeModal.addEventListener('click', closeMovieModal);
document.addEventListener('click', (event) => {
  if (event.target === movieModal) closeMovieModal();
});

// Функция для загрузки популярных фильмов
async function fetchTopMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Ошибка при загрузке популярных фильмов:', error);
  }
}

async function searchMovies(query) {
  if (query.length < 3) return;
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Ошибка при поиске фильмов:', error);
  }
}

function displayMovies(movies) {
  moviesDisplay.innerHTML = '';
  movies.forEach((movie) => createMovieCard(movie, moviesDisplay, 'add'));
}

async function showMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const movie = await response.json();

    // Проверка, находится ли фильм в watchlist
    const isInWatchlist = watchlist.some(item => item.id === movieId);
    const buttonText = isInWatchlist ? "Удалить из списка" : "Добавить в список";
    
    movieDetails.innerHTML = `
      <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-modal-poster">
      <h2>${movie.title}</h2>
      <p>${movie.overview}</p>
      <p><strong>Рейтинг:</strong> ${movie.vote_average}</p>
      <p><strong>Длительность:</strong> ${movie.runtime} минут</p>
      <h3>В ролях:</h3>
      <p>${movie.credits.cast.slice(0, 5).map(cast => cast.name).join(', ')}</p>
      <button id="watchlist-action-btn" class="watchlist-action-btn">${buttonText}</button>
    `;
    
    const watchlistButton = document.getElementById('watchlist-action-btn');
    watchlistButton.addEventListener('click', () => {
      if (isInWatchlist) {
        removeFromWatchlist(movieId);
      } else {
        addToWatchlist(movieId);
      }
    });

    movieModal.style.display = 'flex';
  } catch (error) {
    console.error('Ошибка при получении деталей фильма:', error);
  }
}

function closeMovieModal() {
  movieModal.style.display = 'none';
}

function removeFromWatchlist(movieId) {
  // Удаление фильма из watchlist
  watchlist = watchlist.filter((movie) => movie.id !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  displayWatchlist(); // обновление списка на странице
  movieModal.style.display = 'none'; // закрытие модального окна
}

async function addToWatchlist(movieId) {
  if (watchlist.some((movie) => movie.id === movieId)) {
    alert('Этот фильм уже в вашем списке!');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();

    watchlist.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
    alert('Фильм добавлен в ваш список!');
  } catch (error) {
    console.error('Ошибка при добавлении фильма в список:', error);
  }
}

function displayWatchlist() {
  watchlistMovies.innerHTML = '';
  watchlist.forEach((movie) => createMovieCard(movie, watchlistMovies, 'remove'));
}

function createMovieCard(movie, container, type) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.innerHTML = `
    <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <button class="${type}-watchlist-btn">${type === 'add' ? 'Добавить в список' : 'Удалить'}</button>
    </div>
  `;

  // Открыть модальное окно с деталями фильма при клике на изображение
  movieCard.querySelector('img').addEventListener('click', (event) => {
    event.stopPropagation();
    showMovieDetails(movie.id);
  });

  // Добавляем обработчик события для кнопки добавления/удаления
  const watchlistButton = movieCard.querySelector(`.${type}-watchlist-btn`);
  if (type === 'add') {
    watchlistButton.addEventListener('click', (event) => {
      event.stopPropagation();
      addToWatchlist(movie.id);
    });
  } else {
    watchlistButton.addEventListener('click', (event) => {
      event.stopPropagation();
      removeFromWatchlist(movie.id);
    });
  }

  container.appendChild(movieCard);
}

displayWatchlist();
