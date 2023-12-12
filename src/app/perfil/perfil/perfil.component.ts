import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { modificarPerfil } from 'src/modelsdedades/Perfil/modificarperfil';
import { Router } from '@angular/router';
import { usuarios } from 'src/modelsdedades/Perfil/usuario';
@Component({
selector: 'app-perfil',
templateUrl: './perfil.component.html',
styleUrls: ['./perfil.component.css'],
})

export class PerfilComponent implements OnInit {
urlAvatar: string = '';
usuari: usuarios | undefined
entrada: modificarPerfil = { username: '', contrasenya: '' };

constructor(private serveiPerfil: PerfilService, private router: Router) {}

ngOnInit(): void {
  this.getUsuari();
  this.usuari = JSON.parse(localStorage.getItem('datosUsuario')!);
  //console.log(this.usuari);
  this.urlAvatar = this.usuari!.avatar!
}

getUsuari() {
  this.serveiPerfil.getUsuari().subscribe((dades) => {
    //console.log(dades);
    if (dades != null) {
      localStorage.setItem('datosUsuario',JSON.stringify(dades))
    }
  });
}

onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

onDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer && event.dataTransfer.files) {
    const file = event.dataTransfer.files[0]; 
    if (file) {
      this.readAndUploadImage(file);
    }
  }
}

readAndUploadImage(file: File) {
  const userId = this.usuari?.username || 'adminPrueba';  
  const reader = new FileReader();

  reader.onload = () => {
    const base64Image = reader.result as string;
    console.log('Imagen en base64:', base64Image);

    this.serveiPerfil.uploadAvatarBase64(base64Image, userId).subscribe(
      percentage => {
        console.log(`Carga en progreso: ${percentage}%`);
      },
      error => {
        console.error('Error al subir la imagen:', error);
      },
      () => {
        console.log('Carga de imagen completada');
        window.location.reload(); 
      }
    );
  };
  reader.readAsDataURL(file); 
}

editProfile() {
  const userId = this.usuari?.username || 'adminPrueba';  
  this.serveiPerfil.modificarPerfil(this.entrada, userId);
  this.router.navigateByUrl('/perfil');
}

// TODO: poner solicituBaja, esta mal escrito (solicitudBaja)
unsubscribe() {
  const userId = this.usuari?.username || 'adminPrueba'; 

  this.serveiPerfil.donarseDeBaixa(userId).then(() => {
    console.log('Peticion de baja procesada correctamente.');
    this.logout(); 
  }).catch(error => {
    console.error('Error al procesar la baja del usuario:', error);
  });
}

logout() {
  localStorage.removeItem('datosUsuario'); 
  this.router.navigateByUrl('/login'); 
} 

  /**
   * MyMethod
   * * Important information is highlighted
   * ! Deprecated method, do not use
   * ? Should this method be exposed in the public API?
   * TODO: refactor this method so that it conforms to the API
   * @param myParam The parameter for this method
   */
    // This is highlighted
    //? This is a query
        // Commented out code can also be styled
    //// this line of code is commented out
    // TODO: Create some test cases

}