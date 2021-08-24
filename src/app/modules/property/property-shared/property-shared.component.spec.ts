import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySharedComponent } from './property-shared.component';

describe('PropertySharedComponent', () => {
  let component: PropertySharedComponent;
  let fixture: ComponentFixture<PropertySharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
