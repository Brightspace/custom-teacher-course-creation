export class TccDemoService {
	static async getAssociations() {
		return await fetch('../../data/associations.json').then(response => response.json());
	}

	static async getCourseTypes() {
		return await fetch('../../data/course_types.json').then(response => response.json());
	}

	static async getRoles() {
		return await fetch('../../data/roles.json').then(response => response.json());
	}
}
