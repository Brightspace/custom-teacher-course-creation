import { departmentsPage1, departmentsPageLast } from '../data/departmentsPaged';
import { expect } from '@open-wc/testing';
import {ouType} from '../data/outype';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';
import { TccService } from '../../src/services/tccService';

describe('Teacher Course Creation Service', () => {
	describe('GetDepartments', () => {
		beforeEach(() => {
			const stub = sinon.stub(window, 'fetch');
			stub.withArgs('/d2l/api/lp/1.23/outypes/department')
				.callsFake(() => mockResponse(ouType));
			stub.withArgs('/d2l/api/lp/1.23/orgstructure/?OrgUnitType=203&Bookmark=null')
				.callsFake(() => mockResponse(departmentsPage1));
			stub.withArgs('/d2l/api/lp/1.23/orgstructure/?OrgUnitType=203&Bookmark=120123')
				.callsFake(() => mockResponse(departmentsPageLast));
		});

		afterEach(() => {
			window.fetch.restore();  //remove stub
		});

		it('should get all pages', async() => {
			const departments = await TccService.getDepartments();
			expect(departments).to.have.lengthOf(2);
		});

		function mockResponse(body = {}) {
			const mockResponse = new window.Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-type': 'application/json' }
			});
			return Promise.resolve(mockResponse);
		}
	});
});
