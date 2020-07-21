import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { getTccService } from '../services/tccServiceFactory';

class TeacherCourseCreation extends BaseMixin(LitElement) {

	static get properties() {
		return {
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();

		window.tccService = getTccService();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		return html`
			<h2>Hello ${this.prop1}!</h2>
			<div>Localization Example: ${this.localize('tccToolName')}</div>
		`;
	}
}
customElements.define('d2l-tcc', TeacherCourseCreation);
