import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { bodySmallStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { PAGES } from '../../consts';
import { TccServiceFactory } from '../../services/tccServiceFactory';

class TeacherCourseCreationSuccess extends BaseMixin(LitElement) {

	static get properties() {
		return {
			pageData: {
				type: Object
			},
			generatedOrgUnitId: {
				type: String
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
			.tcc-success__title-container {
				display: flex;
				flex-direction: row;
				align-items: baseline;
			}
			.tcc-success__title-icon {
				margin: 12px;
				color: var(--d2l-color-feedback-success);
				flex-shrink: 0;
			}
			.tcc-success__links-container {
				display: flex;
				flex-direction: column;
				margin-bottom: 1.5rem;
				border: 2px solid var(--d2l-color-gypsum);
				background-color: var(--d2l-color-sylvite);
				border-radius: 6px;
    			padding: 12px;
			}
			.tcc-success__text {
				margin-bottom: 1.5rem;
			}
		`];
	}

	constructor() {
		super();

		window.tccService = TccServiceFactory.getTccService();
	}

	connectedCallback() {
		super.connectedCallback();

		if (this.pageData && this.pageData.generatedOrgUnitId) {
			this.generatedOrgUnitId = this.pageData.generatedOrgUnitId;
		}
	}

	_donePressed() {
		this.changePage(PAGES.WELCOME_PAGE);
	}

	_anotherCoursePressed() {
		this.changePage(PAGES.INPUT_PAGE);
	}

	_getCourseEnrollHref(orgUnitId) {
		return `/d2l/lms/classlist/classlist.d2l?ou=${orgUnitId}`;
	}

	_getCourseHomepageHref(orgUnitId) {
		return `/${orgUnitId}`;
	}

	render() {
		return html`
			<div class="tcc-success__title-container">
				<d2l-icon
					class="tcc-success__title-icon"
					icon="tier1:check-circle">
				</d2l-icon>
				<h1 class="d2l-heading-2">${this.localize('successTitleText')}</h1>
			</div>

			<div class="tcc-success__links-container">
				<d2l-link
					href=${this._getCourseEnrollHref(this.generatedOrgUnitId)}>
					${this.localize('successLinkEnrollStudents')}
				</d2l-link>
				<d2l-link
					href=${this._getCourseHomepageHref(this.generatedOrgUnitId)}>
					${this.localize('successLinkCourseHomepage')}
				</d2l-link>
				<d2l-link
					class="tcc-success__another-course-link"
					@click=${this._anotherCoursePressed}>
					${this.localize('successLinkCreateCourse')}
				</d2l-link>
			</div>

			<div class="d2l-body-small tcc-success__text">
				${this.localize('successResultText')}
			</div>

			<d2l-button
				description=${this.localize('successDoneButtonDescription')}
				@click=${this._donePressed}
				primary>
				${this.localize('successDoneButtonText')}
			</d2l-button>
		`;
	}
}
customElements.define('d2l-tcc-success', TeacherCourseCreationSuccess);
