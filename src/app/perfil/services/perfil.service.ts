import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Perfil } from '../../../modelsdedades/Perfil/perfil';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  bdPerfil = '/perfil/'
  email: any;
  comodi = "PUNT" // com que Firebase no admet el "." en els identificadors de node fem un artifici canviant-lo per la paraula PUNT en majúscules

  constructor(private bd: AngularFireDatabase, private magatzem: AngularFireStorage) { }
  
  getAvatar() {
    var id = this.email = this.email = localStorage.getItem("email")?.toString().replace(".", this.comodi)
    return this.bd.object(this.bdPerfil + id).valueChanges();
  }
}
