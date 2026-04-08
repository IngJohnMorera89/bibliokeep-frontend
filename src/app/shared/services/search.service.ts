import { Injectable } from '@angular/core';
import { results, search } from '../../shared/stores/search.store';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly results = results;

  search(query: string) {
    search(query);
  }
}
