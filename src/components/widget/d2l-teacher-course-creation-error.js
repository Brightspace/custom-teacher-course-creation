import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { bodySmallStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { PAGES } from '../../constants';
import { TccServiceFactory } from '../../services/tccServiceFactory';

class TeacherCourseCreationError extends BaseMixin(LitElement) {

	static get properties() {
		return {
			pageData: {
				type: Object
			},
			errorMessage: {
				type: String
			},
			hideBack: {
				type: Boolean
			}
		};
	}

	static get styles() {
		return [heading2Styles, bodySmallStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.tcc-error__title-container {
				display: flex;
				flex-direction: row;
				align-items: baseline;
			}
			.tcc-error__title-icon {
				margin: 12px;
				color: var(--d2l-color-feedback-error);
				flex-shrink: 0;
			}
			.tcc-error__description-container {
				margin-bottom: 12px;
				border: 2px solid var(--d2l-color-gypsum);
				background-color: var(--d2l-color-sylvite);
				border-radius: 6px;
    			padding: 12px;
			}
			.tcc-error__text {
				margin-bottom: 30px;
			}
		`];
	}

	constructor() {
		super();

		this.tccService = TccServiceFactory.getTccService();
		this.hideBack = false;
	}

	connectedCallback() {
		super.connectedCallback();

		if (this.pageData && this.pageData.ErrorMessage) {
			this.errorMessage = this.pageData.ErrorMessage;
		}
	}

	_backPressed() {
		this.changePage(PAGES.INPUT_PAGE, this.pageData);
	}

	_renderBack() {
		return !this.hideBack ? html`` : html`
		<d2l-button
			description=${this.localize('errorBackButtonDescription')}
			@click=${this._backPressed}
			primary>
			${this.localize('actionBack')}
		</d2l-button>
	`;
	}

	render() {
		return html`
			<div class="tcc-error__title-container">
				<d2l-icon
					class="tcc-error__title-icon"
					icon="tier2:alert">
				</d2l-icon>
				<h1 class="d2l-heading-2">${this.localize('errorTitleText')}</h1>
			</div>

			<div class="tcc-error__description-container">
				${this.errorMessage}
			</div>

			<div class="d2l-body-small tcc-error__text">
				${this.localize('errorResultText')}
			</div>
			${this._renderBack()}
		`;
	}
}
customElements.define('d2l-tcc-error', TeacherCourseCreationError);
