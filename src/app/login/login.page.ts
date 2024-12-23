import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 constructor(private router: Router) { }
 
   ngOnInit() {
   }
 
   handleLogin() {
     
     this.router.navigate(['/tabs/home']); 
   }

   registerLink() {
    this.router.navigate(['/register']);
   }

   passwordType: string = 'password'; // Tipo inicial é 'password'

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
}
