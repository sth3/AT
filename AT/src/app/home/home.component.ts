import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Card } from './card.model';
import { NotifierService } from '../notifier.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards: Card[] = [];
  cardsForHandset: Card[] = [];
  cardsForWeb: Card[] = [];
  
  isHandset: boolean = false;
  isHandsetObserver: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return true;
      }
      return false;
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, 
    public appService: AppService,
    private notifierService:NotifierService ) {}

  ngOnInit(){
    this.isHandsetObserver.subscribe(currentObserverValue => {
      this.isHandset = currentObserverValue;
      console.log(currentObserverValue);
      this.loadCards();
    });
    
    this.appService.getDeals().subscribe(response => {
      this.cardsForHandset = response.handsetCards;      
      this.cardsForWeb = response.webCards; 
      this.notifierService.showNotification('Loaded successfully','OK','success');   
      this.loadCards();
    });      
  }

  loadCards(){
    this.cards = this.isHandset? this.cardsForHandset : this.cardsForWeb;    
    console.log(this.cards);    
  }

  getImage(imageName: string): string {
    return 'url(' + 'http://localhost:3001/images/' + imageName + '.png' + ')'
  }
}

  


