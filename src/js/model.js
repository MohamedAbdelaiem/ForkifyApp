//1. Importing axios
import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';
import { sendJSON } from './helpers.js';

export const state = {
  recipess: {},
  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const loadRescipeData=function(data){
  return {
    id: data.data.recipe.id,
    title: data.data.recipe.title,
    publisher: data.data.recipe.publisher,
    sourceUrl: data.data.recipe.source_url,
    image: data.data.recipe.image_url,
    servings: data.data.recipe.servings,
    cookingTime: data.data.recipe.cooking_time,
    ingredients: data.data.recipe.ingredients,
    ...(data.data.recipe.key&&{key:data.data.recipe.key}),
  }
}



export const loadRecipe = async function (id) {
  try {
    //1.Loading Recipe
    const response = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    console.log(response);
    state.recipess = loadRescipeData(response);

    if (state.bookmarks.some(b => b.id === id)) {
      state.recipess.bookmarked = true;
    } else state.recipess.bookmarked = false;
    console.log(state.recipess);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key&&{key:rec.key}),
      };
    });
    console.log(state.search.results);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = start + state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipess.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipess.servings;
  });
  state.recipess.servings = servings;
};

const presistBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const toggleBookMark = function (recipe) {
  if (!recipe.bookmarked) {
    state.bookmarks.push(recipe);

    //Mark recipe as bookMarked
    if (recipe.id === state.recipess.id) state.recipess.bookmarked = true;
    presistBookMarks();
  } else {
    //Remove recipe from bookmarks
    const index = state.bookmarks.findIndex(r => r.id === recipe.id);
    state.bookmarks.splice(index, 1);
    state.recipess.bookmarked = false;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try{
  const ingredients = Object.entries(newRecipe)
    .filter(entry => {
      return entry[0].startsWith('ingredient') && entry[1] !== '';
    })
    .map(ingredient => {
      const IngArr= [quantity, unit, description] = ingredient[1]
        .split(',').map(el=>{
          return el.trim();
        })
        if(IngArr.length!==3){
          throw new Error('Wrong ingredient format please use (quantity,unit,description)')
        }


      return { quantity:quantity?+quantity:null, unit, description };
    });
  const RecipeObject={
    title:newRecipe.title,
    source_url:newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher:newRecipe.publisher,
    cooking_time:+newRecipe.cookingTime,
    servings:+newRecipe.servings,
    ingredients
  };
  console.log(RecipeObject);
  const data=await sendJSON(`${API_URL}?key=${KEY}`,RecipeObject);
  console.log(data);
   state.recipess=loadRescipeData(data);
   toggleBookMark(state.recipess);
  
  
  }
  catch(err){
    console.log(err.message);
    throw err;

  }
};



const ClearBookMarks = function () {
  localStorage.clear('bookmarks');
};

const init = function () {
  const storge = localStorage.getItem('bookmarks');
  if (storge) {
    state.bookmarks = JSON.parse(storge);
  }
};
init();
console.log;
