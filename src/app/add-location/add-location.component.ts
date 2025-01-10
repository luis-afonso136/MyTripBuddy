import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Viagem {
  id: string;
  prop1: string; // Nome da viagem
}

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  @Input() location: any = null;  // Localização para edição
  @Input() action: string = 'create';  // Ação: 'create' ou 'update'
  viagens: Viagem[] = [];

  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingCtrl: LoadingController  // Importação do LoadingController
  ) {}

  ngOnInit() {
    if (this.action === 'update') {
      console.log(this.location); // Exibir dados de localização para verificação
    } else {
      this.location = { prop1: '', description: '', travelId: '' };  // Inicializar com valores vazios
    }
    this.getViagens();
  }
  
  // Método para exibir o loading
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }

  async getViagens() {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      this.viagens = await firstValueFrom(
        this.http.get<Viagem[]>(`${this.apiUrl}/travels`, { headers })
      );
    } catch (error) {
      this.presentToast('Erro ao carregar viagens', 'danger');
    }
  }

  async submitForm() {
    if (!this.location.prop1 || !this.location.description || !this.location.travelId) {
      this.presentToast('Por favor, preencha todos os campos', 'warning');
      return;
    }
    
    const loading = await this.showLoading(); // Exibir loading antes de fazer a requisição
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  
    try {
      if (this.action === 'create') {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/travels/locations`, this.location, { headers })
        );
        this.presentToast('Localização adicionada com sucesso!', 'success');
      } else if (this.action === 'update') {
        await firstValueFrom(
          this.http.put(`${this.apiUrl}/travels/locations/${this.location.id}`, this.location, { headers })
        );
        this.presentToast('Localização atualizada com sucesso!', 'success');
      }
  
      // Atualiza a lista de viagens após a operação
      await this.getViagens();
      this.dismissModal();
    } catch (error) {
      this.presentToast('Erro ao salvar localização', 'danger');
    } finally {
      loading.dismiss(); // Esconder loading depois da requisição
    }
  }
  

  async deleteLocation() {
    const loading = await this.showLoading(); // Exibir loading antes de fazer a requisição
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/travels/locations/${this.location.id}`, { headers })
      );
      this.presentToast('Localização deletada com sucesso!', 'success');

      // Atualiza a lista de viagens após a exclusão
      await this.getViagens();

      this.dismissModal();
    } catch (error) {
      this.presentToast('Erro ao deletar a localização', 'danger');
    } finally {
      loading.dismiss(); // Esconder o loading depois da requisição
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
