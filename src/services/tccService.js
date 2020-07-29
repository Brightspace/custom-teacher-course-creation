import { Routes } from './routes';

const XSRF_TOKEN = D2L.LP.Web.Authentication.Xsrf.GetXsrfToken();

export class TccService {
	static _getRequest(url) {
		return fetch(url, this._options('GET')).then(r => r.json());
	}

	static _options(method, body, contentType) {

		const options = {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'X-Csrf-Token': XSRF_TOKEN
			}),
			method,
			mode: 'cors',
		};

		if (body && contentType) {
			options.headers.append('Content-Type', contentType);
			options.body = body;
		}

		return options;
	}

	static _postRequest(url, body) {
		return fetch(url, this._options('POST', body)).then(r => r.json());
	}

	static _putRequest(url, body) {
		return fetch(url, this._options('PUT', body)).then(r => r.json());
	}

	static async createCourse(orgUnitId, courseName) {
		const formData = new FormData();
		formData.append('courseName', courseName);
		return await this._postRequest(Routes.CreateCourse(orgUnitId), formData, 'application/x-www-form-urlencoded');
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
		return await this._putRequest(Routes.CourseConfig(orgUnitId), body, 'application/json');
	}
}
