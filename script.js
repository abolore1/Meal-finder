const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    resultHeading = document.getElementById('result-heading'),
    mealsEl = document.getElementById('meals'),
    single_mealEL = document.getElementById('single-meal');

//  Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault()

    // Clear meal
    single_mealEL.innerHTML = ''


    // Get search term
    const term = search.value;

    // Check for empty 
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                displayFilterResult(term,data)
                search.value = ''
            })
    } else {
        alert('please enter search term')
    }
}

// Fetch meal by Id
function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]

            addMealToDOM(meal)
        });
}

//Fetch random meal from API
function getRandomMeal() {

    resultHeading.innerHTML = ''
    mealsEl.innerHTML = ''

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]
            addMealToDOM(meal)
        })

}

function displayFilterResult(value, data) {
      // addMealToDOM(data)
      resultHeading.innerHTML = `<h2>Search results for '${value}'</h2>`

      if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results,Try again!</p>`
      } else {
          mealsEl.innerHTML = data.meals.map(meal => `
                  <div class='meal'>
                    <img src='${meal.strMealThumb}' alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealId="${meal.idMeal}">
                       <h3>${meal.strMeal}</h3>
                    </div>
                  </div>
              `).join('')
      }
      // search.value = ''
}

// Filter
function getMealFilter(filter) {
    const searchedValue = filter.target.value
    resultHeading.innerHTML = ''
    mealsEl.innerHTML = ''

    // console.log(filter.target.value)

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchedValue}`)
        .then(res => res.json())
        .then(data => {

           
            displayFilterResult(searchedValue, data)
          
        }).catch(err => console.log(err))
}
// Add meal to DOM
function addMealToDOM(meal) {
    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    single_mealEL.innerHTML = `
            <div class="single-meal">
              <h1>${meal.strMeal}</h1>
              <img src=${meal.strMealThumb} alt="${meal.strMeal}" />
              <div class="single-meal-info">
               ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
               ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
              </div>
              <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                
              </div>
            </div>
           `
}

// Event Listener
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
search.addEventListener('input', getMealFilter)

// Click single meal
mealsEl.addEventListener('click', e => {
    const mealsInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })

    if (mealsInfo) {
        const mealId = mealsInfo.getAttribute('data-mealid')
        getMealById(mealId)
    }
})
