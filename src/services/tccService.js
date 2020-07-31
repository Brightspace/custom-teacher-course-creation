import { Routes } from './routes';

export class TccService {

	static _getRequest(url) {
		return this._makeRequest(url, this._options('GET'));
	}

	static async _makeRequest(url, options) {
		const response = await fetch(url, options);

		let errorMsg;
		let jsonResponse;
		const text = await response.text();
		if (response.headers.get('Content-Type').includes('json')) {
			jsonResponse = JSON.parse(text);
			errorMsg = jsonResponse.detail || text;
		} else {
			errorMsg = text;
		}

		if (response.status >= 300) {
			throw Error(errorMsg);
		}
		return jsonResponse;
	}

	static _options(method, body) {

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
			options.headers.append('Content-Type', 'application/json');
			options.body = JSON.stringify(body);
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
		return await this._postRequest(Routes.CreateCourse(orgUnitId), courseName);
	}

	static async deleteAssociation() {
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
		return await this._putRequest(Routes.CourseConfig(orgUnitId), body);
	}
	static get xsrfToken() {
		return  D2L && D2L.LP && D2L.LP.Web && D2L.LP.Web.Authentication &&
		D2L.LP.Web.Authentication.Xsrf &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken() || '';
	}
}
