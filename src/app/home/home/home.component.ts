import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { usuarios } from '../modelDades/usuarios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  //EL CONSTRUCTOR PETA I NO PUC AGAFAR TOTA L'INFORMACIÓ DELS USUARIS 
  constructor(public home: HomeService) { }

  getUsuari(){
    this.home.getUsuari().subscribe((dades) => {
      localStorage.setItem('dadesUsuari', JSON.stringify(dades));
    });
  }

}

