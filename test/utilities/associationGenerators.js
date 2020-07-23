const defaultAssociation = {
	OrgId: '6606',
	Prefix: 'BANANA1',
	Suffix: 'MEATSAUCE',
	Department: {
		OrgUnitId: '2',
		Name: 'Another Department'
	},
	Role: {
		Id: 2,
		Name: 'Administrator'
	}
};

export function defaultAssociationWith({ OrgId, Prefix, Suffix, Department, Role }) {
	const newAssociation = {...defaultAssociation};
	if (OrgId) newAssociation.OrgId = OrgId;
	if (Prefix) newAssociation.Prefix = Prefix;
	if (Suffix) newAssociation.Suffix = Suffix;
	if (Department) newAssociation.Department = Department;
	if (Role) newAssociation.Role = Role;
	return newAssociation;
}

export function newRandomAssociation() {
	const randomNumber = () => Math.random();
	const randomNumberString = () => Math.random().toString();
	const randomASCIIString = () => Math.random().toString(36);

	const newAssociation = {};
	newAssociation.OrgId = randomNumberString();
	newAssociation.Prefix = randomASCIIString();
	newAssociation.Suffix = randomASCIIString();
	newAssociation.Department = {
		OrgUnitId: randomNumberString(),
		Name: randomASCIIString()
	};
	newAssociation.Role = {
		Id: randomNumber(),
		Name: randomASCIIString()
	};

	return newAssociation;
}
