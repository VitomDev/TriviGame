import { Component } from '@angular/core';
import { entradaAddUsuari } from '../entradaAddUsuari';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  usuario: entradaAddUsuari | undefined;

  username:string = "";
  correu:string = "";
  contrasenya:string = "";
  contrasenya2:string = "";
  classe:string = "";
  actiu:string = ""; 
  baja: boolean = true;
  dataExpiracio: Date| null = null;
  nomComplet: string = "";
  preguntesDiaries: string = "";
  punts: string = "";
  racha: string = "";
  rol: string = "";
  solicitutBaja: Date | null = null;
  ultimAcces: Date | null = null;


 entrada: entradaAddUsuari = {
  username: '',
  correu: '',
  contrasenya: '',
  classe: '',
  actiu: '',
  avatar: '',
  baja: false, // Inicializado con un valor booleano
  dataExpiracio: undefined, // Inicializado con null para indicar que no hay fecha establecida
  nomComplet: '',
  preguntesDiaries: '',
  punts: '',
  racha: '',
  rol: '',
  solicitutBaja: undefined, // Inicializado con null para indicar que no hay solicitud de baja
  ultimAcces: undefined // Inicializado con null para indicar que no hay último acceso registrado
};

  async crearUsuari(){
    var regexp = new RegExp ('^(?=.*[A-Z]).{8,}$');
    // enviar correo 
    if((regexp.test(this.contrasenya)==true) && (this.contrasenya==this.contrasenya2)){
      actiu:"1";

    }
  }
}
