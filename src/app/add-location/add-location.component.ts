import { Component, Input, OnInit } from '@angular/core'; 
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Viagem {
  id: string;
  prop1: string; // Nome da viagem
}

interface Comment {
  id: string;
  comment: string;
}

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  @Input() location: any = null; // Localização para edição
  @Input() action: string = 'create'; // Ação: 'create' ou 'update'
  viagens: Viagem[] = [];
  comments: Comment[] = [];
  newComment: string = ''; // Novo comentário
  currentComment: Comment | null = null; // Comentário atual para exclusão
  selectedComment: Comment | null = null;

  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.action === 'update') {
      this.getComments(); // Carregar comentários se estiver em modo de edição
    } else {
      this.location = { prop1: '', description: '', travelId: '' }; // Inicializar com valores vazios
    }
    this.getViagens();
  }

  async showLoading(message: string = 'Carregando...') {
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'dots',
    });
    await loading.present();
    return loading;
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
    } catch (error) {
      this.presentToast('Erro ao carregar viagens', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async submitForm() {
    if (!this.location.prop1 || !this.location.description || !this.location.travelId) {
      this.presentToast('Por favor, preencha todos os campos', 'warning');
      return;
    }
  
    const loading = await this.showLoading();
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
  
      // Chama getLocations para garantir que a lista seja atualizada após a modificação
      this.dismissModal();
    } catch (error) {
      this.presentToast('Erro ao salvar localização', 'danger');
    } finally {
      loading.dismiss();
    }
  }  

  async deleteLocation() {
    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/travels/locations/${this.location.id}`, { headers })
      );
      this.presentToast('Localização deletada com sucesso!', 'success');
      await this.getViagens();
      this.dismissModal();
    } catch (error) {
      this.presentToast('Erro ao deletar a localização', 'danger');
    } finally {
      loading.dismiss();
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

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async getComments() {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });
  }

  async addComment() {
    if (!this.newComment) {
      this.presentToast('Por favor, insira um comentário', 'warning');
      return;
    }

    const loading = await this.showLoading();
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/travels/locations/comments`, {
          locationId: this.location.id,
          comment: this.newComment,
        }, { headers })
      );
      this.presentToast('Comentário adicionado com sucesso!', 'success');
      this.newComment = '';
      this.getComments();
    } catch (error) {
      this.presentToast('Erro ao adicionar comentário', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
}
