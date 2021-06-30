const myButtonTemplate = document.createElement('template');
 
myButtonTemplate.innerHTML = `
  <style>
    .container {
      padding: 8px;
    }
 
    button {
      display: block;
      overflow: hidden;
      position: relative;
      padding: 0 16px;
      font-size: 16px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      outline: none;
 
      width: 100%;
      height: 40px;
 
      box-sizing: border-box;
      border: 1px solid #a1a1a1;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
      color: #363636;
      cursor: pointer;
    }
  </style>
 
  <div class="container">
    <button>Label</button>
  </div>
`;

class MyButton extends HTMLElement {
  constructor() {
    super();
 
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(myButtonTemplate.content.cloneNode(true));

		this.$button = this._shadowRoot.querySelector('button')
		// custom event
		this.$button.addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('clicked', {
				detail: {
					clickMessage: 'Hello from within the Custom Element'
				}
			}))
		})
  }
	// Reflecting an attribute to a property
	get label() {
		return this.getAttribute('label')
	}

  // Reflecting a property to an attribute
	set label(value) {
		this.setAttribute('label', value)
	}

	static get observedAttributes() {
		return ['label']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.render()
	}

	render() {
		this.$button.innerHTML = this.label
	}
}
 
window.customElements.define('my-button', MyButton);