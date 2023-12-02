import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil/services/perfil.service';
import { usuarios } from 'src/modelsdedades/Perfil/usuario';

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.css']
})
export class MenuNavComponent implements OnInit{
  urlAvatar: string = '';
  usuari: usuarios | undefined

  constructor(private serveiPerfil: PerfilService) {}
  ngOnInit(): void {
    this.getUsuari();
    this.usuari= JSON.parse(localStorage.getItem('datosUsuario')!);
    //console.log(this.usuari);
    this.urlAvatar=this.usuari!.avatar!
  }

  getUsuari() {
    this.serveiPerfil.getUsuari().subscribe((dades) => {
      console.log(dades);
      if (dades != null) {
        localStorage.setItem('datosUsuario',JSON.stringify(dades))
      }
    });
  }
}
