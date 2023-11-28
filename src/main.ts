import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const body = document.getElementById('bodyMain');
let compFondo: boolean = true;

if (body != null) {
  if (compFondo) {
    body.classList.remove('bodyJuego');
    body.classList.add('bodyMenu');
  } else {
    body.classList.remove('bodyMenu');
    body.classList.add('bodyJuego');
  }
}
