import '../../../images/create-course-illustration';
import '@brightspace-ui/core/components/button/button.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { PAGES } from '../../consts';
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
				max-width: 250px;
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
		this.changePage(PAGES.CONFIRM_PAGE);
	}

	render() {
		return html`
			<tcc-create-course-illustration></tcc-create-course-illustration>

			<h1 class="d2l-heading-2">${this.localize('welcomeTitle')}</h1>
			<div>${this.localize('welcomeText')}</div>

			<d2l-button
				class="tcc-welcome-button-get-started"
				description=${this.localize('welcomeButtonDescription')}
				@click=${this._changePage}>
				${this.localize('welcomeButtonText')}
			</d2l-button>
		`;
	}
}
customElements.define('d2l-tcc-welcome', TeacherCourseCreationWelcome);
