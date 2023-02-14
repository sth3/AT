import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { UserModel, UserRole } from '../../models/user.model';

import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  user: BehaviorSubject<UserModel | null>;
  suportLanguages = ['sk', 'en'];
  isDarkTheme: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  isAdmin = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public translateService: TranslateService,
    private authService: AuthService
  ) {
    this.user = this.authService.user$;
    this.user.subscribe((user) => {
      this.isAdmin = user?.role === UserRole.ADMIN;
    });

    this.translateService.addLangs(this.suportLanguages);
    this.translateService.setDefaultLang('sk');
    const browserLang:any = this.translateService.getBrowserLang();
    if( (browserLang !== 'sk') && ( browserLang !== 'en') ){
      this.translateService.setDefaultLang('sk');
    }
    this.translateService.use(browserLang); 
    this.getDutchPaginatorIntl();
  }

  ngOnInit() {
    this.isDarkTheme = localStorage.getItem('theme') === 'Dark' ? true : false;
  }

  switchLang = (browserLang: string) => {
    this.translateService.use(browserLang)
  }

  storeThemeSelection() {
    localStorage.setItem('theme', this.isDarkTheme ? 'Dark' : 'Light');
  }

  login() {
    this.authService.promptLogin('Login');
  }

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('logged out');
    });
  }

   getDutchPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();
    
    paginatorIntl.itemsPerPageLabel = 'Items per pagina:';
    paginatorIntl.nextPageLabel = 'Volgende pagina';
    paginatorIntl.previousPageLabel = 'Vorige pagina';   
    
    return paginatorIntl;
  }
}
