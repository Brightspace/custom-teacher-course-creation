import { Routes } from './routes';

export class TccService {
	static _getRequest(url) {
		return fetch(url, this._options('GET')).then(r => r.json());
	}
	static _options(method) {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
			}),
			method,
			mode: 'cors'
		};
	}
	static async createCourse() {
	}
	static async getAssociations() {
		return await this._getRequest(Routes.CourseConfig());
	}
	static async getDepartments() {
		const departmentInfo = await this._getRequest(Routes.DepartmentInfo());
		let bookmark = null;
		let departments = [];
		do {
			const body = await this.getPagedDepartments(departmentInfo.Id, bookmark);
			const pageInfo = body.PagingInfo;
			departments = departments.concat(body.Items);
			bookmark = pageInfo.Bookmark;
			if (!pageInfo.HasMoreItems) {
				break;
			}
		} while (bookmark);

		return departments;
	}
	static async getPagedDepartments(departmentTypeId, bookmark) {
		return await this._getRequest(Routes.Departments(departmentTypeId, bookmark));
	}
	static async getRoles() {
		return this._getRequest(Routes.Roles());
	}

}
