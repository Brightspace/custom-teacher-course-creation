import '../src/components/widget/d2l-teacher-course-creation-error.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { PAGES } from '../src/consts.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-teacher-course-creation-error', () => {

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
			const el = await fixture(html`<d2l-tcc-error></d2l-tcc-error>`);

			el.addEventListener('change-page', (event) => {
				expect(event.detail.page).to.equal(PAGES.INPUT_PAGE);
			});

			el.shadowRoot.querySelector('d2l-button').click();
		});
	});
});
