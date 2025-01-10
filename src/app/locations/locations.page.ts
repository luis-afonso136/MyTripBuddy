import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AddLocationComponent } from '../add-location/add-location.component';

interface Location {
  id: string;
  prop1: string; // Nome da Localização
  description: string;
  travelId: string; // ID da Viagem
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  locations: Location[] = [];
  viagens: any[] = []; // Lista de viagens
  selectedViagemId: string = ''; // ID da viagem selecionada
  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingCtrl: LoadingController // Importação do LoadingController
  ) {}

  ngOnInit() {
    this.getViagens();
  }

  // Função para refrescar a página
  async refreshPage() {
    this.getLocations(); // Recarregar as localizações
  }

  // Mostrar o carregamento
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }

  async getViagens() {
    const loading = await this.showLoading(); // Exibir loading antes da requisição
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.viagens = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/travels`, { headers })
      );
    } catch (error) {
      this.presentToast('Erro ao carregar viagens', 'danger');
    } finally {
      loading.dismiss(); // Esconder loading depois da requisição
    }
  }

  async getLocations() {
    if (!this.selectedViagemId) {
      this.presentToast('Selecione uma viagem primeiro.', 'warning');
      return;
    }

    const loading = await this.showLoading(); // Exibir loading antes da requisição
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      const locations = await firstValueFrom(
        this.http.get<Location[]>(
          `${this.apiUrl}/travels/${this.selectedViagemId}/locations`,
          { headers }
        )
      );
      this.locations = locations;
    } catch (error) {
      this.presentToast('Erro ao carregar localizações', 'danger');
    } finally {
      loading.dismiss(); // Esconder loading depois da requisição
    }
  }

  async openAddLocationModal(
    location: Location | null = null,
    action: string = 'create'
  ) {
    const modal = await this.modalCtrl.create({
      component: AddLocationComponent,
      componentProps: { location, action },
      backdropDismiss: false,
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.message === 'success') {
      this.getLocations(); // Recarregar as localizações após adicionar ou atualizar
    }
  }

  async deleteLocation(locationId: string) {
    const loading = await this.showLoading(); // Exibir loading antes da requisição
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/travels/locations/${locationId}`, {
          headers,
        })
      );
      this.presentToast('Localização deletada com sucesso!', 'success');

      // Atualizar a lista de localizações após a exclusão (remove do array)
      this.locations = this.locations.filter(
        (location) => location.id !== locationId
      );
    } catch (error) {
      this.presentToast('Erro ao deletar a localização', 'danger');
    } finally {
      loading.dismiss(); // Esconder loading depois da requisição
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

  selectViagem(viagemId: string) {
    this.selectedViagemId = viagemId;
    this.getLocations(); // Carregar as localizações da viagem selecionada
  }
}
