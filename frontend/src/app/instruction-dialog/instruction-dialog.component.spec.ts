import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionDialogComponent } from './instruction-dialog.component';
import {
  AppTestingModule,
  dialogTestingProviders,
} from '../../testing/app-testing.module';

describe('InstructionDialogComponent', () => {
  let component: InstructionDialogComponent;
  let fixture: ComponentFixture<InstructionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [InstructionDialogComponent],
      providers: [dialogTestingProviders({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
