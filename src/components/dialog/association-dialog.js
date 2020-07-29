import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../../mixins/base-mixin';
import { DEFAULT_SELECT_OPTION_VALUE } from '../../constants';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { TccServiceFactory } from '../../services/tccServiceFactory';

const generateDefaultAssociation = () => {
	return {
		Department: {
			OrgUnitId: '-1',
			Name: ''
		},
		Prefix: '',
		Suffix: '',
		Role: {
			Id: -1,
			Name: ''
		}
	};
};

const generateDefaultInvalidFlags = () => {
	return {
		Department: false,
		Prefix: false,
		Suffix: false,
		Role: false
	};
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

			.association_form {
			}

			.association_form__input_group {
				margin: 6px;
				display: flex;
				flex-direction: column;
			}

			.association_form__button_group {
				margin: 6px;
			}

			.association_form__button {
				width: 102px;
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
		this.invalidFlags = generateDefaultInvalidFlags();
	}

	async open(associationToEdit) {
		if (!this.associationForm) {
			this.associationForm = this._formLoad();
		}

		if (associationToEdit) {
			this.association = associationToEdit;
			this.isNewAssociation = false;
		} else {
			this.association = generateDefaultAssociation();
			this.isNewAssociation = true;
		}
		this._formReset();

		this.associationDialogOpened = true;
	}

	async _close() {
		this.associationDialogOpened = false;
	}

	_formReset() {
		this.invalidFlags = generateDefaultInvalidFlags();
		this.associationForm.PrefixInput.value = this.association.Prefix;
		this.associationForm.SuffixInput.value = this.association.Suffix;
		this._setSelectedIndexByValue(this.associationForm.DepartmentSelect, this.association.Department.OrgUnitId);
		this._setSelectedIndexByValue(this.associationForm.RoleSelect, this.association.Role.Id.toString());
	}

	_formLoad() {
		return {
			DepartmentSelect: this.shadowRoot.querySelector('#association-department'),
			PrefixInput: this.shadowRoot.querySelector('#association-prefix'),
			SuffixInput: this.shadowRoot.querySelector('#association-suffix'),
			RoleSelect: this.shadowRoot.querySelector('#association-role')
		};
	}

	_formIsValid() {
		return !Object.values(this.invalidFlags).includes(true);
	}

	async _submitAssociation() {
		this._updateAssociationWithValidation();
		if (this._formIsValid()) {
			await this.tccService.saveAssociation(this.association);
			this.dispatchEvent(new Event('association-dialog-save'));
			this._close();
		} else {
			await this.requestUpdate();
		}
	}

	_updateAssociationForReset() {
		this.association.Prefix = this.associationForm.PrefixInput.value;
		this.association.Suffix = this.associationForm.SuffixInput.value;
	}

	_updateAssociationWithValidation() {
		this.association.Prefix = this._getEnteredPrefix();
		this.association.Suffix = this._getEnteredSuffix();
		this.association.Department = this._getSelectedDepartment();
		this.association.Role = this._getSelectedRole();
	}

	_getEnteredPrefix() {
		const trimmedEntryValue = this.associationForm.PrefixInput.value && this.associationForm.PrefixInput.value.trim();
		this.invalidFlags.Prefix = !trimmedEntryValue;
		return trimmedEntryValue;
	}

	_getEnteredSuffix() {
		const trimmedEntryValue = this.associationForm.SuffixInput.value && this.associationForm.SuffixInput.value.trim();
		this.invalidFlags.Suffix = !trimmedEntryValue;
		return trimmedEntryValue;
	}

	_getSelectedOptionValue(selectElement) {
		return selectElement.options[selectElement.selectedIndex].value;
	}

	_getSelectedDepartment() {
		const selectedOrgUnitId = this._getSelectedOptionValue(this.associationForm.DepartmentSelect);
		if (selectedOrgUnitId === DEFAULT_SELECT_OPTION_VALUE) {
			this.invalidFlags.Department = true;
			return {};
		}
		this.invalidFlags.Department = false;
		const selectedDepartment = this.departments.find(department => department.OrgUnitId === selectedOrgUnitId);
		return {
			OrgUnitId: selectedDepartment.OrgUnitId,
			Name: selectedDepartment.Name
		};
	}

	_getSelectedRole() {
		const selectedRoleId = this._getSelectedOptionValue(this.associationForm.RoleSelect);
		if (selectedRoleId === DEFAULT_SELECT_OPTION_VALUE) {
			this.invalidFlags.Role = true;
			return {};
		}
		this.invalidFlags.Role = false;
		const selectedRole = this.roles.find(role => role.Identifier === parseInt(selectedRoleId));
		return {
			Id: selectedRole.Identifier,
			Name: selectedRole.DisplayName
		};
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

	_generateOption(value, text) {
		return html`<option value="${value}">${text}</option>`;
	}

	_renderDepartmentOptions() {
		const departmentOptions = this.departments.map(
			department => this._generateOption(department.OrgUnitId, department.Name)
		);

		return departmentOptions;
	}

	_renderRoleOptions() {
		const roleOptions = this.roles.map(
			role => this._generateOption(role.Identifier, role.DisplayName)
		);
		return roleOptions;
	}

	render() {
		return html`
			<d2l-dialog
				?opened=${this.associationDialogOpened}
				title-text="${this._getDialogTitle()}"
				@d2l-dialog-close=${this._close}>
				<div class="association_form">
					<div class="association_form__input_group">
						<label for="association-department">
							${this.localize('department')}
						</label>
						<select
							id="association-department"
							class="d2l-input-select"
							aria-invalid="${this.invalidFlags.Department}">
							<option value="-1">${this.localize('dialogAssociationDepartmentPlaceholder')}</option>
							${this._renderDepartmentOptions()}
						</select>
					</div>

					<div class="association_form__input_group">
						<d2l-input-text
							label="${this.localize('prefix')}"
							id="association-prefix"
							placeholder="${this.localize('dialogAssociationPrefixPlaceholder')}"
							aria-invalid="${this.invalidFlags.Prefix}">
						</d2l-input-text>
					</div>

					<div class="association_form__input_group">
						<d2l-input-text
							label="${this.localize('suffix')}"
							id="association-suffix"
							aria-invalid="${this.invalidFlags.Suffix}"
							placeholder="${this.localize('dialogAssociationSuffixPlaceholder')}">
						</d2l-input-text>
					</div>

					<div class="association_form__input_group">
						<label for="association-role">
							${this.localize('role')}
						</label>
						<select
							id="association-role"
							class="d2l-input-select"
							aria-invalid="${this.invalidFlags.Role}">
							<option value="-1">${this.localize('dialogAssociationRolePlaceholder')}</option>
							${this._renderRoleOptions()}
						</select>
					</div>

					<div class="association_form__button_group">
						<d2l-button
							class="association_form__button"
							slot="footer"
							primary
							@click=${this._submitAssociation}>
							${this.localize('dialogAssociationSubmitButton')}
						</d2l-button>
						<d2l-button
							class="association_form__button"
							slot="footer"
							@click=${this._close}>
							${this.localize('dialogAssociationCancelButton')}
						</d2l-button>
					</div>
				</div>
			</d2l-dialog>
		`;
	}

}
customElements.define('d2l-tcc-association-dialog', TccAssociationDialog);
