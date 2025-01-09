import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';

interface Viagem {
  id: string;
  prop1: string; // Nome da viagem
  prop2: string; // Continente
  description: string;
  state: State;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

enum State {
  DONE = 'DONE', // Viagens Já Efetuadas
  TODO = 'TODO', // Viagens Futuras
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
  selectedSegment: string = 'future-trips'; // Padrão de segmento
  searchTerm: string = ''; // Texto do filtro de pesquisa

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
      this.presentToast(
        this.viagens.length
          ? `Possui ${this.viagens.length} viagens disponíveis ✈️`
          : 'Não há viagens disponíveis 😥',
        this.viagens.length ? 'success' : 'warning'
      );
    } catch (error: any) {
      loading.dismiss();
      this.presentToast(`Erro ao carregar viagens: ${error.message}`, 'danger');
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
      message: 'Carregando...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }

  // Atualize o getter filteredViagens para incluir pesquisa e segmentação
  get filteredViagens() {
    return this.viagens.filter(
      (viagem) =>
        (this.selectedSegment === 'future-trips'
          ? viagem.state === State.TODO // 'TODO' representa Viagens Futuras
          : viagem.state === State.DONE) && // 'DONE' representa Viagens Já Efetuadas
        viagem.prop1
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) // Verifica se o termo de pesquisa está presente no campo prop1
    );
  }
  

  // Método para aplicar filtros ao mudar segmento ou texto de pesquisa
  filterViagens() {
    // Apenas força a atualização do getter filteredViagens
  }
}
