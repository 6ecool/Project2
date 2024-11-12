const apiKey = '26cfc9e233ac4a11b3503b8bf035434e';

// Fetch recipes and display search results
function searchRecipe() {
  const query = document.getElementById('DishInput').value;
  fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => displayRecipes(data.results))
    .catch(error => console.error('Error:', error));
}

// Display recipes in a list
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipeList');
  recipeList.innerHTML = ''; // Clear previous results

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <div class="star-rating">${generateStars(recipe.rating || 3)}</div>
    `;
    recipeCard.onclick = () => showRecipeDetails(recipe.id);
    recipeList.appendChild(recipeCard);
  });
}

// Generate star rating HTML
function generateStars(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<img src="https://img.icons8.com/ios-filled/50/FFD700/star.png" class="star">';
  }
  if (halfStar) {
    starsHtml += '<img src="https://img.icons8.com/ios-filled/50/B2B2B2/star-half.png" class="star">';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<img src="https://img.icons8.com/ios-filled/50/FFFFFF/star.png" class="star">';
  }
  return starsHtml;
}

// Fetch and display recipe details in a modal
function showRecipeDetails(recipeId) {
  fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(recipe => {
      const recipeContent = document.getElementById('recipeContent');
      recipeContent.innerHTML = `
        <h2 class="recipe-title">${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
        <p class="recipe-summary"><strong>Summary:</strong> ${recipe.summary}</p>
        <p class="recipe-servings"><strong>Servings:</strong> ${recipe.servings}</p>
        <p class="recipe-ready"><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p class="recipe-ingredients-title"><strong>Ingredients:</strong></p>
        <ul class="recipe-ingredients">
          ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
        </ul>
        <button class="add-to-favorites" onclick="addToFavorites(${recipe.id})">Add to Favorites</button>
        <a href="${recipe.sourceUrl}" target="_blank" class="full-recipe-link">See Full Recipe</a>
      `;
      document.getElementById('recipeDetails').classList.add('show');
    })
    .catch(error => console.error('Error:', error));
}

// Close modal on close button or outside click
function closeRecipeDetails() {
  document.getElementById('recipeDetails').classList.remove('show');
}

document.getElementById('recipeDetails').addEventListener('click', (e) => {
  if (e.target === document.getElementById('recipeDetails')) {
    closeRecipeDetails();
  }
});

// Add to favorites (can be expanded with local storage)
function addToFavorites(recipeId) {
  alert(`Recipe ${recipeId} added to favorites!`);
}
