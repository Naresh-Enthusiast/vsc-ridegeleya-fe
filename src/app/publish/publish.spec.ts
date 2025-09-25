import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishComponent } from './publish';

describe('Publish', () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
