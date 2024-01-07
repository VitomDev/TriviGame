import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-juego',
  templateUrl: './final-juego.component.html',
  styleUrls: ['./final-juego.component.css']
})
export class FinalJuegoComponent {
  puntos: string = "";
  racha: string = "";
  aciertos: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarPuntosDesdeLocalStorage();
    this.cargarRachaDesdeLocalStorage();
    this.cargarAciertosDesdeLocalStorage();
  }

  redirigir() {
    // Utiliza el método navigate del servicio Router para redirigir a otra ruta
    this.router.navigate(['/perfil']);
  }

  private cargarPuntosDesdeLocalStorage(): void {
    const puntosLocalStorage = localStorage.getItem("puntosLocalStorage");

    if (puntosLocalStorage !== null) {
      this.puntos = puntosLocalStorage;
    } else {
      console.error("No se encontraron puntos en el almacenamiento local.");
      // Podrías manejar este caso de error de otra manera, dependiendo de tus necesidades.
    }
  }

  private cargarRachaDesdeLocalStorage(): void {
    const rachaLocalStorage = localStorage.getItem("mejorRachaLocalStorage");

    if (rachaLocalStorage !== null) {
      this.racha = rachaLocalStorage;
    } else {
      console.error("No se encontró la racha en el almacenamiento local.");
      // Manejar este caso de error según tus necesidades.
    }
  }

  private cargarAciertosDesdeLocalStorage(): void {
    const aciertosLocalStorage = localStorage.getItem("qttAcertadasLocalStorage");

    if (aciertosLocalStorage !== null) {
      this.aciertos = aciertosLocalStorage;
    } else {
      console.error("No se encontraron aciertos en el almacenamiento local.");
      // Manejar este caso de error según tus necesidades.
    }
  }

}
