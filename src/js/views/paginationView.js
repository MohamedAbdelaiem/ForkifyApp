import icons from '../../img/icons.svg'

import View from './view.js'

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');
    _message = 'No recipes found for your query!';
    _defaultMessage = 'No recipes found for your query!';

    _genertaeMarkUp(){
        const numPages=Math.ceil(this._data.results.length/this._data.resultPerPage);
        if(this._data.page===1&&numPages>1)
        {
            
            return this._genertaeRightButton();

        }

        if(this._data.page<numPages){
            return  this._generateLeftButton()+this._genertaeRightButton();
        }

        if(this._data.page===numPages&&numPages>1){
            return this._generateLeftButton();
           
        }
       return "";
        //Page1,
    }

    _genertaeRightButton(){
         return `<button data-goto="${this._data.page+1}" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page+1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
       

    }

    _generateLeftButton(){
       

          return `<button data-goto="${this._data.page-1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page-1}</span>
          </button>`
    }

    addHandlerClick(handler){
        this._parentElement.addEventListener('click',function(e){
            const button=e.target.closest('.btn--inline');
            if(!button) return ;
            const goToPage=+button.dataset.goto;
            handler(goToPage);
    })
    }

}

export default new paginationView();