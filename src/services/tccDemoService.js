export class TccDemoService {
	static async createCourse() {
		return await fetch('../../data/course.json').then(response => response.json());
	}

	static async getAssociations() {
		return await fetch('../../data/associations.json').then(response => response.json());
	}

	static async getConfiguredDepartments() {
		return await fetch('../../data/configuredDepartments.json').then(response => response.json());
	}

	static async getDepartments() {
		return await fetch('../../data/departments.json').then(response => response.json());
	}

	static async getRoles() {
		return await fetch('../../data/roles.json').then(response => response.json());
	}

	static async saveAssociation() {
	}
}
