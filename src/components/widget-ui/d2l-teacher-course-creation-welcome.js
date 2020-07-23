import '@brightspace-ui/core/components/button/button.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { PAGES } from '../../helper';
import { TccServiceFactory } from '../../services/tccServiceFactory';

class TeacherCourseCreationWelcome extends BaseMixin(LitElement) {

	static get properties() {
		return {
		};
	}

	static get styles() {
		return [heading2Styles, css`
			:host {
				display: inline-block;
				text-align: center;
			}
			:host([hidden]) {
				display: none;
			}
			.tcc-welcome-button-get-started {
				width: 100%;
				margin: 1rem 0px;
			}
		`];
	}

	constructor() {
		super();

		window.tccService = TccServiceFactory.getTccService();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_changePage() {
		const changePageEvent = new CustomEvent('change-page', {
			detail: {page: PAGES.INPUT_PAGE},
			bubbles: false,
			composed: false
		});
		this.dispatchEvent(changePageEvent);
	}

	render() {
		return html`
			<img src="../../../images/create-course-illustration-01.svg" alt=${this.localize('tccWelcomeIllustrationAlt')}>

			<h1 class="d2l-heading-2">${this.localize('tccWelcomeTitle')}</h1>
			<div>${this.localize('tccWelcomeText')}</div>

			<d2l-button
				class="tcc-welcome-button-get-started"
				description=${this.localize('tccWelcomeButtonDescription')}
				@click=${this._changePage}
			>
				${this.localize('tccWelcomeButtonText')}
			</d2l-button>
		`;
	}
}
customElements.define('d2l-tcc-welcome', TeacherCourseCreationWelcome);
