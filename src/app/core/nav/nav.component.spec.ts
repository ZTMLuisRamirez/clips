import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      authState$: of(true),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: mockedAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));

    expect(logoutLink).withContext('Not logged in').toBeTruthy();

    logoutLink.triggerEventHandler('click');

    const service = TestBed.inject(AuthService);

    expect(service.logout)
      .withContext('Could not click logout link')
      .toHaveBeenCalledTimes(1);
  });
});
