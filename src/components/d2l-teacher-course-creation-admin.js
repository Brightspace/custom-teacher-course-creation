/* eslint-disable lit/no-useless-template-literals */
import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import './create-course-admin-nothing-here-illustration';
import './dialog/delete-dialog';
import './dialog/association-dialog';
import './widget/d2l-teacher-course-creation-error';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
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
			},
			isLoading: {
				type: Boolean
			},
			permissionError: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const tccAdminStyles = css`
			:host {
				width: 100%;
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.tcc-admin__add-new-button {
				padding: 6px 0px;
			}

			.tcc-admin__spinner {
				display: flex;
				margin: 48px;
			}

			.tcc-admin__description-text {
				margin-bottom: 0px;
			}

			.tcc-admin__message--empty-table {
				text-align: center;
			}

			.d2l-heading-2.tcc-admin__nothing-title {
				margin-top: 0;
				margin-bottom: 18px;
			}

			.tcc-admin__empty-table-wrapper {
				display: flex;
				flex-direction: column;
			}

			.tcc-admin__get-started-button {
				margin: 12px;
				align-self: center;
			}
		`;
		return [
			d2lTableStyles,
			tccAdminStyles,
			bodyStandardStyles,
			heading2Styles
		];
	}

	constructor() {
		super();

		this.associations = Array();
		this.roles = Array();
		this.departments = Array();

		this.tccService = TccServiceFactory.getTccService();

		this.isLoading = true;
		this.permissionError = false;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.isLoading = true;

		const getRolesPromise = this.tccService.getRoles();
		const getDepartmentsPromise = this.tccService.getDepartments();
		const getAssociationsPromise = this.tccService.getAssociations();

		try {
			const [roles, departments, associations] = await Promise.all([getRolesPromise, getDepartmentsPromise, getAssociationsPromise]);
			this.roles = roles;
			this.departments = departments;
			this._mapAssociationsArray(associations);

		} catch (err) {
			this.permissionError = err.message.toLowerCase().includes('forbidden') || err.message.toLowerCase().includes('not authorized');
		}
		this.isLoading = false;

		this.associationDialog = this.shadowRoot.querySelector('#association-dialog');
		this.deleteDialog = this.shadowRoot.querySelector('#delete-dialog');
	}

	_mapAssociationsArray(associationsArray) {
		let i = 0;
		if (associationsArray) {
			associationsArray.map(association => association.RowId = i++);
			this.associations = associationsArray;
		} else {
			this.associations = Array();
		}
	}

	async _refreshAssociations() {
		this.isLoading = true;
		this.tccService
			.getAssociations()
			.then(associationsArray => {
				this._mapAssociationsArray(associationsArray);
				this.isLoading = false;
			});
	}

	async _deleteAssociation() {
		if (this.dialogAssociation) {
			await this.tccService.deleteAssociation(this.dialogAssociation.Department.OrgUnitId);
			this.dialogAssociation = null;
			this._refreshAssociations();
		}
	}

	_getAssociationByRowId(associationRowId) {
		return this.associations.find(association => association.RowId === associationRowId);
	}

	_handleAssociationDelete(event) {
		this.dialogAssociation = this._getAssociationByRowId(parseInt(event.target.getAttribute('data-association-row')));

		this.deleteDialog.open();
	}

	_handleAssociationEdit(event) {
		const dialogAssociation = this._getAssociationByRowId(parseInt(event.target.getAttribute('data-association-row')));

		this.associationDialog.open(dialogAssociation);
	}

	_handleAssociationNew() {
		this.associationDialog.open();
	}

	_renderActionChevron(associationRowId) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon icon="tier2:chevron-down" class="d2l-dropdown-opener"></d2l-button-icon>
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

	_renderEmptyTable() {
		return html`
			<div class="tcc-admin__message--empty-table">
				<tcc-admin-nothing-here-illustration>
				</tcc-admin-nothing-here-illustration>
				<h1 class="d2l-heading-2 tcc-admin__nothing-title">
					${this.localize('adminNothingTitle')}
				</h1>
				<div class="d2l-body-standard">
					${this.localize('adminNothingMessage')}
				</div>
			</div>
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
				@association-dialog-save=${this._refreshAssociations}>
			</d2l-tcc-association-dialog>

			<d2l-tcc-delete-dialog
				id="delete-dialog"
				@delete-confirmed=${this._deleteAssociation}>
			</d2l-tcc-delete-dialog>
		`;
	}

	_renderResults() {
		const isEmpty = this.associations.length === 0;

		const baseTemplate = html`
			<div class="tcc-admin__description-text d2l-body-standard">
				${this.localize('adminDesc')}
			</div>
		`;

		if (this.permissionError) {
			return html`
				<d2l-tcc-error
				.errorMessage="${this.localize('adminPermissionsError')}"
				.renderBack="${false}">
				</d2l-tcc-error>`;
		} else if (isEmpty) {
			return html`
				<div class='tcc-admin__empty-table-wrapper'>
					${baseTemplate}
					${this._renderEmptyTable()}
					<d2l-button
						primary
						class="tcc-admin__get-started-button"
						@click=${this._handleAssociationNew}>
							${this.localize('actionStart')}
					</d2l-button>
				</div>
			`;
		} else {
			return html`
				${baseTemplate}
				<d2l-button-subtle
					class="tcc-admin__add-new-button"
					icon="tier1:plus-large-thick"
					text="${this.localize('actionNew')}"
					@click=${this._handleAssociationNew}>
				</d2l-button-subtle>
				${this._renderTable()}
			`;
		}
	}

	_renderSpinner() {
		return html`
			<d2l-loading-spinner
				class="tcc-admin__spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	render() {
		return html`
			${this.isLoading ? this._renderSpinner() : this._renderResults()}
			${this._renderDialogs()}
		`;
	}
}
customElements.define('d2l-tcc-admin', TeacherCourseCreationAdmin);
