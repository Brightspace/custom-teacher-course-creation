import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui/core/components/tooltip/tooltip';
import { bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles';
import { COURSE_NAME_MAX_LENGTH, DEFAULT_SELECT_OPTION_VALUE, PAGES } from '../../constants';
import { css, html, LitElement } from 'lit-element/lit-element';
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
			nameIsEmpty: {
				type: Boolean
			},
			nameIsTooLong: {
				type: Boolean
			},
			typeIsNotSelected: {
				type: Boolean
			},
			pageData: {
				type: Object
			},
			courseName: {
				type: String
			},
			departmentId: {
				type: String
			},
			nextDisabled: {
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
			}
			.tcc-input__input-container-item {
				margin-bottom: 24px;
			}
			.tcc-input__type-select-label {
				margin-bottom: 6px;
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
		this.nameIsEmpty = false;
		this.typeIsNotSelected = false;
		this.courseName = '';
		this.departmentId = DEFAULT_SELECT_OPTION_VALUE;
		this.nextDisabled = true;
	}

	async connectedCallback() {
		super.connectedCallback();
		await this.getConfiguredDepartments();
		if (this.pageData && this.pageData.courseName && this.pageData.departmentId) {
			this.courseName = this.pageData.courseName;
			this.departmentId = this.pageData.departmentId;
			this._validateValues(this.courseName, this.departmentId);
		}
	}

	async getConfiguredDepartments() {
		this.configuredDepartments = await window.tccService.getConfiguredDepartments();
	}

	_handleNextClicked() {
		const courseName = this.shadowRoot.querySelector(`#${NAME_INPUT_ID}`).value;
		const typeSelectElement = this.shadowRoot.querySelector(`#${TYPE_SELECT_ID}`);
		const departmentId = typeSelectElement.options[typeSelectElement.selectedIndex].value;
		const departmentName = typeSelectElement.options[typeSelectElement.selectedIndex].text;

		this._validateValues(courseName, departmentId);
		if (!this.nextDisabled) { // still validate in case the button was manually enabled
			const pageData = {
				courseName, departmentId, departmentName
			};
			this.changePage(PAGES.CONFIRM_PAGE, pageData);
		}
	}

	_handleBackClicked() {
		this.changePage(PAGES.WELCOME_PAGE);
	}

	_handleValueChanged() {
		const courseName = this.shadowRoot.querySelector(`#${NAME_INPUT_ID}`).value;
		const typeSelectElement = this.shadowRoot.querySelector(`#${TYPE_SELECT_ID}`);
		const departmentId = typeSelectElement.options[typeSelectElement.selectedIndex].value;

		this._validateValues(courseName, departmentId);
	}

	_validateValues(courseName, departmentId) {
		this.nameIsEmpty = courseName.length === 0;
		this.nameIsTooLong = courseName.length > COURSE_NAME_MAX_LENGTH;
		this.typeIsNotSelected = departmentId === DEFAULT_SELECT_OPTION_VALUE;

		this.nextDisabled = this.nameIsEmpty || this.nameIsTooLong || this.typeIsNotSelected;
	}

	_renderConfiguredDepartments() {
		let configuredDepartmentOptions = [
			html`<option value=${DEFAULT_SELECT_OPTION_VALUE}>${this.localize('inputChooseTypePlaceholder')}</option>`
		];
		configuredDepartmentOptions = configuredDepartmentOptions.concat(
			this.configuredDepartments.map(({ Department: { OrgUnitId, Name } }) =>
				html`<option value=${OrgUnitId} ?selected="${OrgUnitId === this.departmentId}">${Name}</option>`
			));
		return configuredDepartmentOptions;
	}

	_renderNameInput() {
		const inputTextTemplate = html`
			<d2l-input-text
				id=${NAME_INPUT_ID}
				class="tcc-input__input-container-item tcc-input__name-input"
				label="${this.localize('inputNameLabel')} *"
				aria-invalid="${this.nameIsTooLong}"
				@input=${this._handleValueChanged}
				value=${this.courseName}>
			</d2l-input-text>
		`;

		let tooltipTemplate = html``;
		if (this.nameIsTooLong) {
			tooltipTemplate = html`
				<d2l-tooltip
					for="${NAME_INPUT_ID}"
					state="error"
					align="start">
						${this.localize('inputNameTooLongErrorMsg')}
				</d2l-tooltip>
			`;
		}
		return html`${inputTextTemplate}${tooltipTemplate}`;
	}

	render() {
		return html`
			<div class="tcc-input__input-container">
				<p class="d2l-body-small tcc-input__input-container-item">
					${this.localize('inputDescription')}
				</p>
				${this._renderNameInput()}
				<label
					for="${TYPE_SELECT_ID}"
					class="d2l-label-text tcc-input__type-select-label">
						${this.localize('inputSelectLabel')} *
				</label>
				<select
					id=${TYPE_SELECT_ID}
					class="d2l-input-select tcc-input__input-container-item"
					label=${this.localize('inputSelectLabel')}
					@change=${this._handleValueChanged}>
						${this._renderConfiguredDepartments()}
				</select>
				<div class="button-container tcc-input__input-container-item">
					<d2l-button
						id="tcc-input-next-button"
						class="tcc-input__button"
						primary
						?disabled="${this.nextDisabled}"
						@click=${this._handleNextClicked}>
							${this.localize('actionNext')}
					</d2l-button>
					<d2l-button
						id="tcc-input-back-button"
						class="tcc-input__button"
						@click=${this._handleBackClicked}>
							${this.localize('actionBack')}
					</d2l-button>
				</div>
			</div>
		`;
	}
}
customElements.define('d2l-tcc-input', TeacherCourseCreationInput);
