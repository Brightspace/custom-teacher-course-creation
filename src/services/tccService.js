import { Routes } from './routes';

export class TccService {

	static _getRequest(url) {
		return this._makeRequest(url, this._options('GET'));
	}

	static async _makeRequest(url, options) {
		const response = await fetch(url, options);

		const jsonResponse = await response.json();

		if (response.status >= 300) {
			throw Error(jsonResponse.detail);
		}
		return jsonResponse;
	}

	static _options(method, body, contentType) {

		const options = {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'X-Csrf-Token': this.xsrfToken
			}),
			method,
			mode: 'cors',
		};

		if (body) {
			options.body = body;
		}
		if (contentType) {
			options.headers.append('Content-Type', contentType);
		}

		return options;
	}

	static _postRequest(url, body, contentType) {
		return this._makeRequest(url, this._options('POST', body, contentType));
	}

	static _putRequest(url, body, contentType) {
		return this._makeRequest(url, this._options('PUT', body, contentType));
	}

	static async createCourse(orgUnitId, courseName) {
		const formData = new FormData();
		formData.append('courseName', courseName);
		return await this._postRequest(Routes.CreateCourse(orgUnitId), formData);
	}

	static async getAssociations() {
		return await this._getRequest(Routes.CourseConfig());
	}

	static async getDepartments() {
		const departmentInfo = await this._getRequest(Routes.DepartmentInfo());
		let bookmark = null;
		let departments = [];
		let pageInfo;
		do {
			const body = await this.getPagedDepartments(departmentInfo.Id, bookmark);
			pageInfo = body.PagingInfo;
			departments = departments.concat(body.Items);
			bookmark = pageInfo.Bookmark;
		} while (pageInfo.HasMoreItems);

		return departments;
	}

	static async getPagedDepartments(departmentTypeId, bookmark) {
		return await this._getRequest(Routes.Departments(departmentTypeId, bookmark));
	}

	static async getRoles() {
		return this._getRequest(Routes.Roles());
	}

	static async saveAssociation(orgUnitId, prefix, suffix, roleId) {
		const body = {
			prefix,
			suffix,
			roleId
		};
		return await this._putRequest(Routes.CourseConfig(orgUnitId), JSON.stringify(body), 'application/json');
	}
	static get xsrfToken() {
		return  D2L && D2L.LP && D2L.LP.Web && D2L.LP.Web.Authentication &&
		D2L.LP.Web.Authentication.Xsrf &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken() || '';
	}
}
