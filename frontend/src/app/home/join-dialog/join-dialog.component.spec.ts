import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDialogComponent } from './join-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
} from '../../../testing/app-testing.module';

describe('JoinDialogComponent', () => {
  let component: JoinDialogComponent;
  let fixture: ComponentFixture<JoinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, JoinDialogComponent],

      providers: [
        ...dialogTestingProviders({ name: '', roomCode: '' }),
        gameServiceTestingProvider(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
