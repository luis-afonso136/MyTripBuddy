import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  viagens: any[] = [];

  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: CriarComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.viagens.push(result.data);
      }
    });

    return await modal.present();
  }
}
