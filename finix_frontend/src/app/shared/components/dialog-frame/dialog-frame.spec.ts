import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFrame } from './dialog-frame';

describe('DialogFrame', () => {
  let component: DialogFrame;
  let fixture: ComponentFixture<DialogFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogFrame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFrame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
