import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import './widget/d2l-teacher-course-creation-welcome';
import './widget/d2l-teacher-course-creation-input';
import './widget/d2l-teacher-course-creation-confirm';
import './widget/d2l-teacher-course-creation-success';
import './widget/d2l-teacher-course-creation-error';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { PAGES } from '../constants';
import { TccServiceFactory } from '../services/tccServiceFactory';

class TeacherCourseCreation extends BaseMixin(LitElement) {

	static get properties() {
		return {
			currentPage: {
				type: String
			},
			pageData: {
				type: Object
			},
			pageHeight: {
				type: Number
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			.tcc-widget__spinner {
				display: flex;
			}
		`;
	}

	constructor() {
		super();

		window.tccService = TccServiceFactory.getTccService();

		this.currentPage = PAGES.WELCOME_PAGE;
		this.pageData = null;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_isViewEmpty() {
		return document.querySelector('d2l-tcc').shadowRoot.children[0].shadowRoot.children.length === 0;
	}

	_changePage(event) {
		if (event.detail) {
			// This maintains the height of the widget when loading
			if (!this._isViewEmpty()) {
				this.pageHeight = parseInt(document.querySelector('d2l-tcc').clientHeight);
			}

			const { detail: { page, pageData } } = event;
			this.currentPage = page;
			this.pageData = pageData;
		}
	}

	render() {
		if (this.currentPage === PAGES.WELCOME_PAGE) {
			return html `
			<d2l-tcc-welcome
				@change-page=${this._changePage}>
			</d2l-tcc-welcome>
			`;
		}
		if (this.currentPage === PAGES.INPUT_PAGE) {
			return html `
			<d2l-tcc-input
				@change-page=${this._changePage}
				.pageData=${this.pageData}>
			</d2l-tcc-input>
			`;
		}
		if (this.currentPage === PAGES.CONFIRM_PAGE) {
			return html `
			<d2l-tcc-confirm
				@change-page=${this._changePage}
				.pageData=${this.pageData}>
			</d2l-tcc-confirm>
			`;
		}
		if (this.currentPage === PAGES.SUCCESS_PAGE) {
			return html `
			<d2l-tcc-success
				@change-page=${this._changePage}
				.pageData=${this.pageData}>
			</d2l-tcc-success>
			`;
		}
		if (this.currentPage === PAGES.ERROR_PAGE) {
			return html `
			<d2l-tcc-error
				@change-page=${this._changePage}
				.pageData=${this.pageData}>
			</d2l-tcc-error>
			`;
		}
		if (this.currentPage === PAGES.LOADING_PAGE) {
			return html `
			<d2l-loading-spinner
				class="tcc-widget__spinner"
				style="height: ${this.pageHeight}px;">
			</d2l-loading-spinner>
			`;
		}
	}
}
customElements.define('d2l-tcc', TeacherCourseCreation);
