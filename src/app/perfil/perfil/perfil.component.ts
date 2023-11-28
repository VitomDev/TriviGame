import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { Avatar } from '../../../modelsdedades/Perfil/perfil';
import { modificarPerfil } from 'src/modelsdedades/modificarperfil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{
  llistaFitxers?: FileList; // només n'hi haurà un però treballem genèricament amb una llista
  avatarSeleccionat?: Avatar;
  avatarVell=''
  urlAvatar=''
  usuari=''
  tpc = 0; // percentatge de càrrega al pujar la imatge


  entrada: modificarPerfil = {usuari: '', passwd:'' };


  constructor(private serveiPerfil: PerfilService, private router: Router) { }
  
  ngOnInit(): void {
    this.getAvatar()

  }
  
  triarFitxer(event: any): void {
    this.llistaFitxers = event.target.files;
  }

//TODO:CAMBIAR Y ADAPTAR LO NECESSARIO PARA PONER LOS ATRIBUTOS DE PERFIL, TANTO AQUI COMO EN MODELSDEDADES Y EN EL SERVCIO
  getAvatar() {
    this.serveiPerfil.getAvatar().subscribe(dades => {
    this.avatarSeleccionat=<Avatar> dades
      if (dades != null) {
      this.urlAvatar=this.avatarSeleccionat.url
      this.usuari=this.avatarSeleccionat.usuari
      this.avatarVell=this.avatarSeleccionat.nomfitxer
      }
    })
  }

  pujarFitxer(): void {
    if (this.llistaFitxers) {
    const imatge: File | null = this.llistaFitxers.item(0); // agafem el primer (únic)
    this.llistaFitxers = undefined;
    if (imatge) {
    this.avatarSeleccionat = new Avatar(imatge); // fem una instància de la classeAvatar utilizant el constructor al que li passem el fitxer a pujar
    // primer eliminem l'avatar antic si existia
    this.serveiPerfil.eliminarFitxer(this.avatarSeleccionat!, this.avatarVell)
    // inserim el nou avatar
    this.serveiPerfil.pushFitxer(this.avatarSeleccionat).subscribe(percentatge => {
    this.tpc = Math.round(percentatge ? percentatge : 0);
    this.getAvatar()
    },
    error => {
    console.log(error);
    }
    );
    }
    }
  }

  modificarPerfil() {
    
    this.serveiPerfil.modificarPerfil(this.entrada);
    this.router.navigateByUrl('/perfil');
  }

}
