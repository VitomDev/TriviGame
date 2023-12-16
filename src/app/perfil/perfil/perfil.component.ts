import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { modificarPerfil } from 'src/modelsdedades/Perfil/modificarperfil';
import { Router } from '@angular/router';
import { usuarios } from 'src/modelsdedades/Perfil/usuario';
import { getDatabase, ref, child, get, set, remove } from "firebase/database";

@Component({
selector: 'app-perfil',
templateUrl: './perfil.component.html',
styleUrls: ['./perfil.component.css'],
})

export class PerfilComponent implements OnInit {
urlAvatar: string = '';
usuari: usuarios | undefined
username: string ='';
contrasenya: string ='';
contrasenyaActual: string = '';
repeatedPassword: string ='';

vUsernames: modificarPerfil[] = [];
usernameExistent: boolean = false
bdPerfil = '/Usuaris/'

popUp = false;
failed = false;
title = '';
buttonValue = 'cancelar';
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

//TODO: MIRAR LO DE EL CAMBIO DE CONTRASEÑA Y LO DE SI ESTA VACIO EL USERNAME
async editProfile() {
  const userId = this.usuari?.username || 'adminPrueba';
  const contrasenyaAlmacenada = this.usuari?.contrasenya;
  var regexp = new RegExp('^(?=.*[A-Z]).{8,}$') //Verificar contrasenya conté mínim 8 caracters amb una majuscula

  if ((this.contrasenyaActual === contrasenyaAlmacenada) ) {
    try {
      if (this.username && this.username.trim() !== '') {
        const usernames = await this.getUsernames();
        this.usernameExistent = usernames.includes(this.username);

        if (!this.usernameExistent) {
          if (this.contrasenya && this.contrasenya.trim() !== '' && (this.contrasenya === this.repeatedPassword) && (regexp.test(this.contrasenya) == true)) 
          {
            await this.changeUsername(userId, this.username); 
            await this.serveiPerfil.modificarPerfilContrasenya(this.contrasenya, userId); 
          } else if(this.contrasenya.trim() == ''){ // corregir condicio
            await this.changeUsername(userId, this.username);
          }else if(this.contrasenya && this.contrasenya.trim() !== '' && (this.repeatedPassword && this.repeatedPassword.trim() == '')){
            this.verificarPerfil("1.Falta confirmar la nova contrasenya.");
          } else if (this.contrasenya && this.contrasenya.trim() !== '' && (regexp.test(this.contrasenya) == false)) {
            this.verificarPerfil("2.La nova contrasenya no es vàlida.");//TODO: estos mensajes no son correctos
          }
          this.router.navigateByUrl('/perfil');
        } else{
          console.log("3.El nombre de usuario ya está en uso.");
          this.verificarPerfil("4.El nombre de usuario ya está en uso.");
        }
      } else if (this.contrasenya && this.contrasenya.trim() !== '' && (this.contrasenya === this.repeatedPassword) && (regexp.test(this.contrasenya) == true)){
        
        await this.serveiPerfil.modificarPerfilContrasenya(this.contrasenya, userId);
        this.router.navigateByUrl('/perfil');
      } else if(this.contrasenya && this.contrasenya.trim() == ''){
        this.verificarPerfil("5.No hi ha dades a modificar");
      } else if (regexp.test(this.contrasenya) == false) {
        this.verificarPerfil("6.La nova contrasenya no es vàlida.");      //TODO: AQUI SI PONES UNA CONTRASEÑA NO VALIDA TE DEBE INDICAR PRIMERO QUE NO CUMPLE LOS REQUISITOS
      } else if (this.contrasenya !== this.repeatedPassword) {          //En teoria ahora primero mira si la nueva es valida y luego ya mira si coincide con la confirmacion
        this.verificarPerfil("7.Contrasenya nova i confirmació contrasenya no coincideixen");
      }
    } catch (error) {
      console.error("Hubo un error al modificar el perfil:", error);
      this.verificarPerfil("Hubo un error al modificar el perfil.");
    }
  } else {
    console.log("La contraseña actual no es correcta. peta aquiiiii");//TODO:PETA AQUI MIRAR LO DEL POPUP AQUI
    this.verificarPerfil("8.La contrasenya actual no es correcta.");
  }
}


// sin username y sin novacontrasenya salta el 6

getUsernames(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'Usuaris')).then((snapshot) => {
      if (snapshot.exists()) {
        const usernames: string[] = [];
        snapshot.forEach((childSnapshot) => {
          usernames.push(childSnapshot.key);
        });
        resolve(usernames); 
      } else {
        resolve([]); 
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

verificarPerfil(msg:string) {
  this.failed = true; 
  this.popUp = true; 
  this.buttonValue = 'Ok';
  this.title = msg;
}

ferDeleteProfile() {
  this.failed = false;
  this.popUp = true;
  this.buttonValue = 'Cancelar';
  this.title = 'Segur que vols donarte de baixa?';
}

closePopUp(){
  this.popUp = false;
  this.title = '';
}


//TODO:AQUI PONER LO DE MIN CARACTERES
changeUsername(oldUsername: string, newUsername: string) {
  const db = getDatabase();
  const oldRef = ref(db, this.bdPerfil + oldUsername);
  const newRef = ref(db, this.bdPerfil + newUsername);
  if (newUsername.length>=3) {
  // Obtener los datos del antiguo nodo
  get(oldRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Cambiar el username dentro de los datos del usuario
      userData.username = newUsername;
      // Escribir los datos en el nuevo nodo, incluyendo el nuevo username
      set(newRef, userData).then(() => {
        // Eliminar el antiguo nodo
        remove(oldRef).then(() => {
          console.log(`Username changed from ${oldUsername} to ${newUsername}`);    
          // Actualizar la información en localStorage si es necesario
          this.usuari!.username = newUsername;
          localStorage.setItem('datosUsuario', JSON.stringify(this.usuari));
          // Actualizar la información en la variable de instancia y redirigir si es necesario
          window.location.reload(); 
          }).catch((error) => {
            console.error("Error removing old username:", error);
          });
        }).catch((error) => {
          console.error("Error setting new username:", error);
        });
      } else {
        console.log(`The old username ${oldUsername} does not exist.`);
      }
    }).catch((error) => {
      console.error("Error getting old username data:", error);
    });
  }
}

// TODO: poner solicitudBaja, esta mal escrito (solicitudBaja)
unsubscribe() {
  const userId = this.usuari?.username || 'adminPrueba'; 

  this.serveiPerfil.donarseDeBaixa(userId).then(() => {
    this.failed = false;
    this.popUp = true; // esto se pilla del servicio
    this.buttonValue = 'Cancelar';
    this.title = 'Segur que vols eliminar el perfil?';
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