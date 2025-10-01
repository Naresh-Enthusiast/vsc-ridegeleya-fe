import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublisherRequests } from './publisher-requests';


describe('PublisherRequests', () => {
  let component: PublisherRequests;
  let fixture: ComponentFixture<PublisherRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
