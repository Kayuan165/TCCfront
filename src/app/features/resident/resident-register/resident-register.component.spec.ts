import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentRegisterComponent } from './resident-register.component';

describe('ResidentRegisterComponent', () => {
  let component: ResidentRegisterComponent;
  let fixture: ComponentFixture<ResidentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
