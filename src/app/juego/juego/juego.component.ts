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
// import { main } from '../../../main';
import { ods } from '../modelDades/ods';

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
  url: string = "https://www.youtube.com";
  imgurl: string = "hola";

  numPistes: number = 2;
  dificultad?: string;

  puntos: number = 100;

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

  correcto: boolean = false;
  incorrectaPulsada: string | undefined;
  // constructor(public juego: JuegoService, public main: main) {
    // this.getOds();
  // }
  constructor(public juego: JuegoService) {}

  ngOnInit(): void {
    // Consige todas las preguntas de la base de datos
    this.getPreguntes();

    // this.getOds();

    

    // Guarda la informacion del usuario en el local storage
    this.getUsuario();


    // this.main.setBk(this.pregunta?.idODS);

    this.btnSiguiente = document.getElementById('siguiente');
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

    console.log(`El tamaño de la imagen es ${imageSize} bytes.`);
    console.log(`El tamaño de la imagen es ${imageSize / (1024 * 1024)} MB.`);
  

    this.setBk();
    console.log(this.imgurl);
    console.log(this.url);
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
        alert('Correcte');

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

        alert('Incorrecte');

        this.pushDatos(false);
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
    location.reload();
  }

  pushDatos(correcto: boolean) {
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
    if (this.aPulsado) {
      this.btnSiguiente.disabled = false;
    } else {
      this.btnSiguiente.disabled = true;
    }
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

      localStorage.removeItem('puntosLocalStorage');
      localStorage.removeItem('mejorRachaLocalStorage');
      localStorage.removeItem('qttAcertadasLocalStorage');
    }
  }
  
  // getOds(){
  //  this.main.setBk(this.pregunta?.idODS); 
  //  this.juego.getOds(this.pregunta?.idODS).subscribe((dades)=> {
  //   localStorage.setItem('datosODS', JSON.stringify(dades));
  //  })
  // }
  // this.main.setBk(this.pregunta?.idODS);
  






  setBk() {
    console.log(this.pregunta?.idODS);
      switch (this.pregunta?.idODS) {
        case 'ACCIÓ PEL CLIMA':
          this.url = "https://www.un.org/sustainabledevelopment/es/climate-change-2/";
          this.imgurl = "../../../assets/drawable/category/ACCIO_PEL_CLIMA.png";
          // body.className = '';
          // body.classList.add('bg1');
          break;
        case 'AIGUA, NETEJA I BENESTAR':
          this.url = "https://www.un.org/sustainabledevelopment/es/water-and-sanitation/";
          this.imgurl = "../../../assets/drawable/category/AIUGA_NETEJA_I_BENESTAR.png";
          // body.className = '';
          // body.classList.add('bg2');
          break;
        case 'ALIANCES PER ACONSEGUIR ELS OBJECTIUS':
          this.url = "https://www.un.org/sustainabledevelopment/es/globalpartnerships/";
          this.imgurl = "../../../assets/drawable/category/ALIANCES_PER_ACONSEGUIR_ELS_OBJECTIUS.png";
          // body.className = '';
          // body.classList.add('bg3');
          break;
        case 'CIUTATS I COMUNITATS SOSTENIBLES':
          this.url = "https://www.un.org/sustainabledevelopment/es/cities/";
          this.imgurl = "../../../assets/drawable/category/CIUTATS_I_COMUNITATS_SOSTENIBLES.png";
          // body.className = '';
          // body.classList.add('bg4');
          break;
        case 'EDUCACIÓ DE QUALITAT':
          this.url = "https://www.un.org/sustainabledevelopment/es/education/";
          this.imgurl = "../../../assets/drawable/category/EDUCACIO_DE_QUALITAT.png";
          // body.className = '';
          // body.classList.add('bg5');
          break;
        case 'ENERGIA ASSEQUIBLE I NO CONTAMINANT':
          this.url = "https://www.un.org/sustainabledevelopment/es/energy/";
          this.imgurl = "../../../assets/drawable/category/ENERGIA_ASSEQUIBLE_I_NO_CONTAMINANT.png";
          // body.className = '';
          // body.classList.add('bg6');
          break;
        case 'FAM ZERO':
          this.url = "https://www.un.org/sustainabledevelopment/es/hunger/";
          this.imgurl = "../../../assets/drawable/category/FAM_ZERO.png";
          // body.className = '';
          // body.classList.add('bg7');
          break;
        case 'FI DE LA POBRESA':
          this.url = "https://www.un.org/sustainabledevelopment/es/poverty/";
          this.imgurl = "../../../assets/drawable/category/FI_DE_LA_POBRESA.png";
          // body.className = '';
          // body.classList.add('bg8');
          break;
        case 'IGUALTAT DE GÈNERE':
          this.url = "https://www.un.org/sustainabledevelopment/es/gender-equality/";
          this.imgurl = "../../../assets/drawable/category/IGUALTAT_DE_GENERE.png";
          // body.className = '';
          // body.classList.add('bg9');
          break;
        case 'INDUSTRIA, INNOVACIÓ, INFRAESTRUCTURA':
          this.url = "https://www.un.org/sustainabledevelopment/es/infrastructure/";
          this.imgurl = "../../../assets/drawable/category/INDUSTRIA_INNOVACIO_I_INFRAESTRUCTURA.png";
          // body.className = '';
          // body.classList.add('bg10');
          break;
        case 'PAU, JUSTÍCIA I INSTITUCIONS SÒLIDES':
          this.url = "https://www.un.org/sustainabledevelopment/es/peace-justice/";
          this.imgurl = "../../../assets/drawable/category/PAU_JUSTICIA_I_INSTITUCIONS_SOLIDES.png";
          // body.className = '';
          // body.classList.add('bg11');
          break;
        case 'PRODUCCIÓ I CONSUM RESPONSABLES':
          this.url = "https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/";
          this.imgurl = "../../../assets/drawable/category/PRODUCCIO_I_CONSUM_RESPONSABLES.png";
          // body.className = '';
          // body.classList.add('bg12');
          break;
        case 'REDUCCIÓ DE LES DESIGUALTATS':
          this.url = "https://www.un.org/sustainabledevelopment/es/inequality/";
          this.imgurl = "../../../assets/drawable/category/REDUCCIO_DE_LES_DESIGUALTATS.png";
          // body.className = '';
          // body.classList.add('bg13');
          break;
        case 'SALUT I BENESTAR':
          this.url = "https://www.un.org/sustainabledevelopment/es/health/";
          this.imgurl = "../../../assets/drawable/category/SALUT_I_BENESTAR.png";
          // body.className = '';
          // body.classList.add('bg14');
          break;
        case 'TREBALL DECENT I CREIXEMENT ECONÒMIC':
          this.url = "https://www.un.org/sustainabledevelopment/es/economic-growth/";
          this.imgurl = "../../../assets/drawable/category/TREBALL_DECENT_I_CREIXEMENT_ECONOMIC.png";
          // body.className = '';
          // body.classList.add('bg15');
          break;
        case "VIDA D'ECOSISTEMES TERRESTRES":
          this.url = "https://www.un.org/sustainabledevelopment/es/biodiversity/";
          this.imgurl = "../../../assets/drawable/category/VIDA_DECOSISTEMES_TERRESTRES.png";
          // body.className = '';
          // body.classList.add('bg16');
          break;
        case 'VIDA SUBMARINA':
          this.url = "https://www.un.org/sustainabledevelopment/es/oceans/";
          this.imgurl = "../../../assets/drawable/category/VIDA_SUBMARINA.png";
          // body.className = '';
          // body.classList.add('bg17');
          break;
        default:
          // body.className = '';
          // body.classList.add('bg1');
          break;
      }
  }
























}