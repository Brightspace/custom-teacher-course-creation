import '@brightspace-ui/core/components/button/button-icon';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
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
		`;
		return [
			d2lTableStyles,
			tccAdminStyles
		];
	}

	constructor() {
		super();

		this.associations = [];
		this.roles = [];
		this.departments = [];

		this.tccService = TccServiceFactory.getTccService();
	}

	async connectedCallback() {
		super.connectedCallback();

		this.roles = await this.tccService.getRoles();
		this.departments = await this.tccService.getDepartments();
		this._fetchAssociations();
	}

	async _fetchAssociations() {
		this.tccService
			.getAssociations()
			.then(associationsArray => {
				let i = 0;
				associationsArray.map(association => association.RowId = i++);
				this.associations = associationsArray;
			});
	}

	_handleAssociationEdit(event) {
		//TODO: open an edit dialog
		console.log(event);
	}

	_handleAssociationDelete(event) {
		//TODO: open a delete dialog
		console.log(event);
	}

	_renderActionChevron(associationRowId) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon text="${this.localize('options')}" icon="tier1:arrow-collapse" class="d2l-dropdown-opener"></d2l-button-icon>
				<d2l-dropdown-menu>
					<d2l-menu>
						<d2l-menu-item
							data-association-id="${ associationRowId }"
							text="${this.localize('actionEdit')}"
							@click="${this._handleAssociationEdit}">
						</d2l-menu-item>
						<d2l-menu-item
							data-association-id="${ associationRowId }"
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
					<th>${ this.localize('columnCourseType') }</th>
					<th>${ this.localize('columnPrefix') }</th>
					<th>${ this.localize('columnSuffix') }</th>
					<th>${ this.localize('columnRole') }</th>
				</thead>
				<tbody>
					${ this.associations.map(association => this._renderAssociationRow(association)) }
				</tbody>
			</table>
		`;
	}

	render() {
		return html`
			${ this.associations.length > 0 ? this._renderTable() : html`` }
		`;
	}
}
customElements.define('d2l-tcc-admin', TeacherCourseCreationAdmin);
