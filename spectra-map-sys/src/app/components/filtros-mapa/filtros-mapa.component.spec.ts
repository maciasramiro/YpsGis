import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosMapaComponent } from './filtros-mapa.component';

describe('FiltrosMapaComponent', () => {
  let component: FiltrosMapaComponent;
  let fixture: ComponentFixture<FiltrosMapaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosMapaComponent]
    });
    fixture = TestBed.createComponent(FiltrosMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
