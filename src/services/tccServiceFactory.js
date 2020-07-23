import { TccDemoService } from './tccDemoService';
import { TccService } from './tccService';

export class TccServiceFactory {
	static getTccService() {
		if (window.demo) {
			return TccDemoService;
		}
		return TccService;
	}
}
