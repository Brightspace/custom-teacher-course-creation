import '../src/components/d2l-teacher-course-creation.js';
import { expect, fixture, html } from '@open-wc/testing';
import { PAGES } from '../src/consts.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-teacher-course-creation', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-tcc></d2l-tcc>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc');
		});
	});

	describe('switches pages', () => {
		it('listens to change-page event', async() => {
			const el = await fixture(html`<d2l-tcc></d2l-tcc>`);

			el.shadowRoot.querySelector('d2l-tcc-welcome').changePage(PAGES.INPUT_PAGE);

			expect(el.currentPage).to.equal(PAGES.INPUT_PAGE);
		});

		it('page changes on currentPage change', async() => {
			const el = await fixture(html`<d2l-tcc></d2l-tcc>`);

			let welcomePage = el.shadowRoot.querySelector('d2l-tcc-welcome');
			let inputPage = el.shadowRoot.querySelector('d2l-tcc-input');

			expect(welcomePage).to.be.accessible();
			expect(inputPage).to.not.be.accessible();

			el._changePage({
				detail: {page: PAGES.INPUT_PAGE},
				bubbles: true,
				composed: true
			});

			welcomePage = el.shadowRoot.querySelector('d2l-tcc-welcome');
			inputPage = el.shadowRoot.querySelector('d2l-tcc-input');

			expect(welcomePage).to.not.be.accessible();
			expect(inputPage).to.be.accessible();
		});
	});

});
