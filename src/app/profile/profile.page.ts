import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

 isModalOpen: boolean = false;
   
   constructor(
     private router: Router,
     private modalController: ModalController
   ) {}
 
   async openModal() {
     const modal = await this.modalController.create({
       component: CriarComponent,
       cssClass: 'custom-modal-css', 
     });
     return await modal.present();
   }

   goHome() {
    this.router.navigate(['/home']); 
  }

}
