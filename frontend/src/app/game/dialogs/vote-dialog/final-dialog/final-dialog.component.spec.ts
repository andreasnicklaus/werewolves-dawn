import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDialogComponent } from './final-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
} from '../../../../../testing/app-testing.module';

describe('FinalDialogComponent', () => {
  let component: FinalDialogComponent;
  let fixture: ComponentFixture<FinalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, FinalDialogComponent],

      providers: [
        ...dialogTestingProviders({
          winnerFriendly: false,
          roleAfterTheRound: {},
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
