import '../src/components/widget/d2l-teacher-course-creation-input.js';
import { DEFAULT_SELECT_OPTION_VALUE, PAGES } from '../src/constants';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';
import { TccServiceFactory } from '../src/services/tccServiceFactory';
import { TccTestService } from './utilities/tccTestService';

const TEST_DEPARTMENT_NAME = 'Another Department';
const configuredDepartments = [
	{
		OrgId: '6606',
		Department: {
			OrgUnitId: '10000',
			Name: 'IPSIS Test Department 1'
		},
		Role: {
			RoleId: 595,
			Name: 'Student'
		},
		Prefix: 'prefix',
		Suffix: '001',
		TemplateId: null
	},
	{
		OrgId: '6606',
		Department: {
			OrgUnitId: '12',
			Name: TEST_DEPARTMENT_NAME
		},
		Role: {
			RoleId: 596,
			Name: 'Instructor'
		},
		Prefix: 'prefix2',
		Suffix: '2020',
		TemplateId: null
	}
];

describe('d2l-teacher-course-creation-input', () => {
	afterEach(() => {
		fixtureCleanup();
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const pageData = {
				configuredDepartments: configuredDepartments
			};

			const el = await fixture(html`<d2l-tcc-input .pageData="${pageData}"></d2l-tcc-input>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-input');
		});
	});

	describe('data binding', () => {
		let getTccServiceStub;
		beforeEach(() => {
			getTccServiceStub = sinon.stub(TccServiceFactory, 'getTccService');
			_setupServiceStub(getTccServiceStub);
		});

		afterEach(() => {
			getTccServiceStub.restore();
		});

		it('should bind the properties when properties are given', async() => {
			const pageData = {
				courseName: 'Test Course Name',
				departmentId: '12',
				configuredDepartments: configuredDepartments
			};

			const el = await fixture(html`<d2l-tcc-input .pageData="${pageData}"></d2l-tcc-input>`);

			expect(el.shadowRoot.querySelector('#course-name-input').value).to.equal(pageData.courseName);
			const typeSelectElement = el.shadowRoot.querySelector('#course-type-select');
			expect(typeSelectElement.options[typeSelectElement.selectedIndex].value).to.equal(pageData.departmentId);
			expect(typeSelectElement.options[typeSelectElement.selectedIndex].text).to.equal(TEST_DEPARTMENT_NAME);
		});

		it('should use the defaults when properties are not given', async() => {

			const el = await fixture(html`<d2l-tcc-input></d2l-tcc-input>`);

			expect(el.shadowRoot.querySelector('#course-name-input').value).to.equal('');
			const typeSelectElement = el.shadowRoot.querySelector('#course-type-select');
			expect(typeSelectElement.options[typeSelectElement.selectedIndex].value).to.equal(DEFAULT_SELECT_OPTION_VALUE);
		});
	});

	describe('button actions', () => {
		let getTccServiceStub;
		beforeEach(() => {
			getTccServiceStub = sinon.stub(TccServiceFactory, 'getTccService');
			_setupServiceStub(getTccServiceStub);
		});

		afterEach(() => {
			getTccServiceStub.restore();
		});

		it('back button triggers change-page event', async() => {
			const el = await fixture(html`<d2l-tcc-input></d2l-tcc-input>`);

			el.addEventListener('change-page', (event) => {
				expect(event.detail.page).to.equal(PAGES.WELCOME_PAGE);
			});

			el.shadowRoot.querySelector('#tcc-input-back-button').click();

		});

		it('next button disabled and tooltip showing with long name', async() => {

			const pageData = {
				courseName: 'This is longer than 128 This is longer than 128 This is longer than 128 This is longer than 128 This is longer than 128 This is longer than 128 ',
				departmentId: '12'
			};

			const el = await fixture(html`<d2l-tcc-input .pageData="${pageData}"></d2l-tcc-input>`);

			const inputName = el.shadowRoot.querySelector('#course-name-input');
			expect(inputName.value).to.equal(pageData.courseName);
			expect(inputName.getAttribute('aria-invalid')).to.equal('true');

			expect(el.shadowRoot.querySelector('#tcc-input-next-button').disabled).to.be.true;
		});

		it('next button disabled with no input or type', async() => {

			const el = await fixture(html`<d2l-tcc-input></d2l-tcc-input>`);
			expect(el.shadowRoot.querySelector('#tcc-input-next-button').disabled).to.be.true;
		});

		it('next button triggers change-page event', async() => {

			const pageData = {
				courseName: 'Test Course Name',
				departmentId: '12'
			};

			const el = await fixture(html`<d2l-tcc-input .pageData="${pageData}"></d2l-tcc-input>`);

			el.addEventListener('change-page', (event) => {
				expect(event.detail.page).to.equal(PAGES.CONFIRM_PAGE);
				expect(event.detail.pageData).to.not.be.null;
				expect(event.detail.pageData.courseName).to.equal(pageData.courseName);
				expect(event.detail.pageData.departmentName).to.equal(TEST_DEPARTMENT_NAME);
				expect(event.detail.pageData.departmentId).to.equal('12');
			});

			el.shadowRoot.querySelector('#tcc-input-next-button').click();
		});

	});

	const _setupServiceStub = (stub) => {
		const patches = { getAssociations: async() => configuredDepartments };
		stub.returns(new TccTestService(patches));
	};
});
