import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { COURSE_PREFIX_SUFFIX_MAX_LENGTH, DEFAULT_SELECT_OPTION_VALUE } from '../../constants';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { TccServiceFactory } from '../../services/tccServiceFactory';

const DEPARTMENT_SELECTOR_ID = 'association-department';
const PREFIX_INPUT_ID = 'association-prefix';
const SUFFIX_INPUT_ID = 'association-suffix';
const ROLE_SELECTOR_ID = 'association-role';

const generateDefaultAssociation = () => {
	return {
		Department: {
			OrgUnitId: '-1',
			Name: ''
		},
		Prefix: '',
		Suffix: '',
		Role: {
			RoleId: -1,
			Name: ''
		}
	};
};

const deepCopy = (original) => {
	if (!original || !(original instanceof Object))
		return original;

	const copy = {};
	Object.keys(original).forEach(key =>
		copy[key] = deepCopy(original[key])
	);
	return copy;
};

class TccAssociationDialog extends BaseMixin(LitElement) {

	static get properties() {
		return {
			tccService: {
				type: Object
			},
			association: {
				type: Object
			},
			associationDialogOpened: {
				attribute: 'opened',
				reflect: true,
				type: Boolean
			},
			isNewAssociation: {
				type: Boolean
			},
			roles: {
				attribute: 'roles',
				type: Array
			},
			departments: {
				attribute: 'departments',
				type: Array
			},
			associationForm: {
				type: Object
			},
			departmentIsNotSelected: {
				type: Boolean
			},
			prefixIsTooLong: {
				type: Boolean
			},
			prefixIsEmpty: {
				type: Boolean
			},
			prefixContainsSpecialCharacters: {
				type: Boolean
			},
			suffixIsTooLong: {
				type: Boolean
			},
			suffixIsEmpty: {
				type: Boolean
			},
			suffixContainsSpecialCharacters: {
				type: Boolean
			},
			roleIsNotSelected: {
				type: Boolean
			},
			nextDisabled: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const associationDialogStyles = css`
			:host {
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.input_group {
				margin-top: 12px;
				margin-bottom: 24px;
				display: flex;
				flex-direction: column;
			}

			.prefix_suffix_group {
				margin-top: 12px;
				margin-bottom: 24px;
				display: flex;
				flex-direction: row;
			}

			.prefix_input_group, .suffix_input_group {
				width: 45%;
			}

			.prefix_input_group__info_label, .suffix_input_group__info_label {
				font-style: italic;
				color: grey;
				font-size: 0.7rem;
			}

			.prefix_input_group {
				padding-right: 5%;
			}

			.suffix_input_group {
				padding-left: 5%;
			}

			.button_group {
				margin-bottom: 12px;
			}

			.button_group__button {
				width: 102px;
				margin-right: 12px;
			}
		`;
		return [
			associationDialogStyles,
			inputStyles,
			inputLabelStyles,
			selectStyles
		];
	}

	constructor() {
		super();

		this.tccService = TccServiceFactory.getTccService();

		this.associationDialogOpened = false;
		this.isNewAssociation = false;
		this.association = generateDefaultAssociation();

		this.departmentIsNotSelected = false;
		this.prefixIsTooLong = false;
		this.prefixIsEmpty = false;
		this.suffixIsTooLong = false;
		this.suffixIsEmpty = false;
		this.roleIsNotSelected = false;
	}

	async open(associationToEdit) {
		if (!this.associationForm) {
			this.associationForm = this._formLoad();
		}

		if (associationToEdit) {
			this.association = deepCopy(associationToEdit);
			this.isNewAssociation = false;
			this.nextDisabled = false;
		} else {
			this.association = generateDefaultAssociation();
			this.isNewAssociation = true;
			this.nextDisabled = true;
		}
		this._formReset();
		this._isValid();

		this.associationDialogOpened = true;
	}

	async _close() {
		this.associationDialogOpened = false;
	}

	_formReset() {
		this.associationForm.PrefixInput.value = this.association.Prefix;
		this.associationForm.SuffixInput.value = this.association.Suffix;
		this._setSelectedIndexByValue(this.associationForm.DepartmentSelect, this.association.Department.OrgUnitId);
		this._setSelectedIndexByValue(this.associationForm.RoleSelect, this.association.Role.RoleId.toString());
	}

	_formLoad() {
		return {
			DepartmentSelect: this.shadowRoot.querySelector(`#${DEPARTMENT_SELECTOR_ID}`),
			PrefixInput: this.shadowRoot.querySelector(`#${PREFIX_INPUT_ID}`),
			SuffixInput: this.shadowRoot.querySelector(`#${SUFFIX_INPUT_ID}`),
			RoleSelect: this.shadowRoot.querySelector(`#${ROLE_SELECTOR_ID}`)
		};
	}

	_isValid() {
		this._updateAssociation();

		this.departmentIsNotSelected = Object.keys(this.association.Department).length === 0 && this.association.Department.constructor === Object;
		this.prefixIsEmpty = this.association.Prefix.length === 0;
		this.prefixIsTooLong = this.association.Prefix.length > COURSE_PREFIX_SUFFIX_MAX_LENGTH;
		this.prefixContainsSpecialCharacters = this._containsSpecialCharacters(this.association.Prefix);
		this.suffixIsEmpty = this.association.Suffix.length === 0;
		this.suffixIsTooLong = this.association.Suffix.length > COURSE_PREFIX_SUFFIX_MAX_LENGTH;
		this.suffixContainsSpecialCharacters = this._containsSpecialCharacters(this.association.Suffix);
		this.roleIsNotSelected = Object.keys(this.association.Role).length === 0 && this.association.Role.constructor === Object;

		this.nextDisabled = this.departmentIsNotSelected
			|| this.prefixIsEmpty || this.prefixIsTooLong || this.prefixContainsSpecialCharacters
			|| this.suffixIsEmpty || this.suffixIsTooLong || this.suffixContainsSpecialCharacters
			|| this.roleIsNotSelected;

		return !this.nextDisabled;
	}

	async _submitAssociation() {
		if (this._isValid()) {
			const {
				Department: { OrgUnitId },
				Prefix,
				Suffix,
				Role: { Id: RoleId }
			} = this.association;
			await this.tccService.saveAssociation(OrgUnitId, Prefix, Suffix, RoleId);
			this.dispatchEvent(new Event('association-dialog-save'));
			this._close();
		} else {
			await this.requestUpdate();
		}
	}

	_updateAssociation() {
		this.association.Prefix = this._getEnteredPrefix();
		this.association.Suffix = this._getEnteredSuffix();
		this.association.Department = this._getSelectedDepartment();
		this.association.Role = this._getSelectedRole();
	}

	_containsSpecialCharacters(textInputValue) {
		const validationRegex = /(,|:|%|&|#|\*|\?|<|>|\\|""|'|\|)/;
		return validationRegex.test(textInputValue);
	}

	_getSelectedOptionValue(selectElement) {
		return selectElement.options[selectElement.selectedIndex].value;
	}

	_getDialogTitle() {
		return this.isNewAssociation ?
			this.localize('dialogAssociationTitleNew') :
			this.localize('dialogAssociationTitleEdit');
	}

	_setSelectedIndexByValue(selectElement, selectedValue) {
		for (let i = 0; i < selectElement.options.length; i++) {
			if (selectElement.options[i].value === selectedValue) {
				selectElement.selectedIndex = i;
				return;
			}
		}
	}

	_getEnteredPrefix() {
		return this.associationForm.PrefixInput.value && this.associationForm.PrefixInput.value.trim();
	}

	_getEnteredSuffix() {
		return this.associationForm.SuffixInput.value && this.associationForm.SuffixInput.value.trim();
	}

	_getSelectedDepartment() {
		const selectedOrgUnitId = this._getSelectedOptionValue(this.associationForm.DepartmentSelect);
		if (selectedOrgUnitId === DEFAULT_SELECT_OPTION_VALUE) {
			return {};
		}
		const selectedDepartment = this.departments.find(department => department.Identifier === selectedOrgUnitId);
		return {
			OrgUnitId: selectedDepartment.Identifier,
			Name: selectedDepartment.Name
		};
	}

	_getSelectedRole() {
		const selectedRoleId = this._getSelectedOptionValue(this.associationForm.RoleSelect);
		if (selectedRoleId === DEFAULT_SELECT_OPTION_VALUE) {
			return {};
		}
		const selectedRole = this.roles.find(role => role.Identifier === selectedRoleId);
		return {
			Id: selectedRole.Identifier,
			Name: selectedRole.DisplayName
		};
	}

	_handleValueChanged() {
		this._isValid();
	}

	_generateOption(value, text) {
		return html`<option value="${value}">${text}</option>`;
	}

	_renderDepartmentOptions() {
		const departmentOptions = this.departments.map(
			department => this._generateOption(department.Identifier, department.Name)
		);

		return departmentOptions;
	}

	_renderRoleOptions() {
		const roleOptions = this.roles.map(
			role => this._generateOption(role.Identifier, role.DisplayName)
		);
		return roleOptions;
	}

	_renderDepartmentSelector() {
		return html`
			<div class="input_group">
				<label
					class="d2l-input-label"
					for=${DEPARTMENT_SELECTOR_ID}>
					${this.localize('department')} *
				</label>
				<select
					id=${DEPARTMENT_SELECTOR_ID}
					class="d2l-input-select"
					label=${this.localize('departmentSelectLabel')}
					@change=${this._handleValueChanged}>
					<option value="-1">${this.localize('dialogAssociationDepartmentPlaceholder')}</option>
					${this._renderDepartmentOptions()}
				</select>
			</div>
		`;
	}

	_renderPrefixInput() {
		const prefixInputTemplate = html`
			<div class="prefix_input_group">
				<d2l-input-text
					label="${this.localize('prefix')}"
					required
					id=${PREFIX_INPUT_ID}
					placeholder="${this.localize('dialogAssociationPrefixPlaceholder')}"
					aria-invalid="${this.prefixIsTooLong || this.prefixContainsSpecialCharacters}"
					@input=${this._handleValueChanged}
					novalidate>
				</d2l-input-text>
				<label
					class="prefix_input_group__info_label"
					for=${PREFIX_INPUT_ID}>
					${this.localize('dialogAssociationPrefixDescription')}
				</label>
			</div>
		`;

		let tooltipTemplate = html``;
		if (this.prefixIsTooLong || this.prefixContainsSpecialCharacters) {
			const tooltipMessage = this.prefixIsTooLong ?
				this.localize('prefixTooLongErrorMsg') :
				this.localize('prefixHasSpecialCharactersErrorMsg');

			tooltipTemplate = html`
				<d2l-tooltip
					for="${PREFIX_INPUT_ID}"
					state="error">
						${tooltipMessage}
				</d2l-tooltip>
			`;
		}

		return html`${prefixInputTemplate}${tooltipTemplate}`;
	}

	_renderSuffixInput() {
		const suffixInputTemplate = html`
			<div class="suffix_input_group">
				<d2l-input-text
					label="${this.localize('suffix')}"
					required
					id=${SUFFIX_INPUT_ID}
					aria-invalid="${this.suffixIsTooLong || this.suffixContainsSpecialCharacters}"
					placeholder="${this.localize('dialogAssociationSuffixPlaceholder')}"
					@input=${this._handleValueChanged}
					novalidate>
				</d2l-input-text>
				<label
					class="suffix_input_group__info_label"
					for=${SUFFIX_INPUT_ID}>
					${this.localize('dialogAssociationSuffixDescription')}
				</label>
			</div>
		`;

		let tooltipTemplate = html``;
		if (this.suffixIsTooLong || this.suffixContainsSpecialCharacters) {
			const tooltipMessage = this.suffixIsTooLong ?
				this.localize('suffixTooLongErrorMsg') :
				this.localize('suffixHasSpecialCharactersErrorMsg');

			tooltipTemplate = html`
				<d2l-tooltip
					for="${SUFFIX_INPUT_ID}"
					state="error">
						${tooltipMessage}
				</d2l-tooltip>
			`;
		}

		return html`${suffixInputTemplate}${tooltipTemplate}`;
	}

	_renderRoleSelector() {
		return html`
			<div class="input_group">
				<label
					class="d2l-input-label"
					for=${ROLE_SELECTOR_ID}>
					${this.localize('roleInputLabel')} *
				</label>
				<select
					id=${ROLE_SELECTOR_ID}
					class="d2l-input-select"
					label=${this.localize('roleSelectLabel')}
					@change=${this._handleValueChanged}>
					<option value="-1">${this.localize('dialogAssociationRolePlaceholder')}</option>
					${this._renderRoleOptions()}
				</select>
			</div>
		`;
	}

	render() {
		return html`
			<d2l-dialog
				?opened=${this.associationDialogOpened}
				title-text="${this._getDialogTitle()}"
				@d2l-dialog-close=${this._close}>
				<div>
					${this.localize('dialogAssociationDescription')}

					${this._renderDepartmentSelector()}
					<div class="prefix_suffix_group">
						${this._renderPrefixInput()}
						${this._renderSuffixInput()}
					</div>
					${this._renderRoleSelector()}

					<div class="button_group">
						<d2l-button
							class="button_group__button"
							slot="footer"
							primary
							?disabled="${this.nextDisabled}"
							@click=${this._submitAssociation}>
							${this.localize('actionSubmit')}
						</d2l-button>
						<d2l-button
							class="button_group__button"
							slot="footer"
							@click=${this._close}>
							${this.localize('actionCancel')}
						</d2l-button>
					</div>
				</div>
			</d2l-dialog>
		`;
	}

}
customElements.define('d2l-tcc-association-dialog', TccAssociationDialog);
