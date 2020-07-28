import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/tooltip/tooltip';
import { bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element/lit-element';
import { DEFAULT_SELECT_OPTION_VALUE, PAGES } from '../../constants';
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
			},
			nameIsInvalid: {
				type: Boolean
			},
			typeIsInvalid: {
				type: Boolean
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
			.tcc-input__input-container {
				display: flex;
				flex-flow: column;
				align-items: flex-start;
			}
			.tcc-input__input-container-item {
				margin-bottom: 24px;
			}
			.tcc-input__type-select-label {
				margin-bottom: 0px;
			}
			.tcc-input__button-container {
				justify-self: flex-start;
			}
			.tcc-input__button {
				margin-top: 24px;
				margin-right: 12px;
				margin-bottom: 0px;
			}`
		];
	}

	constructor() {
		super();

		window.tccService = TccServiceFactory.getTccService();
		this.nameIsInvalid = false;
		this.typeIsInvalid = false;
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
		const departmentId = parseInt(typeSelectElement.options[typeSelectElement.selectedIndex].value);
		const departmentName = typeSelectElement.options[typeSelectElement.selectedIndex].text;

		this.nameIsInvalid = courseName.length === 0;
		this.typeIsInvalid = departmentId === DEFAULT_SELECT_OPTION_VALUE;

		if (!this.nameIsInvalid && !this.typeIsInvalid) {
			const pageData = {
				courseName, departmentId, departmentName
			};
			this.changePage(PAGES.CONFIRM_PAGE, pageData);
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

	_renderNameInput() {
		const inputTextTemplate = html`
			<d2l-input-text
				id=${NAME_INPUT_ID}
				class="tcc-input__input-container-item tcc-input__name-input"
				label="${this.localize('inputNameLabel')}*"
				aria-invalid="${this.nameIsInvalid}">
			</d2l-input-text>
		`;

		let tooltipTemplate = html``;
		if (this.nameIsInvalid) {
			tooltipTemplate = html`
				<d2l-tooltip
					for="${NAME_INPUT_ID}"
					state="error"
					align="start">
						${this.localize('inputNameInvalidErrorMsg')}
				</d2l-tooltip>
			`;
		}
		return html`${inputTextTemplate}${tooltipTemplate}`;
	}

	_renderTypeSelect() {
		const selectTempalte = html`
			<select
				id=${TYPE_SELECT_ID}
				class="d2l-input-select tcc-input__input-container-item"
				label=${this.localize('inputSelectLabel')}
				aria-invalid="${this.typeIsInvalid}">
					${this._renderConfiguredDepartments()}
			</select>
		`;

		let tooltipTemplate = html``;
		if (this.typeIsInvalid) {
			tooltipTemplate = html`
				<d2l-tooltip
					for="${TYPE_SELECT_ID}"
					state="error"
					align="start">
						${this.localize('inputTypeInvalidErrorMsg')}
				</d2l-tooltip>
			`;
		}
		return html`${selectTempalte}${tooltipTemplate}`;
	}

	render() {
		return html`
			<div class="tcc-input__input-container">
				<p class="d2l-body-small tcc-input__input-container-item">
					${this.localize('inputDescription')}
				</p>
				${this._renderNameInput()}
				<label
					for="course-type-select"
					class="d2l-label-text tcc-input__type-select-label">
						${this.localize('inputSelectLabel')}*
				</label>
				${this._renderTypeSelect()}
				<div class="button-container tcc-input__input-container-item">
					<d2l-button
						class="tcc-input__button"
						primary
						@click=${this._handleNextClicked}>
							${this.localize('nextButtonText')}
					</d2l-button>
					<d2l-button
						class="tcc-input__button"
						@click=${this._handleBackClicked}>
							${this.localize('backButtonText')}
					</d2l-button>
				</div>
			</div>
		`;
	}
}
customElements.define('d2l-tcc-input', TeacherCourseCreationInput);
