import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil/services/perfil.service';
import { usuarios } from 'src/modelsdedades/Perfil/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.css']
})
export class MenuNavComponent implements OnInit{

  username: string = '';
  urlAvatar: string = '';
  usuari: usuarios | undefined

  constructor(private serveiPerfil: PerfilService,private router: Router) {}
  ngOnInit(): void {
    this.getUsuari();
    this.usuari= JSON.parse(localStorage.getItem('datosUsuario')!);
    //console.log(this.usuari);
    this.urlAvatar=this.usuari!.avatar!
    this.username = this.usuari?.username || 'Sabemos que eres hacker vete de aqui';
  }

  getUsuari() {
    this.serveiPerfil.getUsuari().subscribe((dades) => {
      console.log(dades);
      if (dades != null) {
        localStorage.setItem('datosUsuario',JSON.stringify(dades))
      }
    });
  }
  //TODO:COMPROBAR QUE LA REDIRECCION SEA LA CORRECTA
  navigateToAddQuestion() {
    this.router.navigateByUrl('/add-pregunta');   
  }

}
