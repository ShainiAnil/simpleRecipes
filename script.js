//DOM elements
  const searchField = document.querySelector(".searchField")
  const recipeList = document.querySelector(".recipeList")
  const appModal = document.querySelector(".appModal")
  const mealTitle = document.querySelector(".mealTitle")
  const modalClose = document.querySelector(".modalClose")
  const mealPic = document.querySelector(".mealPic")
  const mealIngredients = document.querySelector(".mealIngredients")
  const mealInstructions = document.querySelector(".mealInstructions")
  const categoryList = document.querySelector(".categoryList")
  // const clearBtn = document.querySelector(".clear")
 
//API base Url
  const API = "https://www.themealdb.com/api/json/v1/1/"

// List all categories when page loads

  let url = `${API}categories.php`
  fetchData(url).then(data => {
    let categoriesList = []
    console.log(data)
    categoriesList = [...data.categories]
    //totalLists = categoriesList.length
    let results = categoryHtml(categoriesList)

  })
  function categoryHtml(data) {
    let html = ""
    data.forEach((element) => {
      html += `<li class="listItem">${element.strCategory}</li>`
    })
    categoryList.innerHTML = html
  }

// Loads data according to the selected category

  categoryList.addEventListener("click",function(e){
    let category = ""
    if(e.target.classList.contains('listItem')){
      category = e.target.innerText
      addOrRemoveClass(category)
      let recipesUrl = `${API}filter.php?c=${category}`
      handleSearch(recipesUrl,category)
    }
  })
  
  function addOrRemoveClass(query){
    //console.log(query)
    qry = query.toLowerCase()
    let allLists=document.getElementsByTagName("li");
    for(let i = 0; i < allLists.length; i++){
      allLists[i].innerText.toLowerCase() === qry? 
        allLists[i].classList.add("current")
      :
        allLists[i].classList.contains("current")?allLists[i].classList.remove("current"):""
    }
  }

// Close  Modal window 

modalClose.addEventListener("click", function () {
    appModal.classList.remove("active")
    document.body.style.overflow = "auto"
  })
   
  
  // Search function implementation

   searchField.addEventListener('submit',function(e){
    e.preventDefault()
    
    let query = e.target.recipeSearch.value
    addOrRemoveClass(query)
    let recipesUrl = `${API}search.php?s=${query}`
    e.target.recipeSearch.value = ""
    handleSearch(recipesUrl,query)
  })
  function handleSearch(recipesUrl,query) {
    fetchData(recipesUrl).then(data => {
      console.log(data)
      let results = createResultsHTML(data.meals,query)
      recipeList.innerHTML = results
     })
   }
  function createResultsHTML(data,query) { 
    let html = ""; 
    let category = "";
    if (data === null) {
      html = `<h3 class="searchError"> No results! Try a different search </h3>`
    }
    else {
      html = data.map(function (meal) {
        if(meal.strCategory === undefined){
          category = query
        }
        else{
          category = meal.strCategory
        }
        return `<div class="recipeItem" data-id=${meal.idMeal}>
          <div class="recipePic">
            <img
              src=${meal.strMealThumb}
              alt=""
              loading="lazy"
            />
            </div>
            <h2>${meal.strMeal}</h2>
            <h4>${category}</h4>
            
          </div>`
      }).join("")
    }
    return html
  }
  
  document.addEventListener("click", handleMealInfo)
  function handleMealInfo(e) {
    if (e.target.parentElement.classList.contains("recipeItem")) {
      let id = e.target.parentElement.dataset.id
      let mealURL = `${API}lookup.php?i=${id}`
      fetchData(mealURL).then(function (data) {
        console.log(data)
        let recipe = data.meals[0]
        appModal.classList.add("active")
        document.body.style.overflow = "hidden"
        mealTitle.innerHTML = `<h2>${recipe.strMeal}</h2><h4>${recipe.strCategory}</h4>`
        mealPic.innerHTML = `<img src=${recipe.strMealThumb} />`
        createIngredientListRecipe(recipe)
        mealInstructions.innerText = recipe.strInstructions
      })
    }
  }
  function createIngredientListRecipe(recipe) {
    let list = ""
    for (let i = 1; i <= 20; i++) {
      if (recipe["strIngredient" + i] === "" || recipe["strIngredient" + i] === null) {
        break
      }
      else {
        list += `<li>${recipe["strIngredient" + i]} - ${recipe["strMeasure" + i]}</li>`
      }
    }
    mealIngredients.innerHTML = `<ul> ${list} </ul>`
  }
  async function fetchData(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
  }
  
  
