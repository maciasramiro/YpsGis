import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerbiReportComponent } from './powerbi-report.component';

describe('PowerbiReportComponent', () => {
  let component: PowerbiReportComponent;
  let fixture: ComponentFixture<PowerbiReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerbiReportComponent]
    });
    fixture = TestBed.createComponent(PowerbiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
