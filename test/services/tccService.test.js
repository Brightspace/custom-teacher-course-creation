import { expect } from '@open-wc/testing';
import sinon from '../../node_modules/sinon/pkg/sinon-esm.js';
import { TccService } from '../../src/services/tccService';

describe('Teacher Course Creation Service', () => {
	describe('GetDepartments', () => {
		beforeEach(() => {
			const s = sinon.stub(window, 'fetch');
			s.withArgs('/d2l/api/lp/1.23/outypes/department')
				.callsFake(ouTypesResponse);
			s.withArgs('/d2l/api/lp/1.23/orgstructure/?OrgUnitType=203&Bookmark=null')
				.callsFake(departmentsPage1);
			s.withArgs('/d2l/api/lp/1.23/orgstructure/?OrgUnitType=203&Bookmark=120123')
				.callsFake(departmentsPageLast);
		});

		afterEach(() => {
			window.fetch.restore();  //remove stub
		});

		function ouTypesResponse() {
			return mockResponse({'Id':203, 'Code':'Department', 'Name':'Department', 'Description':'', 'SortOrder':2, 'Permissions':{'CanEdit':true, 'CanDelete':true}}
			);
		}
		function departmentsPage1() {
			return mockResponse({
				'PagingInfo': {
					'Bookmark':'120123',
					'HasMoreItems':true
				},
				'Items':[
					{
						'Identifier':'6607',
						'Path':null,
						'Name':'Department 1',
						'Code':'D1',
						'Type':{
							'Id':203,
							'Code':'Department',
							'Name':'Department'
						}
					}
				]
			}
			);
		}
		function departmentsPageLast() {
			return mockResponse({
				'PagingInfo': {
					'Bookmark':'120123',
					'HasMoreItems': false
				},
				'Items':[
					{
						'Identifier':'6607',
						'Path':null,
						'Name':'Department 1',
						'Code':'D1',
						'Type':{
							'Id':203,
							'Code':'Department',
							'Name':'Department'
						}
					}
				]
			}
			);
		}
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
