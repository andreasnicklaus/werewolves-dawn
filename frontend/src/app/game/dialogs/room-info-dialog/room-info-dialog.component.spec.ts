import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomInfoDialogComponent } from './room-info-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  messageServiceTestingProvider,
} from '../../../../testing/app-testing.module';

describe('RoomInfoDialogComponent', () => {
  let component: RoomInfoDialogComponent;
  let fixture: ComponentFixture<RoomInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, RoomInfoDialogComponent],

      providers: [
        ...dialogTestingProviders({ roomCode: '' }),
        messageServiceTestingProvider(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
