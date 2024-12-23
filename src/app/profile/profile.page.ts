import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {


  isModalOpen: boolean = false;
  maxDate: string;  // Definição da variável maxDate
  showDatePicker: boolean = false; 
   
   constructor(
    
     private router: Router,
     private modalController: ModalController
   ) {
    const today = new Date();
    this.maxDate = today.toISOString();
   }

   passwordType: string = 'password';

   togglePasswordVisibility() {
     this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
   }

   openDatePicker() {
    this.showDatePicker = true;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }
}
