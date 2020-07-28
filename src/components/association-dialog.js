import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { TccServiceFactory } from '../services/tccServiceFactory';

const DEFAULT_ASSOCIATION = {
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
		this.association = {...DEFAULT_ASSOCIATION};
		this.invalidFlags = {
			Department: false,
			Prefix: false,
			Suffix: false,
			Role: false
		};
	}

	async open(associationToEdit) {
		if (!associationToEdit) {
			this._formReset();
		} else {
			this.association = associationToEdit;
		}

		this.associationDialogOpened = true;
		await this.requestUpdate();

		if (!this.associationForm) {
			this.associationForm = this._formLoad();
		}
	}

	async _close() {
		this.associationDialogOpened = false;
	}

	_formReset() {
		this.isNewAssociation = true;
		this.association = {...DEFAULT_ASSOCIATION};

		Object.keys(this.invalidFlags).map(
			flag => this.invalidFlags[flag] = false
		);

		if (this.associationForm) {
			this.associationForm.DepartmentSelect.selectedIndex = 0;
			this.associationForm.RoleSelect.selectedIndex = 0;
			this.associationForm.PrefixInput.value = '';
			this.associationForm.SuffixInput.value = '';
		}
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
		return Object.values(this.invalidFlags).filter(flag => flag === true).length === 0;
	}

	async _submitAssociation() {
		this._updateAssociationFromForm();
		if (this._formIsValid()) {
			await this.tccService.saveAssociation(this.association);
			this.isNewAssociation = false;
			this.dispatchEvent(new Event('association-dialog-save'));
			this._close();
		} else {
			await this.requestUpdate();
		}
	}

	_updateAssociationFromForm() {
		this.association.Prefix = this._getEnteredPrefix();
		this.association.Suffix = this._getEnteredSuffix();
		this.association.Department = this._getSelectedDepartment();
		this.association.Role = this._getSelectedRole();
	}

	_getEnteredPrefix() {
		if (!this.associationForm.PrefixInput.value) {
			this.invalidFlags.Prefix = true;
		} else {
			this.invalidFlags.Prefix = false;
		}
		return this.associationForm.PrefixInput.value;
	}

	_getEnteredSuffix() {
		if (!this.associationForm.SuffixInput.value) {
			this.invalidFlags.Suffix = true;
		} else {
			this.invalidFlags.Suffix = false;
		}
		return this.associationForm.SuffixInput.value;
	}

	_getSelectedOptionValue(selectElement) {
		return parseInt(selectElement.options[selectElement.selectedIndex].value);
	}

	_getSelectedDepartment() {
		const selectedOrgUnitId = this._getSelectedOptionValue(this.associationForm.DepartmentSelect);
		if (selectedOrgUnitId < 0) {
			this.invalidFlags.Department = true;
			return {};
		}
		this.invalidFlags.Department = false;
		const selectedDepartment = this.departments.find(department => parseInt(department.OrgUnitId) === selectedOrgUnitId);
		return {
			OrgUnitId: selectedDepartment.OrgUnitId,
			Name: selectedDepartment.Name
		};
	}

	_getSelectedRole() {
		const selectedRoleId = this._getSelectedOptionValue(this.associationForm.RoleSelect);
		if (selectedRoleId < 0) {
			this.invalidFlags.Role = true;
			return {};
		}
		this.invalidFlags.Role = false;
		const selectedRole = this.roles.find(role => role.Identifier === selectedRoleId);
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

	_generateOption(value, text, selected) {
		return html`<option value="${value}" ?selected=${selected}>${text}</option>`;
	}

	_renderDepartmentOptions() {
		const departmentOptions = this.departments.map(
			department => {
				const isSelected = department.OrgUnitId === this.association.Department.OrgUnitId;
				return this._generateOption(department.OrgUnitId, department.Name, isSelected);
			});
		return departmentOptions;
	}

	_renderRoleOptions() {
		const roleOptions = this.roles.map(
			role => {
				const isSelected = role.Identifier === this.association.Role.Id;
				return this._generateOption(role.Identifier, role.DisplayName, isSelected);
			});
		return roleOptions;
	}

	render() {
		return html`
			<d2l-dialog
				?opened=${this.associationDialogOpened}
				title-text="${this._getDialogTitle()}"
				@d2l-dialog-close=${this._close}
				>
				<div class="association_form">
					<div class="association_form__input_group">
						<label for="association-department">
							${this.localize('dialogAssociationDepartmentLabel')}
						</label>
						<select
							id="association-department"
							class="d2l-input-select"
							aria-invalid=${this.invalidFlags.Department}
							>
							<option value="-1">${this.localize('dialogAssociationDepartmentPlaceholder')}</option>
							${this._renderDepartmentOptions()}
						</select>
					</div>

					<div class="association_form__input_group">
						<label for="association-prefix">
							${this.localize('dialogAssociationPrefixLabel')}
						</label>
						<d2l-input-text
							id="association-prefix"
							value="${this.association.Prefix}"
							placeholder="${this.localize('dialogAssociationPrefixPlaceholder')}"
							aria-invalid=${this.invalidFlags.Prefix}
							>
						</d2l-input-text>
					</div>

					<div class="association_form__input_group">
						<label for="association-suffix">
							${this.localize('dialogAssociationSuffixLabel')}
						</label>
						<d2l-input-text
							id="association-suffix"
							value="${this.association.Suffix}"
							aria-invalid=${this.invalidFlags.Suffix}
							placeholder="${this.localize('dialogAssociationSuffixPlaceholder')}"
							>
						</d2l-input-text>
					</div>

					<div class="association_form__input_group">
						<label for="association-role">
							${this.localize('dialogAssociationRoleLabel')}
						</label>
						<select
							id="association-role"
							class="d2l-input-select"
							aria-invalid=${this.invalidFlags.Role}
							>
							<option value="-1">${this.localize('dialogAssociationRolePlaceholder')}</option>
							${this._renderRoleOptions()}
						</select>
					</div>

					<div class="association_form__button_group">
						<d2l-button
							class="association_form__button"
							slot="footer"
							primary
							@click=${this._submitAssociation}
							>
							${this.localize('dialogAssociationSubmitButton')}
						</d2l-button>
						<d2l-button
							class="association_form__button"
							slot="footer"
							@click=${this._close}
							>
							${this.localize('dialogAssociationCancelButton')}
						</d2l-button>
					</div>
				</div>
			</d2l-dialog>
		`;
	}

}
customElements.define('d2l-tcc-association-dialog', TccAssociationDialog);
