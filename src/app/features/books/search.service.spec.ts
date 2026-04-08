import { TestBed } from '@angular/core/testing';
import { SearchService } from '../../shared/services/search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SearchService] });
    service = TestBed.inject(SearchService);
  });

  it('should start with no results', () => {
    expect(service.results().length).toBe(0);
  });

  it('should populate results when searching a matching title', () => {
    service.search('Angular');
    expect(service.results().length).toBeGreaterThan(0);
  });

  it('should clear results when the query is empty', () => {
    service.search('');
    expect(service.results().length).toBe(0);
  });
});
