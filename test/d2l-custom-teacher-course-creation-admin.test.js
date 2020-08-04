import '../src/components/d2l-teacher-course-creation-admin.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { newRandomAssociation } from './utilities/associationGenerators';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';
import { TccServiceFactory } from '../src/services/tccServiceFactory';
import { TccTestService } from './utilities/tccTestService';

const defaultFixture = html`
<d2l-tcc-admin></d2l-tcc-admin>
`;

let getTccServiceStub;

describe('d2l-teacher-course-creation-admin', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(defaultFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-tcc-admin');
		});
	});

	describe('serialize associations', () => {
		beforeEach(() => {
			getTccServiceStub = sinon.stub(TccServiceFactory, 'getTccService');
			getTccServiceStub.returns(new TccTestService());
		});

		afterEach(() => {
			getTccServiceStub.restore();
			fixtureCleanup();
		});

		it('should not render table if no associations', async() => {
			const el = await fixture(defaultFixture);
			const table = el.shadowRoot.querySelector('table');
			expect(table).to.be.null;
		});

		it('should have all associations in table', async() => {
			setupTestData({
				associations: [
					newRandomAssociation(),
					newRandomAssociation(),
					newRandomAssociation()
				]
			});

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(3);
		});

		it('binds correct values in table', async() => {
			const testAssociation = {
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
			setupTestData({
				associations: [testAssociation]
			});

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(1);
			const rowData = rows[0].querySelectorAll('td');
			expect(rowData[0].innerText).to.contain(testAssociation.Department.Name);
			expect(rowData[1].innerText).to.contain(testAssociation.Prefix);
			expect(rowData[2].innerText).to.contain(testAssociation.Suffix);
			expect(rowData[3].innerText).to.contain(testAssociation.Role.Name);
		});

		it('should display the loading spinner when loading', async() => {
			setupLongLoad();
			const el = await fixture(defaultFixture);

			const loadingSpinner = el.shadowRoot.querySelector('d2l-loading-spinner');
			expect(loadingSpinner).to.not.be.null;
		});

		it('should display the error screen when a forbidden error is encountered', async() => {
			setupErrorLoad('forbidden');
			const el = await fixture(defaultFixture);

			const errorScreen = el.shadowRoot.querySelector('d2l-tcc-error');
			expect(errorScreen).to.not.be.null;
		});

		it('should display the error screen when a not authorized error is encountered', async() => {
			setupErrorLoad('not authorized');
			const el = await fixture(defaultFixture);

			const errorScreen = el.shadowRoot.querySelector('d2l-tcc-error');
			expect(errorScreen).to.not.be.null;
		});

		it('should not display the error screen when an unexpected error is encountered', async() => {
			setupErrorLoad();
			const el = await fixture(defaultFixture);

			const errorScreen = el.shadowRoot.querySelector('d2l-tcc-error');
			expect(errorScreen).to.be.null;
		});
	});

});

function setupTestData({ associations }) {
	const patches = {};
	if (associations && Array.isArray(associations)) {
		patches['getAssociations'] = async() => associations;
	}
	getTccServiceStub.returns(new TccTestService(patches));
}

function setupLongLoad() {
	const patches =  {
		getAssociations : async() => {
			return new Promise(resolve => setTimeout(resolve, 5000));
		}
	};
	getTccServiceStub.returns(new TccTestService(patches));
}

function setupErrorLoad(errorMessage) {
	const patches =  {
		getAssociations : async() => {
			throw Error(errorMessage);
		}
	};
	getTccServiceStub.returns(new TccTestService(patches));
}
