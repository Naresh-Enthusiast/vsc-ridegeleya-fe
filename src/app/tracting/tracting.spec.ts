import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tracting } from './tracting';

describe('Tracting', () => {
  let component: Tracting;
  let fixture: ComponentFixture<Tracting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tracting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tracting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
