import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { getTccService } from '../services/tccServiceFactory';

class TeacherCourseCreationAdmin extends BaseMixin(LitElement) {

	static get properties() {
		return {
			associations: {
				type: Array
			},
			roles: {
				type: Array
			},
			courseTypes: {
				type: Array
			}
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

		this.associations = [];
		this.roles = [];
		this.courseTypes = [];

		window.tccService = getTccService();
	}

	async connectedCallback() {
		super.connectedCallback();

		this.roles = await window.tccService.getRoles();
		this.courseTypes = await window.tccService.getCourseTypes();
		this.associations = await window.tccService.getAssociations();
	}

	render() {
		return html`
			<table>
			</table>
		`;
	}
}
customElements.define('d2l-tcc-admin', TeacherCourseCreationAdmin);
