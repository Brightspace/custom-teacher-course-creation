import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { PAGES } from '../../consts';
import { TccServiceFactory } from '../../services/tccServiceFactory';

class TeacherCourseCreationConfirm extends BaseMixin(LitElement) {

	static get properties() {
		return {
			tccService: {
				type: Object
			},
			pageData: {
				type: Object
			}
		};
	}

	static get styles() {
		return [heading2Styles, inputLabelStyles, css`
			:host {
				display: inline-block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			.tcc-confirm__info-div {
				padding: 12px 12px;
				margin-bottom: 36px;
				border-radius: 6px;
				border: 2px solid var(--d2l-color-sylvite);
				background-color: var(--d2l-color-regolith);
			}
			.tcc-confirm__back-button {
				margin: 0px 12px;
			}
			.tcc-confirm__course-type-div{
				margin-top: 12px;
			}
			p {
				margin: 0px;
				font-weight: bold;
			}
		`];
	}

	constructor() {
		super();

		this.tccService = TccServiceFactory.getTccService();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_back() {
		const data = this.pageData;
		this.changePage(PAGES.INPUT_PAGE, data);
	}

	_finish() {
		const data = this.pageData;
		this.tccService.createCourse()
			.then((id) => {
				data.generatedOrgUnitId = id;
				this.changePage(PAGES.SUCCESS_PAGE, data);
			})
			.catch((error) => {
				data.errorMessage = error.message;
				this.changePage(PAGES.ERROR_PAGE, data);
			});
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">${this.localize('confirmTitle')}</h1>
			<div class="tcc-confirm__info-div">
				<div>
					<label for="courseName" class="d2l-label-text">
						${this.localize('courseName')}
					</label>
					<p id="courseName">
						${this.pageData.courseName}
					</p>
				</div>
				<div class="tcc-confirm__course-type-div">
					<label for="courseType" class="d2l-label-text">
						${this.localize('courseType')}
					</label>
					<p id="courseType">
						${this.pageData.courseType}
					</p>
				</div>
			</div>

			<d2l-button
			class="tcc-confirm__finish-button"
			primary
			description=${this.localize('actionFinishDescription')}
			@click=${this._finish}>
				${this.localize('actionFinish')}
			</d2l-button>
			<d2l-button
			class="tcc-confirm__back-button"
			description=${this.localize('actionBackDescription')}
			@click=${this._back}>
				${this.localize('actionBack')}
			</d2l-button>
		`;
	}
}
customElements.define('d2l-tcc-confirm', TeacherCourseCreationConfirm);
