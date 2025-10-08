import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTiempoComponent } from './gestion-tiempo.component';

describe('GestionTiempoComponent', () => {
  let component: GestionTiempoComponent;
  let fixture: ComponentFixture<GestionTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTiempoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
