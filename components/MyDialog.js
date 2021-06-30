const myDialogTpl = document.createElement('template');
myDialogTpl.innerHTML = `
	<style>
		:host {
			display: block;
		}
		.my-dialog {
			display: none;
		}
		.my-dialog.open {
			display: block;
		}
		.mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, .4);
			z-index: 999;
		}
		.content {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 80%;
			z-index: 1000;
			background: #fff;
			border: 1px solid #a1a1a1;
			box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
		}
		.dialog-hd {
			position: relative;
			padding: 20px 16px 16px 16px;
			border-bottom: 1px solid #ddd;
		}
		.title {
			font-size: 18px;
			font-weight: 600;
			text-align: center;
		}
		.btn-close {
			position: absolute;
			right: 16px;
			top: 50%;
			transform: translateY(-50%);
			width: 20px;
			height: 20px;
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAAB/ElEQVRoBe2Yv26DMBDGU6BD5kwwRTxA9+xdsmSr+hZ9mL5Etw6Zs0d9CcasMCBlSihfhSXLCdzZvkioOi8QfH++39lgx4uFNq2AVkAroBXQCjAqsNlsluv1el+W5SvDPMgEsZEDubgBnjiGCHg6nfa9LcSf0zTdVVV14PhybSD+crkgB8QfiqLYHY/HM+VPAjjiTTxRCEe8ycGCSI312DXLsu++b+v0P3dd97ZarX7quq6cPq+fI+IRo2zb9qVpmq+pgMlUJ/qSJPnsL/eGcokhhwAqxlj/hHi4nIfcY+5/z8kpBCsqUcg7IRWTBSANISUeutgAUhCS4r0BYiGkxQcBhEI8QnwwgC/Eo8RHAXAhYGetsPhpt+gF0esltjObe6q6g929vU20eMSOBkAQAgImbhMRj6AiAAjkASEmXhSACSEqHjnJvRCM5tx0CmF0POa/GUyxqRQ9AoR4sw2f52eUEo9tNko+y4WMI978b/axNXOMew2aQiGCQnw4EN4AMUJifMdgvAAkBEjEsGHYAJKJJWOxACQTmupJxSQBpBIZ4fZVIja5F7perx990ocsRPjMDmuFWfBsvuWQ2352c08C5Hn+3nu556BiW4EJiMOQ+0a0/YCcQjB2zkfFxNtCnOnEOhe1/cl7QMzxeJ0UrgZaAa2AVkAr8K8r8AsyeML+4ho6NwAAAABJRU5ErkJggg==') no-repeat center center;
			background-size: 100% 100%;
		}
		.dialog-bd {
			padding: 20px 16px;
			border-bottom: 1px solid #ddd;
		}
		.dialog-ft {
			display: flex;
		}
		.btn {
			display: block;
			flex: 1;
			height: 48px;
			line-height: 48px;
			text-align: center;
			font-size: 18px;
			background: none;
			border: 0;
		}
		.btn.hidden {
			display: none;
		}
		.btn-primary {
			color: #0088c6;
		}
		.btn-secondary {
			color: rgba(0, 0, 0, .6);
		}
	</style>
	<div class="my-dialog">
		<div class="mask"></div>
		<div class="content">
			<div class="dialog-hd">
				<div class="title"></div>
				<span class="btn-close"></span>
			</div>
			<div class="dialog-bd">
				<slot></slot>
			</div>
			<div class="dialog-ft">
				<button class="btn btn-secondary"></button>
				<button class="btn btn-primary"></button>
			</div>
		</div>
	</div>
`;
class MyDialog extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(myDialogTpl.content.cloneNode(true));

    this.$dialog = this._shadowRoot.querySelector('.my-dialog');
    this.$title = this._shadowRoot.querySelector('.title');
    this.$confirmBtn = this._shadowRoot.querySelector('.btn-primary');
    this.$cancelBtn = this._shadowRoot.querySelector('.btn-secondary');
    this.$close = this._shadowRoot.querySelector('.btn-close');

    this.bindEvent();
  }

  get dialogTitle() {
    return this.getAttribute('dialogTitle');
  }
  set dialogTitle(value) {
    this.setAttribute('dialogTitle', value);
  }
  get visible() {
    return this.getAttribute('visible') === 'true';
  }
  set visible(value) {
    this.setAttribute('visible', value);
  }

  get hideConfirmBtn() {
    return this.hasAttribute('hideConfirmBtn');
  }
  set hideConfirmBtn(value) {
    value
      ? this.setAttribute('hideConfirmBtn', value)
      : this.removeAttribute('hideConfirmBtn');
  }

  get confirmText() {
    return this.getAttribute('confirmText') || 'Confirm';
  }
  set confirmText(value) {
    this.setAttribute('confirmText', value);
  }

  get hideCancelBtn() {
    return this.hasAttribute('hideCancelBtn');
  }
  set hideCancelBtn(value) {
    value
      ? this.setAttribute('hideCancelBtn')
      : this.removeAttribute('hideCancelBtn');
  }

  get cancelText() {
    return this.getAttribute('cancelText') || 'Cancel';
  }
  set cancelText(value) {
    this.setAttribute('cancelText', value);
  }

  static get observedAttributes() {
    return [
      'title',
      'visible',
      'hideConfirmBtn',
      'confirmText',
      'hideCancelBtn',
      'cancelText',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    this.$title.innerHTML = this.dialogTitle;

    this.$confirmBtn.innerHTML = this.confirmText;
    this.hideConfirmBtn
      ? this.$confirmBtn.classList.add('hidden')
      : this.$confirmBtn.classList.remove('hidden');

    this.$cancelBtn.innerHTML = this.cancelText;
    this.hideCancelBtn
      ? this.$cancelBtn.classList.add('hidden')
      : this.$cancelBtn.classList.remove('hidden');
    this.toggleVisible();
  }

  bindEvent() {
    this.$close.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close'));
    });

    this.$confirmBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('confirm', {}));
      this.dispatchEvent(new CustomEvent('close'));
    });

    this.$cancelBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel'));
      this.dispatchEvent(new CustomEvent('close'));
    });
  }

  toggleVisible() {
    this.visible
      ? this.$dialog.classList.add('open')
      : this.$dialog.classList.remove('open');
  }
}

window.customElements.define('my-dialog', MyDialog);
