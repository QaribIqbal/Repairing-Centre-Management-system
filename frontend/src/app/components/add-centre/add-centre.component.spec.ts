import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCentreComponent } from './add-centre.component';

describe('AddCentreComponent', () => {
  let component: AddCentreComponent;
  let fixture: ComponentFixture<AddCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
