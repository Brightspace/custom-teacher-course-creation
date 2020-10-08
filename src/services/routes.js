export class Routes {
	static CourseConfig() {
		return '/d2l/api/customization/tcc/1.0/departmentCourseConfig/?sortResults=true';
	}
	static CreateCourse(orgUnitId) {
		return `/d2l/api/customization/tcc/1.0/courseCreation/${orgUnitId}`;
	}
	static DepartmentInfo() {
		return '/d2l/api/lp/1.23/outypes/department';
	}
	static Departments(orgUnitType, bookmark) {
		return `/d2l/api/lp/1.23/orgstructure/?OrgUnitType=${orgUnitType}&Bookmark=${bookmark}`;
	}
	static OrgUnitCourseConfig(orgUnitId) {
		return `/d2l/api/customization/tcc/1.0/departmentCourseConfig/${orgUnitId}`;
	}
	static Roles() {
		return '/d2l/api/lp/1.23/roles/';
	}
}
