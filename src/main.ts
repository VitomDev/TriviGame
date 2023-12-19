import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// document.addEventListener('DOMContentLoaded', (event) => {
//   let message: string = 'Hello, world!';
//   console.log(message);
// });

const body = document.getElementById('bodyMain');
let compFondo = 13;

if (body != null) {
  switch (compFondo) {
    case 1:
      body.className = '';
      body.classList.add('bg1');
      break;
    case 2:
      body.className = '';
      body.classList.add('bg2');
      break;
    case 3:
      body.className = '';
      body.classList.add('bg3');
      break;
    case 4:
      body.className = '';
      body.classList.add('bg4');
      break;
    case 5:
      body.className = '';
      body.classList.add('bg5');
      break;
    case 6:
      body.className = '';
      body.classList.add('bg6');
      break;
    case 7:
      body.className = '';
      body.classList.add('bg7');
      break;
    case 8:
      body.className = '';
      body.classList.add('bg8');
      break;
    case 9:
      body.className = '';
      body.classList.add('bg9');
      break;
    case 10:
      body.className = '';
      body.classList.add('bg10');
      break;
    case 11:
      body.className = '';
      body.classList.add('bg11');
      break;
    case 12:
      body.className = '';
      body.classList.add('bg12');
      break;
    case 13:
      body.className = '';
      body.classList.add('bg13');
      break;
    case 14:
      body.className = '';
      body.classList.add('bg14');
      break;
    case 15:
      body.className = '';
      body.classList.add('bg15');
      break;
    case 16:
      body.className = '';
      body.classList.add('bg16');
      break;
    case 17:
      body.className = '';
      body.classList.add('bg17');
      break;
    default:
      body.className = '';
      body.classList.add('bg1');
      break;
  }
}
