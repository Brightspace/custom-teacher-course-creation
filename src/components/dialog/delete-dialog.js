import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
// import { DEFAULT_SELECT_OPTION_VALUE } from '../../constants';
// import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
// import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles';
// import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
// import { TccServiceFactory } from '../../services/tccServiceFactory';

class TccDeleteDialog extends BaseMixin(LitElement) {
	static get properties() {
		return {
		};
	}

	static get styles() {
		const deleteDialogStyles = css``;
		return [
			deleteDialogStyles
		];
	}

	render() {
		return html`
			<d2l-dialog
				?opened=${this.associationDialogOpened}
				title-text="${this._getDialogTitle()}"
				@d2l-dialog-close=${this._close}>
			</d2l-dialog>
		`;
	}
}
customElements.define('d2l-tcc-delete-dialog', TccDeleteDialog);
