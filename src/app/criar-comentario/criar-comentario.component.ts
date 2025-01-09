import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-criar-comentario',
  templateUrl: './criar-comentario.component.html',
  styleUrls: ['./criar-comentario.component.scss'],
})
export class CriarComentarioComponent implements OnInit {
  @Input() viagens: any[] = [];
  @Input() comentario: any;
  @Input() viagem: any;
  @Input() isEditing: boolean = false;
  selectedViagemId: string = '';
  comment: string = '';
  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    if (this.isEditing) {
      this.selectedViagemId = this.comentario.travelId;
      this.comment = this.comentario.comment;
    }
  }

  async submitComment() {
    if (!this.selectedViagemId || !this.comment.trim()) {
      this.presentToast('Selecione uma viagem e escreva um comentário!', 'warning');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const loading = await this.showLoading();
    try {
      if (this.isEditing) {
        // Atualiza o comentário
        await firstValueFrom(
          this.http.put(
            `${this.apiUrl}/travels/comments/${this.comentario.id}`,
            { travelId: this.selectedViagemId, comment: this.comment },
            { headers }
          )
        );
        this.presentToast('Comentário atualizado com sucesso!', 'success');
        this.modalCtrl.dismiss({ message: 'comentarioAlterado' });
      } else {
        // Cria um novo comentário
        await firstValueFrom(
          this.http.post(
            `${this.apiUrl}/travels/comments`,
            { travelId: this.selectedViagemId, comment: this.comment },
            { headers }
          )
        );
        this.presentToast('Comentário adicionado com sucesso!', 'success');
        this.modalCtrl.dismiss({ message: 'comentarioCriado' });
      }
    } catch (error: any) {
      this.presentToast('Erro ao processar comentário', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async deleteComment() {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const loading = await this.showLoading();
    try {
      await firstValueFrom(
        this.http.delete(
          `${this.apiUrl}/travels/comments/${this.comentario.id}`,
          { headers }
        )
      );
      this.presentToast('Comentário deletado com sucesso!', 'success');
      this.modalCtrl.dismiss({ message: 'comentarioDeletado' });
    } catch (error: any) {
      this.presentToast('Erro ao deletar comentário', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  close() {
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'dots',
    });
    await loading.present();
    return loading;
  }
}
