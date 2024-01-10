import { Injectable } from '@angular/core'; 
import { AngularFireDatabase } from '@angular/fire/compat/database'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; 


@Injectable({
  providedIn: 'root'
})
export class ServeiAutenticarService {
  loginOK = false;
  usuari: any;
  psw = '';
  bdLog = '/log/';
  bdgeneres = '/generes/';
  bdUsuaris = '/usuaris';


  email = '';
  constructor(
    public auth: AngularFireAuth,
    private bd: AngularFireDatabase,
    private router: Router
  ) { }

  logout() {
    this.sHaDesconectat();
    console.log('Hem tancat la sessió');
    this.auth.signOut();
    this.usuari = null;
    this.loginOK = false;
  }

  login() {
    // signInWithEmailAndPassword() és una Promise que permetrà utilitzar .then i .catch
    this.auth
      .signInWithEmailAndPassword(this.email, this.psw)
      .then((user) => {
        console.log('Usuari: ', user);
        this.usuari = user;
        this.usuari.email = this.email; // AÑADIR Y QUITAR O COMENTAR LA DE ABAJO
        this.usuari.uid='hacer una función para crear un identificador y que no se repita'
        //this.email='';
        this.psw = '';
        this.loginOK = true;
        this.sHaConnectat();
        this.nouUsuari();
      })
      .catch((error) => {
        console.log("Error al fer login amb l'email login");
      });
  }

  sHaDesconectat() {
    const dades = {
      op: 'logout',
      usuari: this.usuari.email, // QUITAR USER, TIENE QUE QUEDAR COMO ESTÁ AHORA
      data: Date(),
    };
    localStorage.removeItem("email")
    this.bd
      .object(this.bdLog + Date().toString())
      .update(dades) // update equival a insert si no existeix l'element
      .then((d) => { console.log('Dades inserides correctament'); })
      .catch((error) => { console.log('Error accedint al Log');
      });
  }

  sHaConnectat() {
    const dades = {
      op: 'login',
      usuari: this.usuari.email, // QUITAR USER, TIENE QUE QUEDAR COMO ESTÁ AHORA
      data: Date(),
    };
    localStorage.setItem("email",this.usuari.email);
    this.bd
      .object(this.bdLog + Date().toString())
      .update(dades) // update equival a insert si no existeix l'element
      .then((d) => {
        console.log('Dades inserides correctament');
      })
      .catch((error) => {
        console.log('Error accedint al Log');
      });
  }

  nouUsuari() {
    const dadesUsuari = {
    email: this.usuari.email,
    nom: '',
    imatge: ''
    }
    this.bd.object(this.bdUsuaris+'/'+this.usuari.uid).update(dadesUsuari)
    .then( d => {
    console.log("Usuari inserit correctament");
    })
    .catch( error => { console.log("Error accedint als Usuaris") })
    }

}
 