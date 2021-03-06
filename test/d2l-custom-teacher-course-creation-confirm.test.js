import '../src/components/widget/d2l-teacher-course-creation-confirm.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { PAGES } from '../src/constants.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';
import { TccServiceFactory } from '../src/services/tccServiceFactory';
import { TccTestService } from './utilities/tccTestService';

describe('d2l-teacher-course-creation-confirm', () => {
	afterEach(() => {
		fixtureCleanup();
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-tcc-confirm></d2l-tcc-confirm>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-confirm');
		});
	});

	describe('data binding', () => {
		it('should bind the properties', async() => {
			const pageData = {
				courseName: 'Test Course Name',
				departmentName: 'Test Course Type'
			};

			const el = await fixture(html`<d2l-tcc-confirm .pageData="${pageData}"></d2l-tcc-confirm>`);
			expect(el.shadowRoot.querySelector('#courseName').innerText).to.equal(pageData.courseName);
			expect(el.shadowRoot.querySelector('#courseType').innerText).to.equal(pageData.departmentName);
		});
	});

	describe('button actions', () => {
		let getTccServiceStub;
		beforeEach(() => {
			getTccServiceStub = sinon.stub(TccServiceFactory, 'getTccService');
		});

		afterEach(() => {
			getTccServiceStub.restore();
		});

		it('finish button triggers change-page event', async() => {
			const courseOrgUnitId = 6609;
			const patches = { createCourse: async() => courseOrgUnitId};
			getTccServiceStub.returns(new TccTestService(patches));

			const pageData = {
				courseName: 'Test Course Name',
				departmentName: 'Test Course Type'
			};

			const el = await fixture(html`<d2l-tcc-confirm .pageData="${pageData}"></d2l-tcc-confirm>`);

			let triggers = 0;

			el.addEventListener('change-page', (event) => {
				expect(triggers).to.be.lessThan(2);

				if (triggers === 0) {
					expect(event.detail.page).to.equal(PAGES.LOADING_PAGE);
					expect(event.detail.pageData).to.be.undefined;
				} else if (triggers === 1) {
					expect(event.detail.page).to.equal(PAGES.SUCCESS_PAGE);
					expect(event.detail.pageData).to.not.be.null;
					expect(event.detail.pageData.courseName).to.equal(pageData.courseName);
					expect(event.detail.pageData.departmentName).to.equal(pageData.departmentName);
					expect(event.detail.pageData.courseOrgUnitId).to.equal(courseOrgUnitId);
				}

				triggers += 1;
			});

			el.shadowRoot.querySelector('.tcc-confirm__finish-button').click();
		});

		it('finish button with error triggers change-page event', async() => {
			const errorMessage = 'Houston we have a problem';
			const patches = { createCourse: async() => {throw new Error(errorMessage);}};
			getTccServiceStub.returns(new TccTestService(patches));

			const pageData = {
				courseName: 'Test Course Name',
				departmentName: 'Test Course Type'
			};

			const el = await fixture(html`<d2l-tcc-confirm .pageData="${pageData}"></d2l-tcc-confirm>`);

			let triggers = 0;

			el.addEventListener('change-page', (event) => {
				expect(triggers).to.be.lessThan(2);

				if (triggers === 0) {
					expect(event.detail.page).to.equal(PAGES.LOADING_PAGE);
					expect(event.detail.pageData).to.be.undefined;
				} else if (triggers === 1) {
					expect(event.detail.page).to.equal(PAGES.ERROR_PAGE);
					expect(event.detail.pageData).to.not.be.null;
					expect(event.detail.pageData.courseName).to.equal(pageData.courseName);
					expect(event.detail.pageData.departmentName).to.equal(pageData.departmentName);
					expect(event.detail.pageData.ErrorMessage).to.equal(errorMessage);
				}

				triggers += 1;
			});

			el.shadowRoot.querySelector('.tcc-confirm__finish-button').click();
		});

		it('back button triggers change-page event', async() => {
			const pageData = {
				courseName: 'Test Course Name',
				departmentName: 'Test Course Type'
			};

			const el = await fixture(html`<d2l-tcc-confirm .pageData="${pageData}"></d2l-tcc-confirm>`);

			el.addEventListener('change-page', (event) => {
				expect(event.detail.page).to.equal(PAGES.INPUT_PAGE);
				expect(event.detail.pageData).to.not.be.null;
				expect(event.detail.pageData.courseName).to.equal(pageData.courseName);
				expect(event.detail.pageData.departmentName).to.equal(pageData.departmentName);
			});

			el.shadowRoot.querySelector('.tcc-confirm__back-button').click();
		});
	});

});
