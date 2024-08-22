import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import AddRecipeView from './views/AddRecipeView.js';

const recipeContainer = document.querySelector('.recipe');

if(module.hot){
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// 1. Create a GET request to the API
/*everu id arrows to a recipe*/
const controleRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    
    recipeView.renderSpinner(recipeContainer);
    
    await model.loadRecipe(id);
    

    const { recipess } = model.state;

    //2.Rendering Recipe
    recipeView.render(recipess, recipeContainer);
    bookMarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(err);
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    // Get the query from the search input
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    console.log(query);
    if (query===' ') throw new Error('The input is empty');
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const ControlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings=function(newServings){
  //Update the recipe servings in the model
  model.updateServings(newServings);
  //Update the recipe view to reflect the new servings
  // recipeView.render(model.state.recipess);
  recipeView.update(model.state.recipess);


}

const controlBookMark=function(){
  //Add or remove a bookmark
  model.toggleBookMark(model.state.recipess);
  console.log(model.state.recipess);
  //Update the UI
  recipeView.update(model.state.recipess);

  bookMarksView.render(model.state.bookmarks);
}

const controlBookMarksView=function(){
  bookMarksView.render(model.state.bookmarks);
}

// const controlAddRecipe=async function(recipe){
//   //Show form
//   try{
//     AddRecipeView.renderSpinner();
//   await model.uploadRecipe(recipe);
//   console.log(model.state.recipess);
//   recipeView.render(model.state.recipess);
//   AddRecipeView.renderMessage();
//   bookMarksView.render(model.state.bookmarks);

//   //Change ID in url
//   window.history.pushState(null,'',`#${model.state.recipess.id}`);
//   location.reload();
//   setTimeout(function(){
//     AddRecipeView.toggleWindow()
//   },2.5);



//   }
//   catch(err){
//     AddRecipeView.renderError(err.message);
//   }

  

// }

const init = async function () {
  bookMarksView.addHandlerRender(controlBookMarksView);
   searchView.addHandlerSearch(controlSearchResults);
   recipeView.addHandlerUpdateServings(controlServings);
   recipeView.addHandlerBookMark(controlBookMark);
   paginationView.addHandlerClick(ControlPagination);
   recipeView.addHandlerRender(controleRecipe);
  //  AddRecipeView.addHandlerUpload(controlAddRecipe);

};


init();
