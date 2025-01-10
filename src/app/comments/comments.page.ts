import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { CriarComentarioComponent } from '../criar-comentario/criar-comentario.component'; // Importe o componente de criar comentário

interface Comentario {
  id: string;
  comment: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
  travelId: string;
}

interface Viagem {
  id: string;
  prop1: string;
  prop2: string;
  description: string;
  state: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  comments: Comentario[]; // Comentários da viagem
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';
  viagens: Viagem[] = [];
  filtroSelecionado: string = 'comComentarios';
  viagensFiltradas: Viagem[] = []; // Nova variável para armazenar as viagens filtradas

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getViagens();
  }

  // Mostrar Loading personalizado
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }

  // Carregar viagens e aplicar o filtro padrão
  async getViagens() {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const loading = await this.showLoading();

    try {
      const viagens: Viagem[] = await firstValueFrom(
        this.http.get<Viagem[]>(`${this.apiUrl}/travels`, { headers })
      );
      this.viagens = viagens;
      this.viagensFiltradas = [...this.viagens]; // Mostra todas as viagens por padrão
      await loading.dismiss();
    } catch (error: any) {
      console.error('Erro ao carregar viagens:', error);
      await loading.dismiss();
      this.presentToast('Erro ao carregar viagens!', 'danger');
      this.showErrorAlert('Erro ao carregar dados', 'Não foi possível carregar as viagens. Tente novamente mais tarde.');
    }
  }

  // Método para abrir o modal de criação de comentário
  async openCreateCommentModal() {
    const modal = await this.modalCtrl.create({
      component: CriarComentarioComponent,
      componentProps: { viagens: this.viagens }, // Passa todas as viagens
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.message === 'comentarioCriado') {
      const loading = await this.showLoading();
      await this.getViagens(); // Recarrega todas as viagens
      await loading.dismiss();
    }
  }

  // Método para abrir o modal de edição ou exclusão de comentário
  async openEditCommentModal(comentario: Comentario, viagem: Viagem) {
    const modal = await this.modalCtrl.create({
      component: CriarComentarioComponent,  // Reutilizando o mesmo modal
      componentProps: {
        viagem, 
        comentario,  // Passando o comentário para o modal
        isEditing: true,  // Indicando que estamos editando ou deletando
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.message === 'comentarioAlterado' || data?.message === 'comentarioDeletado') {
      const loading = await this.showLoading(); // Mostrar loading ao recarregar
      await this.getViagens(); // Recarregar as viagens e comentários após alteração ou deleção
      await loading.dismiss(); // Fechar loading
    }
  }

  // Filtrar viagens com comentários
  filtrarViagensComComentarios() {
    this.filtroSelecionado = 'comComentarios';
    this.viagensFiltradas = this.viagens.filter(viagem => viagem.comments && viagem.comments.length > 0);
  }


  refreshViagens() {
    this.getViagens();
  }

  // Exibir Toast
  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

  // Exibir alerta de erro
  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
