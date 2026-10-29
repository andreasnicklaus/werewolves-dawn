import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import {
  AppTestingModule,
  gameServiceTestingProvider,
} from '../../testing/app-testing.module';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [ GameComponent ],
      providers: [gameServiceTestingProvider()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
