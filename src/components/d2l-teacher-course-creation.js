import './widget-ui/d2l-teacher-course-creation-welcome';
import './widget-ui/d2l-teacher-course-creation-input';
import './widget-ui/d2l-teacher-course-creation-confirm';
import './widget-ui/d2l-teacher-course-creation-success';
import './widget-ui/d2l-teacher-course-creation-error';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { PAGES } from '../helper';
import { TccServiceFactory } from '../services/tccServiceFactory';

class TeacherCourseCreation extends BaseMixin(LitElement) {

	static get properties() {
		return {
			currentPage: {
				type: String
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

		window.tccService = TccServiceFactory.getTccService();

		this.currentPage = PAGES.WELCOME_PAGE;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_changePage(event) {
		if (event.detail && event.detail.page) {
			this.currentPage = event.detail.page;
		}
	}

	render() {
		return html`
			<d2l-tcc-welcome
				?hidden=${this.currentPage !== PAGES.WELCOME_PAGE}
				@change-page=${this._changePage}
			></d2l-tcc-welcome>
			<d2l-tcc-input
				?hidden=${this.currentPage !== PAGES.INPUT_PAGE}
			></d2l-tcc-input>
			<d2l-tcc-confirm
				?hidden=${this.currentPage !== PAGES.CONFIRM_PAGE}
			></d2l-tcc-confirm>
			<d2l-tcc-success
				?hidden=${this.currentPage !== PAGES.SUCCESS_PAGE}
			></d2l-tcc-success>
			<d2l-tcc-error
				?hidden=${this.currentPage !== PAGES.ERROR_PAGE}
			></d2l-tcc-error>
		`;
	}
}
customElements.define('d2l-tcc', TeacherCourseCreation);
