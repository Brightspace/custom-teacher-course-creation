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
		OrgUnitId: '0',
		Name: ''
	},
	Prefix: '',
	Suffix: '',
	Role: {
		Id: 0,
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
		const associationDialog = css`
			:host {
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}
		`;
		return [
			associationDialog,
			inputStyles,
			inputLabelStyles,
			selectStyles
		];
	}

	constructor() {
		super();

		this.tccService = TccServiceFactory.getTccService();

		this.isNewAssociation = false;
		this.association = DEFAULT_ASSOCIATION;
		this.invalidFlags = {
			Department: false,
			Prefix: false,
			Suffix: false,
			Role: false
		};
	}

	async open(dialogAssociation) {
		if (!dialogAssociation) {
			this.isNewAssociation = true;
		} else {
			this.association = dialogAssociation;
		}
		this.associationDialogOpened = true;

		await this.requestUpdate();

		if (!this.associationForm) {
			this.associationForm = this._lazyLoadForm();
		}
	}

	async _close() {
		this.associationDialogOpened = false;
		this.association = DEFAULT_ASSOCIATION;
	}

	_lazyLoadForm() {
		return {
			DepartmentSelect: this.shadowRoot.querySelector('#association-department'),
			PrefixInput: this.shadowRoot.querySelector('#association-prefix'),
			SuffixInput: this.shadowRoot.querySelector('#association-suffix'),
			RoleSelect: this.shadowRoot.querySelector('#association-role')
		};
	}

	_getDialogTitle() {
		return this.isNewAssociation ?
			this.localize('dialogAssociationTitleNew') :
			this.localize('dialogAssociationTitleEdit');
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

	_formIsValid() {
		return Object.values(this.invalidFlags).filter(flag => flag === true).length === 0;
	}

	_updateAssociationFromForm() {
		this.association.Prefix = this._getEnteredPrefix();
		this.association.Suffix = this._getEnteredSuffix();
		this.association.Department = this._getSelectedDepartment();
		this.association.Role = this._getSelectedRole();
	}

	async _submitAssociation() {
		this._updateAssociationFromForm();
		if (this._formIsValid()) {
			await this.tccService.saveAssociation(this.association);
			this._close();
		} else {
			await this.requestUpdate();
		}
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
				@d2l-dialog-close=${this._close}
				title-text="${this._getDialogTitle()}"
				>
				<select
					id="association-department"
					class="d2l-input-select"
					aria-invalid=${this.invalidFlags.Department}
					>
					<option value="-1" ?selected=${this.isNewAssociation}>${this.localize('dialogPlaceholderDepartment')}</option>
					${this._renderDepartmentOptions()}
				</select>
				<d2l-input-text
					id="association-prefix"
					value="${this.association.Prefix}"
					placeholder="${this.localize('dialogPlaceholderPrefix')}"
					aria-invalid=${this.invalidFlags.Prefix}
					>
				</d2l-input-text>
				<d2l-input-text
					id="association-suffix"
					value="${this.association.Suffix}"
					aria-invalid=${this.invalidFlags.Suffix}
					placeholder="${this.localize('dialogPlaceholderSuffix')}"
					>
				</d2l-input-text>
				<select
					id="association-role"
					class="d2l-input-select"
					aria-invalid=${this.invalidFlags.Role}
					>
					<option value="-1" ?selected=${this.isNewAssociation}>${this.localize('dialogPlaceholderRole')}</option>
					${this._renderRoleOptions()}
				</select>

				<d2l-button
					slot="footer"
					primary
					@click=${this._submitAssociation}
					>
					${this.localize('dialogAssociationSubmitButton')}
				</d2l-button>
				<d2l-button
					slot="footer"
					@click=${this._close}
					>
					${this.localize('dialogAssociationCancelButton')}
				</d2l-button>
			</d2l-dialog>
		`;
	}

}
customElements.define('d2l-tcc-association-dialog', TccAssociationDialog);
