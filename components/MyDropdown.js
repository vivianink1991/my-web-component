const myDropdownTemplate = document.createElement('template');
myDropdownTemplate.innerHTML = `
	<style>
		:host {
			display: block;
			padding: 8px;
			margin: 0;
		}
		div, ul, li {
			margin: 0;
			padding: 0;
		}
		.my-dropdown {
			position: relative;
		}
		.label {
			display: block;
			margin: 0;
			overflow: hidden;
			position: relative;
			padding: 0 16px;
			font-size: 16px;
			font-weight: bold;
			text-overflow: ellipsis;
			text-align: left;
			white-space: nowrap;
			cursor: pointer;
			outline: none;
			width: 100%;
			height: 40px;
			line-height: 40px;
			box-sizing: border-box;
			border: 1px solid #a1a1a1;
			background: #ffffff;
			box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
			color: #363636;
			cursor: pointer;
		}
		.list {
			display: none;
			position: absolute;
			top: 45px;
			left: 0;
			margin: 0;
			width: 100%;
			box-sizing: border-box;
			border: 1px solid #eee;
			background: #ffffff;
			box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
			list-style: none;
		}
		.list.show {
			display: block;
		}
		.item {
			height: 38px;
			line-height: 38px;
			padding: 0 20px;
			font-size: 15px;
			border-top: 1px solid #eee;
			text-align: left;
		}
		.item.selected {
			color: #0088c6;
			font-weight: bolder;
		}
	</style>
	<div class="my-dropdown">
		<div class="label"></div>
		<ul class="list"></ul>
	</div>
`
class MyDropdown extends HTMLElement {
	constructor() {
		super()
		this._shadowRoot = this.attachShadow({ mode: 'open' })
		this._shadowRoot.appendChild(myDropdownTemplate.content.cloneNode(true))

		this.$label = this._shadowRoot.querySelector('.label')
		this.$list = this._shadowRoot.querySelector('.list')

		this._data = []
		this._defaultValue = ''
		this._selectedValue = ''

		this.isOpen = false
		
		console.log('constructor')
		this.render()
		this.bindEvent()
	}

	get placeholder() {
		return this.getAttribute('placeholder') || 'Please select an item'
	}
	set placeholder(value) {
		this.setAttribute('placeholder', value)
		this.$label.innerHTML = value
	}

	get data() {
		return this._data
	}
	set data(value) {
		this._data = value
		this.render()
	}

	get defaultValue() {
		return this._defaultValue
	}
	set defaultValue(value) {
		this._defaultValue = value
		this.selectedValue = value
	}

	get selectedValue() {
		return this._selectedValue
	}
	set selectedValue(value) {
		this._selectedValue = value
		this.render()
	}

	get selectedLabel() {
		const selectedItem = this.data.find(item => item.value === this.selectedValue)
		if (selectedItem) {
			return selectedItem.label
		}
		return ''
	}

	bindEvent() {
		this.$label.addEventListener('click', () => {
			this.toggleOpen(true)
		})

		this.$list.addEventListener('click', e => {
			if (e.target.classList.contains('item')) {
				this.selectedValue = e.target.dataset.value
				this.dispatchEvent(new CustomEvent('selected', {
					detail: {
						value: this.selectedValue
					}
				}))
				this.toggleOpen(false)
			}
		})
	}

	toggleOpen(val) {
		this.isOpen = val
		val ? this.$list.classList.add('show') : this.$list.classList.remove('show')
	}

	render() {
		this.$label.innerHTML = this.selectedLabel || this.placeholder
		const htmlArr = []
		this.data.forEach(item => {
			const itemStr = `<li class="item ${this.selectedValue === item.value ? 'selected' : ''}" data-value="${item.value}">
				${item.label}
			</li>`
			htmlArr.push(itemStr)
		})
		this.$list.innerHTML = htmlArr.join('')
	}
}

window.customElements.define('my-dropdown', MyDropdown)


