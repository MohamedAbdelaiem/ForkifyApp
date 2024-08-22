import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;
  _errorMessage = 'This Recipe Nor found! Please try again :)';
  _message='Start by searching for a recipe or an ingredient. Have fun!';

  render(data,render=true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markUp = this._genertaeMarkUp();
    if(!render) return markUp;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return ;
    this._data = data;
    const newMarkUp = this._genertaeMarkUp();

    const newDOM = document.createRange().createContextualFragment(newMarkUp); //big pbject
    const newElemnts = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElemnts.forEach((newEl, i) => {
      const curEl = currentElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          if (curEl.hasAttribute(attr.name)) {
            curEl.setAttribute(attr.name, attr.value);
          }
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markUp = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  };

  renderError(message=this._errorMessage) {
    const markUp = `
    <div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-alert-triangle"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message=this._message) {
    const markUp = `
    <div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-smile"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
