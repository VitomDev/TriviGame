// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-juego',
//   templateUrl: './juego.component.html',
//   styleUrls: ['./juego.component.css'],
// })
// export class JuegoComponent {
// torn:boolean = true;
//   numP:number = 1;
//   porcentajeAnimacion: number = this.numP * 10;
//   // porcentajeAnimacion: number = 100;

//   activarAnimacion: boolean = true;

//   toggleAnimacion() {
//     this.activarAnimacion = !this.activarAnimacion;
//   }

//   nextQuestion() {
//     this.torn = !this.torn;
//     // this.numP++;
//   }

//   respondida() {
//     this.torn = !this.torn;
//     this.numP++;
//     this.porcentajeAnimacion = this.numP * 10;
//     this.toggleAnimacion();
//   }

//   redHome(){

//   }
// }

import { Component } from '@angular/core';
import { preguntas } from '../modelDades/preguntas';
import { JuegoService } from '../services/juego.service';
import { usuarios } from '../modelDades/usuarios';
import { Router } from '@angular/router';
// import { main } from '../../../main';
// import { Injectable } from '@angular/core';

import { ods } from '../modelDades/ods';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css'],
})

export class JuegoComponent {
  vPreguntes: preguntas[] = [];
  pregunta: preguntas | undefined;
  respuestasOrdenadas: (string | undefined)[] = [];
  randomIndex: number = 0;
  respuestaCorrecta?: string;
  torn: boolean = true;

  numP: number = 1;

  url: string = 'https://linktr.ee/vitomdev';
  imgurl: string =
    'https://ugc.production.linktr.ee/c7b14ca5-4802-4311-9fca-68ac4f03a599_DALL-E-2023-10-23-15.36.20---complete-the-head-and-add-some-more-code.png?io=true&size=avatar-v1_0';
  colorBack: string = 'white';

  numPistes: number = 2;
  dificultad?: string;

  puntos: number = 100;

  buttonNQ: boolean = true;

  isDisabled: boolean = false;

  // Son los puntos que tiene el usuario guardo en la bbdd
  puntosUsuario: number = 0;

  // Es la racha que tiene el usuario en la bbdd
  racha: number = 0;
  qttPreguntesContestades: number = 0;

  usuariInfo: usuarios | undefined;
  aPulsado: boolean = false;
  btnSiguiente: any;

  puntosLocalStorage: any;
  qttAcertadasLocalStorage: any;
  mejorRachaLocalStorage: any;
  qttPiestasUsadas: number = 0;

  porcentajeAnimacion: number = 0;

  correcto: boolean = false;
  incorrectaPulsada: string | undefined;
  // constructor(public juego: JuegoService, public main: main) {
  // this.getOds();
  // }
  constructor(public juego: JuegoService, private router: Router) {}

  redirigir() {
    // Utiliza el método navigate del servicio Router para redirigir a otra ruta
    this.router.navigate(['/final']);
  }

  ngOnInit(): void {
    // Consige todas las preguntas de la base de datos
    this.getPreguntes();

    // this.setBk();
    // console.log(this.imgurl);
    // console.log(this.url);

    // Guarda la informacion del usuario en el local storage
    this.getUsuario();

    // this.getOds();

    // this.main.setBk(this.pregunta?.idODS);

    this.btnSiguiente = document.getElementById('nextQJaResposta');
    // this.puntosLocalStorage = document.getElementById('');

    // Los puntos no se reinician nunca y se van acumulando. 
    //Solo tiene que asignar a 0 el puntoslocalstorage cuando entras al juego

    this.puntosLocalStorage = localStorage.getItem('puntosLocalStorage');



    this.qttAcertadasLocalStorage = localStorage.getItem(
      'qttAcertadasLocalStorage'
    );
    this.mejorRachaLocalStorage = localStorage.getItem(
      'mejorRachaLocalStorage'
    );

    if (this.puntosLocalStorage == null) {
      this.puntosLocalStorage = 0;
    }
    this.puntosLocalStorage = parseInt(this.puntosLocalStorage);

    if (this.qttAcertadasLocalStorage == null) {
      this.qttAcertadasLocalStorage = 0;
    }

    this.qttAcertadasLocalStorage = parseInt(this.qttAcertadasLocalStorage);

    if (this.mejorRachaLocalStorage == null) {
      this.mejorRachaLocalStorage = 0;
    }

    this.mejorRachaLocalStorage = parseInt(this.mejorRachaLocalStorage);

    this.habilitarSiguiente();

    this.usuariInfo = JSON.parse(localStorage.getItem('datosUsuario')!);
    // console.log(this.usuariInfo);

    this.puntosUsuario = this.usuariInfo!.punts!;
    this.racha = this.usuariInfo!.racha!;
    this.qttPreguntesContestades = this.usuariInfo!.preguntesDiaries!;

    this.comprovarPreguntesContestades();

    var base64Image = this.usuariInfo?.avatar!;

    base64Image = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    //console.log(base64Image);

    const binaryData = atob(base64Image);

    const imageSize = binaryData.length;

    this.porcentajeAnimacion = this.qttPreguntesContestades * 10;

    console.log(`El tamaño de la imagen es ${imageSize} bytes.`);
    console.log(`El tamaño de la imagen es ${imageSize / (1024 * 1024)} MB.`);
  }

  getUsuario() {
    this.juego.getUsuari2('adminPrueba').subscribe((dades) => {
      localStorage.setItem('datosUsuario', JSON.stringify(dades));
    });
  }

  nextQuestion() {
    this.torn = !this.torn;
  }

  getPreguntes() {
    this.vPreguntes = [];
    this.juego.getPreguntes().subscribe((dades) => {
      dades.forEach((linia) => {
        this.vPreguntes.push(<preguntas>linia);
      });

      // Genera un numero aleatorio para seleccionar una pregunta aleatoria
      this.randomIndex = Math.floor(Math.random() * this.vPreguntes.length);

      // Selecciona una pregunta aleatoria y la guardo en pregunta
      // Pregunta sera la pregunta que se tendra que resolver
      this.pregunta = this.vPreguntes[this.randomIndex];
      this.getOds();

      // Guardo la resposta correcta en la posicion 0 y las respostas incorrectas en las demas
      this.respuestasOrdenadas[0] =
        this.vPreguntes[this.randomIndex].respostaCorrecta;
      this.respuestasOrdenadas[1] =
        this.vPreguntes[this.randomIndex].respostaIncorrecta1;
      this.respuestasOrdenadas[2] =
        this.vPreguntes[this.randomIndex].respostaIncorrecta2;
      this.respuestasOrdenadas[3] =
        this.vPreguntes[this.randomIndex].respostaIncorrecta3;

      this.respuestaCorrecta = this.respuestasOrdenadas[0];
      this.dificultad = this.vPreguntes[this.randomIndex].idDificultat;

      // Desordena las respuestas aleatoriamente
      this.desordenarRespuestas();

      /*console.log(this.vPreguntes)
          console.log("La pregunta aleatoria es la numero " + this.randomIndex);
          console.log("Las preguntas desordenadas son: " + this.respuestasOrdenadas);*/
    });
  }
  desordenarRespuestas() {
    for (let i = this.respuestasOrdenadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.respuestasOrdenadas[i], this.respuestasOrdenadas[j]] = [
        this.respuestasOrdenadas[j],
        this.respuestasOrdenadas[i],
      ];
    }
  }

  asignarPuntsDificultad() {
    switch (this.dificultad) {
      case 'Facil':
        this.puntos = this.puntos + 10;
        break;
      case 'Mitjana':
        this.puntos = this.puntos + 20;
        break;
      case 'Dificil':
        this.puntos = this.puntos + 30;
        break;
    }
  }

  asignarPuntsPista() {
    switch (this.numPistes) {
      case 1:
        this.puntos = this.puntos - 10;
        break;
      case 0:
        this.puntos = this.puntos - 20;
        break;
    }
  }

  click(r: string | undefined) {
    if (r != 'vacio') {
      if (r == this.respuestaCorrecta) {
        this.aPulsado = true;
        this.correcto = true;

        this.asignarPuntsDificultad();

        // Si el numero de pistas a cambiado de 2 significa que se ha usado una pista o todas
        if (this.numPistes != 2) {
          this.asignarPuntsPista();
        }
        // alert('Correcte');

        this.racha++;
        this.puntosUsuario = this.puntosUsuario + this.puntos;

        if (this.qttPreguntesContestades < 10) {
          this.puntosLocalStorage = this.puntos + this.puntosLocalStorage;
          localStorage.setItem(
            'puntosLocalStorage',
            JSON.stringify(this.puntosLocalStorage)
          );

          this.qttAcertadasLocalStorage = this.qttAcertadasLocalStorage + 1;
          localStorage.setItem(
            'qttAcertadasLocalStorage',
            JSON.stringify(this.qttAcertadasLocalStorage)
          );

          this.mejorRachaLocalStorage =
            this.racha > this.mejorRachaLocalStorage
              ? this.racha
              : this.mejorRachaLocalStorage;
          localStorage.setItem(
            'mejorRachaLocalStorage',
            JSON.stringify(this.mejorRachaLocalStorage)
          );
        }

        // Segun si a contestado bien o mal se envian ciertos datos
        this.pushDatos(true);
        // console.log("Test a" + "    ." + this.aPulsado);

        // Habilita el boton de siguiente pregunta
        this.habilitarSiguiente();
        this.juego.pushHistorial(
          'adminPrueba',
          this.randomIndex.toString(),
          this.qttPiestasUsadas,
          this.puntos,
          0
        );
      } else {
        this.aPulsado = true;
        this.correcto = false;
        this.incorrectaPulsada = r;

        // alert('Incorrecte');

        this.pushDatos(false);
        // console.log("Test b" + "    ." + this.aPulsado);
        this.habilitarSiguiente();
        this.juego.pushHistorial(
          'adminPrueba',
          this.randomIndex.toString(),
          this.qttPiestasUsadas,
          0,
          this.puntos
        );
      }
    }
    this.getUsuario();
  }

  // Funcion para pedir pista
  pedirPista() {
    if (!this.aPulsado) {
      // Si pistas es mayor que 0 puedes pedir pistas
      if (this.numPistes > 0) {
        // Genera un numero aleatorio para seleccionar una respuesta aleatoria para eliminar
        var R = Math.floor(Math.random() * this.respuestasOrdenadas.length);

        // Comprueba que la respuesta aleatoria no sea la correcta o que no sea vacia
        while (
          this.respuestasOrdenadas[R] == this.respuestaCorrecta ||
          this.respuestasOrdenadas[R] == ''
        ) {
          R = Math.floor(Math.random() * this.respuestasOrdenadas.length);
        }

        this.respuestasOrdenadas[R] = '';

        this.qttPiestasUsadas++;
        this.numPistes--;
      } else {
        alert('No te quedan pistas');
      }
    }
  }

  siguiente() {
    this.numP++;
    this.porcentajeAnimacion = this.numP * 10;
    location.reload();
  }

  pushDatos(correcto: boolean) {
    // console.log("he llegado");
    if (correcto) {
      this.juego.pushPuntsUsuari('adminPrueba', this.puntosUsuario);
      this.juego.pushRatxaUsuari('adminPrueba', this.racha);
      this.qttPreguntesContestades++;
      this.juego.pushPreguntesDiaries(
        'adminPrueba',
        this.qttPreguntesContestades
      );
    } else {
      this.racha = 0;
      this.juego.pushRatxaUsuari('adminPrueba', this.racha);
      this.qttPreguntesContestades++;
      this.juego.pushPreguntesDiaries(
        'adminPrueba',
        this.qttPreguntesContestades
      );
    }
  }

  // Habilita o deshabilita el boton de siguiente
  habilitarSiguiente() {
    // delay(2000);
    // this.ejecutarConDelay(20000);
    console.log("Localstorage: " + this.puntosLocalStorage);
    if (this.aPulsado) {
      this.buttonNQ = true;
      this.activarBoton();
      // this.btnSiguiente.disabled = false;
      // console.log("boton habilitado");
    } else {
      this.buttonNQ = false;
      this.desactivarBoton();
      // this.btnSiguiente.disabled = true;
      // console.log("boton deshabilitado");
    }
  }
  // Método para activar el botón
  activarBoton() {
    this.isDisabled = false;
  }

  // Método para desactivar el botón
  desactivarBoton() {
    this.isDisabled = true;
  }

  comprovarPreguntesContestades() {
    if (this.qttPreguntesContestades >= 10) {
      console.log('Tu racha final a sido de: ' + this.racha);
      console.log(
        'Los puntos totales que has ganado son: ' + this.puntosLocalStorage
      );
      console.log(
        'La mejor racha del dia a sido: ' + this.mejorRachaLocalStorage
      );
      console.log(
        'Has contestado un total de: ' +
          this.qttAcertadasLocalStorage +
          ' preguntas correctamente'
      );

      this.redirigir();

      // localStorage.removeItem('puntosLocalStorage');
      // localStorage.removeItem('mejorRachaLocalStorage');
      // localStorage.removeItem('qttAcertadasLocalStorage');
    }
  }

  getOds() {
    //  this.main.setBk(this.pregunta?.idODS);
    // console.log(this.pregunta?.idODS);
    this.juego.getOds(this.pregunta?.idODS).subscribe((dades) => {
      localStorage.setItem('datosODS', JSON.stringify(dades));
    });

    this.setBk();
    
  }
  // this.main.setBk(this.pregunta?.idODS);

  setBk() {
    // this.getOds();
    // console.log(this.pregunta?.idODS);
    switch (this.pregunta?.idODS) {
      case 'ACCIÓ PEL CLIMA':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/climate-change-2/';
        this.imgurl = '../../../assets/drawable/category/ACCIO_PEL_CLIMA.png';
        this.colorBack = '#48773c';
        // console.log("La pregunta es de accion pel clima")
        // body.className = '';
        // body.classList.add('bg1');
        break;
      case 'AIGUA, NETEJA I BENESTAR':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/water-and-sanitation/';
        this.imgurl =
          '../../../assets/drawable/category/AIUGA_NETEJA_I_BENESTAR.png';
        this.colorBack = '#27bde2';
        // console.log("La pregunta es de aigua nateja")

        // body.className = '';
        // body.classList.add('bg2');
        break;
      case 'ALIANCES PER ACONSEGUIR ELS OBJECTIUS':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/globalpartnerships/';
        this.imgurl =
          '../../../assets/drawable/category/ALIANCES_PER_ACONSEGUIR_ELS_OBJECTIUS.png';
        this.colorBack = '#1a3668';

        // console.log("La pregunta es de aliances per aconseguir")

        // body.className = '';
        // body.classList.add('bg3');
        break;
      case 'CIUTATS I COMUNITATS SOSTENIBLES':
        this.url = 'https://www.un.org/sustainabledevelopment/es/cities/';
        this.imgurl =
          '../../../assets/drawable/category/CIUTATS_I_COMUNITATS_SOSTENIBLES.png';
        this.colorBack = '#fd9d24';
        // body.className = '';
        // body.classList.add('bg4');
        break;
      case 'EDUCACIÓ DE QUALITAT':
        this.url = 'https://www.un.org/sustainabledevelopment/es/education/';
        this.imgurl =
          '../../../assets/drawable/category/EDUCACIO_DE_QUALITAT.png';
        this.colorBack = '#c5192d';
        // body.className = '';
        // body.classList.add('bg5');
        break;
      case 'ENERGIA ASSEQUIBLE I NO CONTAMINANT':
        this.url = 'https://www.un.org/sustainabledevelopment/es/energy/';
        this.imgurl =
          '../../../assets/drawable/category/ENERGIA_ASSEQUIBLE_I_NO_CONTAMINANT.png';
        this.colorBack = '#fcc312';
        // body.className = '';
        // body.classList.add('bg6');
        break;
      case 'FAM ZERO':
        this.url = 'https://www.un.org/sustainabledevelopment/es/hunger/';
        this.imgurl = '../../../assets/drawable/category/FAM_ZERO.png';
        this.colorBack = '#d19f2a';
        // body.className = '';
        // body.classList.add('bg7');
        break;
      case 'FI DE LA POBRESA':
        this.url = 'https://www.un.org/sustainabledevelopment/es/poverty/';
        this.imgurl = '../../../assets/drawable/category/FI_DE_LA_POBRESA.png';
        this.colorBack = '#e02b40';
        // body.className = '';
        // body.classList.add('bg8');
        break;
      case 'IGUALTAT DE GÈNERE':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/gender-equality/';
        this.imgurl =
          '../../../assets/drawable/category/IGUALTAT_DE_GENERE.png';
        this.colorBack = '#ef402b';
        // body.className = '';
        // body.classList.add('bg9');
        break;
      case 'INDUSTRIA, INNOVACIÓ, INFRAESTRUCTURA':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/infrastructure/';
        this.imgurl =
          '../../../assets/drawable/category/INDUSTRIA_INNOVACIO_I_INFRAESTRUCTURA.png';
        this.colorBack = '#f36d25';
        // body.className = '';
        // body.classList.add('bg10');
        break;
      case 'PAU, JUSTÍCIA I INSTITUCIONS SÒLIDES':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/peace-justice/';
        this.imgurl =
          '../../../assets/drawable/category/PAU_JUSTICIA_I_INSTITUCIONS_SOLIDES.png';
        this.colorBack = '#02558b';
        // body.className = '';
        // body.classList.add('bg11');
        break;
      case 'PRODUCCIÓ I CONSUM RESPONSABLES':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/';
        this.imgurl =
          '../../../assets/drawable/category/PRODUCCIO_I_CONSUM_RESPONSABLES.png';
        this.colorBack = '#cf8d2a';
        // body.className = '';
        // body.classList.add('bg12');
        break;
      case 'REDUCCIÓ DE LES DESIGUALTATS':
        this.url = 'https://www.un.org/sustainabledevelopment/es/inequality/';
        this.imgurl =
          '../../../assets/drawable/category/REDUCCIO_DE_LES_DESIGUALTATS.png';
        this.colorBack = '#e11484';
        // body.className = '';
        // body.classList.add('bg13');
        break;
      case 'SALUT I BENESTAR':
        this.url = 'https://www.un.org/sustainabledevelopment/es/health/';
        this.imgurl = '../../../assets/drawable/category/SALUT_I_BENESTAR.png';
        this.colorBack = '#279b48';
        // body.className = '';
        // body.classList.add('bg14');
        break;
      case 'TREBALL DECENT I CREIXEMENT ECONÒMIC':
        this.url =
          'https://www.un.org/sustainabledevelopment/es/economic-growth/';
        this.imgurl =
          '../../../assets/drawable/category/TREBALL_DECENT_I_CREIXEMENT_ECONOMIC.png';
        this.colorBack = '#901b3a';
        // body.className = '';
        // body.classList.add('bg15');
        break;
      case "VIDA D'ECOSISTEMES TERRESTRES":
        this.url = 'https://www.un.org/sustainabledevelopment/es/biodiversity/';
        this.imgurl =
          '../../../assets/drawable/category/VIDA_DECOSISTEMES_TERRESTRES.png';
        this.colorBack = '#3eb049';
        // body.className = '';
        // body.classList.add('bg16');
        break;
      case 'VIDA SUBMARINA':
        this.url = 'https://www.un.org/sustainabledevelopment/es/oceans/';
        this.imgurl = '../../../assets/drawable/category/VIDA_SUBMARINA.png';
        this.colorBack = '#007dbc';
        // body.className = '';
        // body.classList.add('bg17');
        break;
      default:
        this.url = 'https://www.un.org/sustainabledevelopment/es/oceans/';
        this.imgurl = '../../../assets/drawable/category/VIDA_SUBMARINA.png';
        this.colorBack = '#007dbc';
        // body.className = '';
        // body.classList.add('bg1');
        break;
    }
  }
}
