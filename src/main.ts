import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { JuegoComponent } from './app/juego/juego/juego.component';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// document.addEventListener('DOMContentLoaded', (event) => {
//   let message: string = 'Hello, world!';
//   console.log(message);
// });

const body = document.getElementById('bodyMain');
// let compFondo = 1;

export class main {
  constructor() {}

  setBk(string: string | undefined) {
    if (body != null) {
      switch (string) {
        case 'ACCIÓ PEL CLIMA':
          body.className = '';
          body.classList.add('bg1');
          break;
        case 'AIGUA, NETEJA I BENESTAR':
          body.className = '';
          body.classList.add('bg2');
          break;
        case 'ALIANCES PER ACONSEGUIR ELS OBJECTIUS':
          body.className = '';
          body.classList.add('bg3');
          break;
        case 'CIUTATS I COMUNITATS SOSTENIBLES':
          body.className = '';
          body.classList.add('bg4');
          break;
        case 'EDUCACIÓ DE QUALITAT':
          body.className = '';
          body.classList.add('bg5');
          break;
        case 'ENERGIA ASSEQUIBLE I NO CONTAMINANT':
          body.className = '';
          body.classList.add('bg6');
          break;
        case 'FAM ZERO':
          body.className = '';
          body.classList.add('bg7');
          break;
        case 'FI DE LA POBRESA':
          body.className = '';
          body.classList.add('bg8');
          break;
        case 'IGUALTAT DE GÈNERE':
          body.className = '';
          body.classList.add('bg9');
          break;
        case 'INDUSTRIA, INNOVACIÓ, INFRAESTRUCTURA':
          body.className = '';
          body.classList.add('bg10');
          break;
        case 'PAU, JUSTÍCIA I INSTITUCIONS SÒLIDES':
          body.className = '';
          body.classList.add('bg11');
          break;
        case 'PRODUCCIÓ I CONSUM RESPONSABLES':
          body.className = '';
          body.classList.add('bg12');
          break;
        case 'REDUCCIÓ DE LES DESIGUALTATS':
          body.className = '';
          body.classList.add('bg13');
          break;
        case 'SALUT I BENESTAR':
          body.className = '';
          body.classList.add('bg14');
          break;
        case 'TREBALL DECENT I CREIXEMENT ECONÒMIC':
          body.className = '';
          body.classList.add('bg15');
          break;
        case "VIDA D'ECOSISTEMES TERRESTRES":
          body.className = '';
          body.classList.add('bg16');
          break;
        case 'VIDA SUBMARINA':
          body.className = '';
          body.classList.add('bg17');
          break;
        default:
          body.className = '';
          body.classList.add('bg1');
          break;
      }
    }
  }
}
