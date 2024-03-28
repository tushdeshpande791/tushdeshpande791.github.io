import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumesmachartComponent } from './volumesmachart.component';

describe('VolumesmachartComponent', () => {
  let component: VolumesmachartComponent;
  let fixture: ComponentFixture<VolumesmachartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumesmachartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolumesmachartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
