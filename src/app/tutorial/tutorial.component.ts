import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {

  constructor (private router: Router) {}

  redHome(){
    this.router.navigate(['/home']);
  }


}
