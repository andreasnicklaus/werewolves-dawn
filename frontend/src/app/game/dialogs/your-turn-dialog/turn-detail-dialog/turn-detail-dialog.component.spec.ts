import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnDetailDialogComponent } from './turn-detail-dialog.component';

describe('TurnDetailDialogComponent', () => {
  let component: TurnDetailDialogComponent;
  let fixture: ComponentFixture<TurnDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
