import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html', 
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

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
}
