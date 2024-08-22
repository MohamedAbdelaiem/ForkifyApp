import View from './view.js';
import icons from 'url:../../img/icons.svg';

import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';

  _genertaeMarkUp() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
