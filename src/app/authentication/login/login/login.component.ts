import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServeiAutenticarService } from 'src/app/servei-autenticar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usr:string = ''; 
  psw: string ='';

  
  constructor(public serveiAutenticar: ServeiAutenticarService, private router:Router) { }

  

  ngOnInit(): void {
    this.serveiAutenticar.loginOK=false;
    localStorage.removeItem("email")
  }

  logout() {
    this.serveiAutenticar.logout()
  }
  login() {
    this.serveiAutenticar.login()
    // this.router.navigateByUrl('/juego');

  }
  private formatDateToDDMMYYYY(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public isModalOpen: boolean = false;

  public openForgotPasswordModal(): void {
      this.isModalOpen = true;
  }

  public closeModal(): void {
      this.isModalOpen = false;
  }
}