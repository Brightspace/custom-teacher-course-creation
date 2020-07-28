import '../src/components/widget/d2l-teacher-course-creation-welcome.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { PAGES } from '../src/consts.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-teacher-course-creation-welcome', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-tcc-welcome></d2l-tcc-welcome>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-welcome');
		});
	});

	describe('button actions', () => {
		function changePageToInput(event) {
			expect(event.detail.page).to.equal(PAGES.INPUT_PAGE);
		}

		afterEach(() => {
			fixtureCleanup();
		});

		it('button triggers change-page event', async() => {
			const el = await fixture(html`<d2l-tcc-welcome></d2l-tcc-welcome>`);
			el.addEventListener('change-page', changePageToInput);

			el.shadowRoot.querySelector('.tcc-welcome-button-get-started').click();
		});
	});

});
