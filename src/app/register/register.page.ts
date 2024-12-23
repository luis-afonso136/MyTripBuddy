import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  handleRegister() {
    
    this.router.navigate(['/tabs/home']); 
  }

  loginLink() {
    this.router.navigate(['/login']);
  }

  passwordType: string = 'password'; // Tipo inicial é 'password'

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
}
