import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPropertyComponent } from './search-property.component';

describe('SearchPropertyComponent', () => {
  let component: SearchPropertyComponent;
  let fixture: ComponentFixture<SearchPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
