import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { Perfil } from '../../../modelsdedades/Perfil/perfil';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{
  llistaFitxers?: FileList; // només n'hi haurà un però treballem genèricament amb una llista
  perfilSeleccionat?: Perfil;
  avatarVell=''
  urlAvatar=''
  usuari=''
  tpc = 0; // percentatge de càrrega al pujar la imatge
  constructor(private serveiperfil: PerfilService) { }
  
  ngOnInit(): void {
    this.getAvatar()

  }
//TODO:CAMBIAR Y ADAPTAR LO NECESSARIO PARA PONER LOS ATRIBUTOS DE PERFIL, TANTO AQUI COMO EN MODELSDEDADES Y EN EL SERVCIO
  getAvatar() {
    this.serveiperfil.getAvatar().subscribe(dades => {
    this.perfilSeleccionat=<Perfil> dades
      if (dades != null) {
      this.urlAvatar=this.perfilSeleccionat.url
      this.usuari=this.perfilSeleccionat.usuari
      this.avatarVell=this.perfilSeleccionat.nomfitxer
      }
    })
  }

}
