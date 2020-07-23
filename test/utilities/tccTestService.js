export class TccTestService {
	constructor(patches) {
		this.getAssociations = async() => [];

		this.getDepartments = async() => [];

		this.getRoles = async() => [];

		if (patches) {
			for (const [functionName, patch] of Object.entries(patches)) {
				this[functionName] = patch;
			}
		}
	}
}
