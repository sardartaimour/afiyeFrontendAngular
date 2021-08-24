import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModalMapComponent } from './shared-modal-map.component';

describe('SharedModalMapComponent', () => {
  let component: SharedModalMapComponent;
  let fixture: ComponentFixture<SharedModalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedModalMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedModalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
