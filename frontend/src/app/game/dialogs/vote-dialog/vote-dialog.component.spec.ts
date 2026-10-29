import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteDialogComponent } from './vote-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
} from '../../../../testing/app-testing.module';

describe('VoteDialogComponent', () => {
  let component: VoteDialogComponent;
  let fixture: ComponentFixture<VoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [ VoteDialogComponent ],
      providers: [
        ...dialogTestingProviders({ game: { playerList: [] } }),
        gameServiceTestingProvider(),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
