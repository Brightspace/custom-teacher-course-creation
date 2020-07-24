import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { TccServiceFactory } from '../../services/tccServiceFactory';

class TeacherCourseCreationSuccess extends BaseMixin(LitElement) {

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

		window.tccService = TccServiceFactory.getTccService();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		return html`
			<h2>Hello ${this.prop1}!</h2>
			<div>Localization Example: ${this.localize('tccToolName')}</div>
			<div>Success Page</div>
		`;
	}
}
customElements.define('d2l-tcc-success', TeacherCourseCreationSuccess);
