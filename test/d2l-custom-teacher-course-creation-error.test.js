import '../src/components/widget/d2l-teacher-course-creation-error.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { PAGES } from '../src/constants.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-teacher-course-creation-error', () => {
	const pageData = {
		courseName: 'Test Course Name',
		courseType: 'Test Course Type',
		ErrorMessage: 'Houston we have a problem'
	};

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-tcc-error></d2l-tcc-error>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-error');
		});
	});

	describe('button actions', () => {
		afterEach(() => {
			fixtureCleanup();
		});

		it('button triggers change-page event', async() => {
			const el = await fixture(html`<d2l-tcc-error .pageData="${pageData}"></d2l-tcc-error>`);

			el.addEventListener('change-page', (event) => {
				expect(event.detail.page).to.equal(42);
				expect(event.detail.pageData.courseName).to.equal(pageData.courseName);
				expect(event.detail.pageData.courseType).to.equal(pageData.courseType);
			});

			el.shadowRoot.querySelector('d2l-button').click();
		});
	});

	describe('error message binding', () => {
		afterEach(() => {
			fixtureCleanup();
		});

		it('error message appears', async() => {
			const el = await fixture(html`<d2l-tcc-error .pageData="${pageData}"></d2l-tcc-error>`);

			expect(el.shadowRoot.querySelector('.tcc-error__description-container').innerText).to.equal(pageData.ErrorMessage);
		});
	});
});
