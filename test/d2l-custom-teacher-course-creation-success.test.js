import '../src/components/widget/d2l-teacher-course-creation-success.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { PAGES } from '../src/consts.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-teacher-course-creation-success', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-tcc-success></d2l-tcc-success>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-success');
		});
	});

	describe('button actions', () => {
		function changePageToWelcome(event) {
			expect(event.detail.page).to.equal(PAGES.WELCOME_PAGE);
		}

		afterEach(() => {
			fixtureCleanup();
		});

		it('button triggers change-page event', async() => {
			const el = await fixture(html`<d2l-tcc-success></d2l-tcc-success>`);

			el.addEventListener('change-page', changePageToWelcome);

			el.shadowRoot.querySelector('d2l-button').click();
		});
	});

	describe('link actions', () => {
		function changePageToInput(event) {
			expect(event.detail.page).to.equal(PAGES.INPUT_PAGE);
		}

		afterEach(() => {
			fixtureCleanup();
		});

		it('Link triggers change-page event', async() => {
			console.log(window.location.href);
			const el = await fixture(html`<d2l-tcc-success></d2l-tcc-success>`);

			el.addEventListener('change-page', changePageToInput);

			el.shadowRoot.querySelector('.tcc-success__another-course-link').click();
		});
	});

	describe('href functions', () => {
		it('course homepage href', async() => {
			const el = await fixture(html`<d2l-tcc-success></d2l-tcc-success>`);

			expect(el._getCourseHomepageHref('6609')).to.equal('/d2l/home/6609');
		});

		it('course enrollement href', async() => {
			const el = await fixture(html`<d2l-tcc-success></d2l-tcc-success>`);

			expect(el._getCourseEnrollHref('6609')).to.equal('/d2l/lms/classlist/classlist.d2l?ou=6609');
		});
	});

});
