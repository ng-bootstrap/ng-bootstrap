import { Injectable } from '@angular/core';

import sources from '../../demos-sources';

@Injectable({
	providedIn: 'root',
})
export class NgbdDemoCodeService {
	getDemoSource(fileName: string): string {
		return sources[fileName] || '';
	}
}
