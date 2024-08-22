import View from './view.js';
import icons from 'url:../../img/icons.svg';

import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookMarks yet ,Find a nice recipe and bookmark it :)';
  _message = '';
    addHandlerRender(handler){
        this._parentElement.addEventListener('load',handler);
    }
  _genertaeMarkUp() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultsView();
