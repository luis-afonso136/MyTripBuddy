import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component'; // Certifique-se de que está apontando para o componente correto.

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  constructor(private modalController: ModalController) {}

  async openCriarModal() {
    const modal = await this.modalController.create({
      component: CriarComponent, // Nome do componente modal
    });
    return await modal.present();
  }
}
