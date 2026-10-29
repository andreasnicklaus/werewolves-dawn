import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSettingsDialogComponent } from './game-settings-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
} from '../../../../testing/app-testing.module';

describe('GameSettingsDialogComponent', () => {
  let component: GameSettingsDialogComponent;
  let fixture: ComponentFixture<GameSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [ GameSettingsDialogComponent ],
      providers: [
        ...dialogTestingProviders({ roles: [], selectedRoles: [] }),
        gameServiceTestingProvider(),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
