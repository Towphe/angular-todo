import { TestBed } from '@angular/core/testing';

import { TodoHandlerService } from './todo-handler.service';

describe('TodoHandlerService', () => {
  let service: TodoHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
