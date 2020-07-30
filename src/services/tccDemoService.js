function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class TccDemoService {
	static async createCourse() {
		await sleep(2000);

		return await fetch('../../data/course.json').then(response => response.json());
	}

	static async getAssociations() {
		await sleep(2000);

		return await fetch('../../data/associations.json').then(response => response.json());
	}

	static async getConfiguredDepartments() {
		await sleep(500);

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
