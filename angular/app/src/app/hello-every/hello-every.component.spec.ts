import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloEveryComponent } from './hello-every.component';

describe('HelloEveryComponent', () => {
  let component: HelloEveryComponent;
  let fixture: ComponentFixture<HelloEveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelloEveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloEveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
