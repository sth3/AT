import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AT';
  constructor(private http: HttpClient) {}
    
  ngOnInit() {
    
    const headers = new HttpHeaders({
        'Content-Type':'application/json; charset=utf-8',
        'myCustomHeader':'itsolutionstuff.com'
      });
    
    const requestOptions = { headers: headers };
        
    
  }
}
