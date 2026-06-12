import { Service } from '@angular/core';

import sources from '../../demos-sources';

@Service()
export class NgbdDemoCodeService {
	getDemoSource(fileName?: string): string {
		return fileName ? sources[fileName] || '' : '';
	}
}
