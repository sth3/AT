import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
// import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { UserModel, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  user: BehaviorSubject<UserModel | null>;

  isDarkTheme: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isAdmin = false;

  constructor(private breakpointObserver: BreakpointObserver,
              // public loaderService: LoaderService,
              private authService: AuthService) {
    this.user = this.authService.user$;
    this.user.subscribe(user => {
      this.isAdmin = user?.role === UserRole.ADMIN;
    });
  }


  ngOnInit() {
    this.isDarkTheme = localStorage.getItem('theme') === "Dark" ? true : false;
  }

  storeThemeSelection() {
    localStorage.setItem('theme', this.isDarkTheme ? "Dark" : "Light")
  }

  login() {
    this.authService.promptLogin('Login');
  }

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('logged out');
    });
  }
}
