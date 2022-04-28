import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourTurnDialogComponent } from './your-turn-dialog.component';

describe('YourTurnDialogComponent', () => {
  let component: YourTurnDialogComponent;
  let fixture: ComponentFixture<YourTurnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourTurnDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourTurnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
