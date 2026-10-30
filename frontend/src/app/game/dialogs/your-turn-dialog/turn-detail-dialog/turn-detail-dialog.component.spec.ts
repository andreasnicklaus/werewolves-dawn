import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnDetailDialogComponent } from './turn-detail-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
} from '../../../../../testing/app-testing.module';

describe('TurnDetailDialogComponent', () => {
  let component: TurnDetailDialogComponent;
  let fixture: ComponentFixture<TurnDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, TurnDetailDialogComponent],

      providers: [...dialogTestingProviders({}), gameServiceTestingProvider()],
    }).compileComponents();
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
