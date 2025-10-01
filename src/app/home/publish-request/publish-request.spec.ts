import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRequest } from './publish-request';

describe('PublishRequest', () => {
  let component: PublishRequest;
  let fixture: ComponentFixture<PublishRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
