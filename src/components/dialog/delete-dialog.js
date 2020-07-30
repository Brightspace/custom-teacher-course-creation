import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';

class TccDeleteDialog extends BaseMixin(LitElement) {
	static get properties() {
		return {
			deleteDialogOpened: {
				attribute: 'opened',
				reflect: true,
				type: Boolean
			}
		};
	}

	static get styles() {
		const deleteDialogStyles = css``;
		return [
			deleteDialogStyles
		];
	}

	constructor() {
		super();

		this.deleteDialogOpened = false;
	}

	async open() {
		this.deleteDialogOpened = true;
	}

	_close() {
		this.deleteDialogOpened = false;
	}

	_handleDialogClose(event) {
		if (event.detail.action === 'yes') {
			this.dispatchEvent(new Event('delete-confirmed'));
		}
		this._close();
	}

	render() {
		return html`
			<d2l-dialog-confirm
				id="delete-dialog"
				?opened=${this.deleteDialogOpened}
				title-text="${this.localize('dialogDeleteTitle')}"
				text="${this.localize('dialogDeleteText')}"
				@d2l-dialog-close=${this._handleDialogClose}>
				<d2l-button slot="footer" primary data-dialog-action="yes">${this.localize('yes')}</d2l-button>
				<d2l-button slot="footer" data-dialog-action>${this.localize('no')}</d2l-button>
			</d2l-dialog-confirm>
		`;
	}
}
customElements.define('d2l-tcc-delete-dialog', TccDeleteDialog);
