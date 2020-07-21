import { TccDemoService } from './tccDemoService';
import { TccService } from './tccService';

export function getTccService() {
	if (window.demo) {
		return TccDemoService;
	}
	return TccService;
}
