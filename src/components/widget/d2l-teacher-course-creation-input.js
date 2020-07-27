import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/button/button';
import { bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element/lit-element';
import { DEFAULT_SELECT_OPTION_VALUE, PAGES } from '../../consts';
import { BaseMixin } from '../../mixins/base-mixin';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';
import { TccServiceFactory } from '../../services/tccServiceFactory';

const NAME_INPUT_ID = 'course-name-input';
const TYPE_SELECT_ID = 'course-type-select';

class TeacherCourseCreationInput extends BaseMixin(LitElement) {

	static get properties() {
		return {
			configuredDepartments: {
				type: Array
			}
		};
	}

	static get styles() {
		return [
			bodySmallStyles,
			labelStyles,
			selectStyles,
			css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.flex-container {
				display: flex;
				flex-flow: column;
				width: 100%;
			}
			.flex-item {
				margin: 0.5em;
			}
			.flex-label {
				margin-top: 0.5em;
				margin-left: 0.5em;
				margin-right: 0.5em;
			}
			.button-container {
				justify-self: flex-start;
			}` // should the flex-container and flex-item styles be global to this project?
		];
	}

	constructor() {
		super();

		window.tccService = TccServiceFactory.getTccService();
	}

	async connectedCallback() {
		super.connectedCallback();
		await this.getConfiguredDepartments();
	}

	async getConfiguredDepartments() {
		this.configuredDepartments = await window.tccService.getConfiguredDepartments();
	}

	_handleNextClicked() {
		const courseName = this.shadowRoot.getElementById(NAME_INPUT_ID).value;
		const typeSelectElement = this.shadowRoot.getElementById(TYPE_SELECT_ID);
		const departmentId = typeSelectElement.options[typeSelectElement.selectedIndex].value;
		console.log(`Course Name: ${courseName} Department Id: ${departmentId}`);

		if (courseName.length > 0 && departmentId !== -1) {
			this.changePage(PAGES.CONFIRM_PAGE);
		}
	}

	_handleBackClicked() {
		this.changePage(PAGES.WELCOME_PAGE);
	}

	_renderConfiguredDepartments() {
		let configuredDepartmentOptions = [
			html`<option value=${DEFAULT_SELECT_OPTION_VALUE}>${this.localize('inputChooseTypePlaceholder')}</option>`
		];
		configuredDepartmentOptions = configuredDepartmentOptions.concat(this.configuredDepartments.map(department =>
			html`<option value=${department.OrgUnitId}>${department.Name}</option>`
		));
		return configuredDepartmentOptions;
	}

	render() {
		return html`
			<div class="flex-container">
				<p class="d2l-body-small flex-item">
					${this.localize('inputDescription')}
				</p>
				<d2l-input-text
					id=${NAME_INPUT_ID}
					class="flex-item"
					label="${this.localize('inputNameLabel')}*">
				</d2l-input-text>
				<label
					for="course-type-select"
					class="d2l-label-text flex-label">
						${this.localize('inputSelectLabel')}*
				</label>
				<select
					id=${TYPE_SELECT_ID}
					class="d2l-input-select flex-item"
					label=${this.localize('inputSelectLabel')}>
						${this._renderConfiguredDepartments()}
				</select>
				<div class="button-container flex-item">
					<d2l-button
						primary
						@click=${this._handleNextClicked}>
							${this.localize('nextButtonText')}
					</d2l-button>
					<d2l-button
						@click=${this._handleBackClicked}>
							${this.localize('backButtonText')}
					</d2l-button>
				</div>
			</div>
		`;
	}
}
customElements.define('d2l-tcc-input', TeacherCourseCreationInput);
