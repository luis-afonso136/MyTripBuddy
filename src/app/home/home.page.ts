import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';

interface Viagem {
  id: string;
  description: string;
  state: 'Viagens Futuras' | 'Viagens Já Efetuadas';
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';
  viagens: Viagem[] = [];
  selectedSegment: string = 'future-trips';  // Padrão de segmento

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.getViagens();
  }

  async getViagens() {
    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.viagens = await firstValueFrom(
        this.http.get<Viagem[]>(`${this.apiUrl}/travels`, { headers })
      );
      loading.dismiss();
      if (this.viagens.length === 0) {
        await this.presentToast('Não tem viagems disponiveis 😥', 'warning');
      } else {
        await this.presentToast(
          `Possui ${this.viagens.length} Viagens ✈️`,
          'success'
        );
      }
    } catch (error: any) {
      loading.dismiss();
      await this.presentToast(error.message, 'danger');
    }
  }

  async openModal(viagem: Viagem | null = null) {
    const modal = await this.modalCtrl.create({
      component: CriarComponent,
      componentProps: { viagem },
      backdropDismiss: false,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.message === 'update') {
      await this.getViagens();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }

  // Getter para viagens filtradas
  get filteredViagens() {
    return this.viagens.filter(viagem => 
      this.selectedSegment === 'future-trips' ? 
      viagem.state === 'Viagens Futuras' : 
      viagem.state === 'Viagens Já Efetuadas'
    );
  }

  // Método para mudar o segmento
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; 
  }
}
