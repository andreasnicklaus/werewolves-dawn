import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDialogComponent } from './host-dialog.component';

describe('HostDialogComponent', () => {
  let component: HostDialogComponent;
  let fixture: ComponentFixture<HostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostDialogComponent ]
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
