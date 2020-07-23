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

const getTccServiceStub = sinon.stub(TccServiceFactory, 'getTccService');

describe('d2l-teacher-course-creation-admin', () => {
	after(() => {
		getTccServiceStub.restore();
	});

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
			getTccServiceStub.returns(new TccTestService());
		});

		afterEach(() => {
			fixtureCleanup();
		});

		it('should not render table if no associations', async() => {
			const el = await fixture(defaultFixture);
			const table = el.shadowRoot.querySelector('table');
			expect(table).to.be.null;
		});

		it('should have all associations in table', async() => {
			const patchedTestService = new TccTestService({
				getAssociations: async() => [
					newRandomAssociation(),
					newRandomAssociation(),
					newRandomAssociation()
				]
			});
			getTccServiceStub.returns(patchedTestService);

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
			const patchedTestService = new TccTestService({
				getAssociations: async() => [testAssociation]
			});
			getTccServiceStub.returns(patchedTestService);

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(1);
			const rowData = rows[0].querySelectorAll('td');
			expect(rowData[0].innerText).to.contain(testAssociation.Department.Name);
			expect(rowData[1].innerText).to.contain(testAssociation.Prefix);
			expect(rowData[2].innerText).to.contain(testAssociation.Suffix);
			expect(rowData[3].innerText).to.contain(testAssociation.Role.Name);
		});
	});

});
