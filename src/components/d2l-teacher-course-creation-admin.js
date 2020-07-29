import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
import './dialog/association-dialog';
import { css, html, LitElement } from 'lit-element/lit-element';
import { BaseMixin } from '../mixins/base-mixin';
import d2lTableStyles from '../styles/d2lTableStyles';
import { TccServiceFactory } from '../services/tccServiceFactory';

class TeacherCourseCreationAdmin extends BaseMixin(LitElement) {

	static get properties() {
		return {
			associations: {
				type: Array
			},
			roles: {
				type: Array
			},
			departments: {
				type: Array
			},
			tccService: {
				type: Object
			}
		};
	}

	static get styles() {
		const tccAdminStyles = css`
			:host {
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.add_new_button {
				padding: 6px 0px;
			}
		`;
		return [
			d2lTableStyles,
			tccAdminStyles,
		];
	}

	constructor() {
		super();

		this.associations = Array();
		this.roles = Array();
		this.departments = Array();

		this.tccService = TccServiceFactory.getTccService();
	}

	async connectedCallback() {
		super.connectedCallback();

		this.roles = await this.tccService.getRoles();
		this.departments = await this.tccService.getDepartments();
		this._fetchAssociations();

		this.associationDialog = this.shadowRoot.querySelector('#association-dialog');
	}

	async _fetchAssociations() {
		this.tccService
			.getAssociations()
			.then(associationsArray => {
				let i = 0;
				if (associationsArray) {
					associationsArray.map(association => association.RowId = i++);
					this.associations = associationsArray;
				} else {
					this.associations = Array();
				}
			});
	}

	_handleAssociationDelete(event) {
		const associationRowId = parseInt(event.target.getAttribute('data-association-row'));
		this.dialogAssociation =
			this.associations.find(association => association.RowId === associationRowId);
	}

	_handleAssociationEdit(event) {
		const associationRowId = parseInt(event.target.getAttribute('data-association-row'));
		const dialogAssociation =
			this.associations.find(association => association.RowId === associationRowId);

		this.associationDialog.open(dialogAssociation);
	}

	_handleAssociationNew() {
		this.associationDialog.open();
	}

	_renderActionChevron(associationRowId) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon icon="tier1:arrow-collapse" class="d2l-dropdown-opener"></d2l-button-icon>
				<d2l-dropdown-menu>
					<d2l-menu>
						<d2l-menu-item
							data-association-row="${ associationRowId }"
							text="${this.localize('actionEdit')}"
							@click="${this._handleAssociationEdit}">
						</d2l-menu-item>
						<d2l-menu-item
							data-association-row="${ associationRowId }"
							text="${this.localize('actionDelete')}"
							@click="${this._handleAssociationDelete}">
						</d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

	_renderAssociationRow(association) {
		return html`
			<tr>
				<td>
					${ association.Department.Name }
					${ this._renderActionChevron(association.RowId) }
				</td>
				<td>${ association.Prefix }</td>
				<td>${ association.Suffix }</td>
				<td>${ association.Role.Name }</td>
			</tr>
		`;
	}

	_renderTable() {
		return html`
			<table class="association-table">
				<thead>
					<th>${ this.localize('courseType') }</th>
					<th>${ this.localize('prefix') }</th>
					<th>${ this.localize('suffix') }</th>
					<th>${ this.localize('role') }</th>
				</thead>
				<tbody>
					${ this.associations.map(association => this._renderAssociationRow(association)) }
				</tbody>
			</table>
		`;
	}

	_renderDialogs() {
		return html`
			<d2l-tcc-association-dialog
				id="association-dialog"
				.roles=${this.roles}
				.departments=${this.departments}
				@association-dialog-save=${this._fetchAssociations}>
			</d2l-tcc-association-dialog>
		`;
	}

	render() {
		return html`
			<d2l-button-subtle
				class="add_new_button"
				icon="tier1:plus-large"
				text="${this.localize('actionNew')}"
				@click=${this._handleAssociationNew}>
			</d2l-button-subtle>
			${this.associations.length > 0 ? this._renderTable() : html``}
			${this._renderDialogs()}
		`;
	}
}
customElements.define('d2l-tcc-admin', TeacherCourseCreationAdmin);
