import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherRequest } from './publish-request';

describe('PublishRequest', () => {
  let component: PublisherRequest;
  let fixture: ComponentFixture<PublisherRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
