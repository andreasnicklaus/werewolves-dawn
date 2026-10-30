import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourTurnDialogComponent } from './your-turn-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
  messageServiceTestingProvider,
} from '../../../../testing/app-testing.module';

describe('YourTurnDialogComponent', () => {
  let component: YourTurnDialogComponent;
  let fixture: ComponentFixture<YourTurnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, YourTurnDialogComponent],

      providers: [
        ...dialogTestingProviders({
          role: { name: 'Villager', order: '-', description: '' },
          game: { playerList: [], numberofMiddleRoles: 0 },
        }),
        gameServiceTestingProvider(),
        messageServiceTestingProvider(),
      ],
    }).compileComponents();
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
