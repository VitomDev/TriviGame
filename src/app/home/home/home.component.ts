import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor (private router:Router) {}

  perfil(){
    this.router.navigate(['/perfil']);
  }
  
  jugar(){
    this.router.navigate(['/juego']);
  }
  
  tutorial(){
    this.router.navigate(['/tutorial']);
  }

}
