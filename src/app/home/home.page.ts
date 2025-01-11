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
  type: string; // Tipo da viagem 
  state: State;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  startAt: Date; // Data de início da viagem
  endAt: Date;   // Data de fim da viagem
  locations?: Location[]; // Localizações associadas à viagem
}

interface Location {
  prop1: string; // Nome da localização
  description: string; // Descrição da localização
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
      const viagens = await firstValueFrom(
        this.http.get<Viagem[]>(`${this.apiUrl}/travels`, { headers })
      );
  
      // Buscar as localizações associadas a cada viagem
      for (let viagem of viagens) {
        viagem.locations = await this.getLocationsForViagem(viagem.id);
      }
  
      this.viagens = viagens;
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

  async getLocationsForViagem(viagemId: string): Promise<Location[]> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      const locations = await firstValueFrom(
        this.http.get<Location[]>(`${this.apiUrl}/travels/${viagemId}/locations`, { headers })
      );
      return locations;
    } catch (error) {
      console.error('Erro ao carregar localizações para a viagem', error);
      return [];
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

  refreshViagens() {
    this.getViagens();
  }

  get filteredViagens() {
    return this.viagens.filter(
      (viagem) =>
        (this.selectedSegment === 'future-trips'
          ? viagem.state === State.TODO
          : viagem.state === State.DONE) &&
        viagem.prop1.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  

  filterViagens() {
    // Chama apenas o getter `filteredViagens` indiretamente
  }
}
