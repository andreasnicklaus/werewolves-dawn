import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDialogComponent } from './host-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
  gameServiceTestingProvider,
} from '../../../testing/app-testing.module';

describe('HostDialogComponent', () => {
  let component: HostDialogComponent;
  let fixture: ComponentFixture<HostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [ HostDialogComponent ],
      providers: [
        ...dialogTestingProviders({ name: '' }),
        gameServiceTestingProvider(),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
