import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  AppTestingModule,
  messageServiceTestingProvider,
} from '../testing/app-testing.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, AppComponent],

      providers: [messageServiceTestingProvider()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Werewolves - Dawn');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#pageTitle')?.textContent).toContain(
      'Werewolves - Dawn',
    );
  });
});
