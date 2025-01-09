import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Viagem {
  id: string;
  description: string;
  state: State;
  prop1: string; // Nome da viagem
  prop2: string; // Continente
  createdBy?: string;
  updatedBy?: string;
}

enum State {
  TODO = 'FUTURA', // Viagem futura
  DONE = 'EFETUADA', // Viagem já efetuada
}

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss'],
})
export class CriarComponent {
  viagem!: Viagem;
  apiUrl: string = 'https://mobile-api-one.vercel.app/api/travels';
  name: string = 'luis.manuel.afonso@ipvc.pt';
  password: string = 'T8@oXkZy';
  form: FormGroup = this.formBuilder.group({});

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    this.setUpForm();
  }

  ngOnInit() {
    if (this.viagem) {
      this.form.patchValue(this.viagem);
    }
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      state: [State.TODO, [Validators.required]],
      prop1: ['', [Validators.required]], // Nome da viagem
      prop2: ['', [Validators.required]], // Continente
    });
  }

  async save() {
    if (this.form.valid) {
      if (this.viagem) {
        await this.updateViagem(this.form);
        return;
      }
      await this.createViagem(this.form);
      return;
    }
    await this.presentToast('Formulário inválido!', 'danger');
  }

  async createViagem(form: FormGroup) {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const { description, state, prop1, prop2 } = form.value;
    const newViagem = {
      description,
      state,
      prop1,
      prop2,
      createdBy: this.name,
    };

    try {
      await firstValueFrom(this.http.post<Viagem[]>(`${this.apiUrl}`, newViagem, { headers }));
      loading.dismiss();
      await this.presentToast('Viagem criada com sucesso! ✈️', 'success');
      await this.dismissModal('update');
    } catch (error: any) {
      loading.dismiss();
      await this.handleError(error);
    }
  }

  async updateViagem(form: FormGroup) {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    const { description, state, prop1, prop2 } = form.value;
    const updatedViagem = {
      description,
      state,
      prop1,
      prop2,
      updatedBy: this.name,
    };

    try {
      await firstValueFrom(this.http.put<Viagem[]>(`${this.apiUrl}/${this.viagem.id}`, updatedViagem, { headers }));
      loading.dismiss();
      await this.presentToast('Viagem atualizada com sucesso! ✈️', 'success');
      await this.dismissModal('update');
    } catch (error: any) {
      loading.dismiss();
      await this.handleError(error);
    }
  }

  async deleteViagem(viagem: Viagem) {
    const loading = await this.showLoading();

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,
    });

    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${viagem.id}`, { headers }));
      loading.dismiss();
      await this.presentToast('Viagem apagada com sucesso! ', 'success');
      await this.dismissModal('update');
    } catch (error: any) {
      loading.dismiss();
      await this.handleError(error);
    }
  }

  async handleError(error: any) {
    if (error.error) {
      await this.presentToast(error.error, 'danger');
    } else {
      await this.showAlert('Erro', 'Ocorreu um erro inesperado.');
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'dots',
      showBackdrop: true,
    });

    loading.present();

    return loading;
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
    });

    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async dismissModal(message: any = null) {
    await this.modalCtrl.dismiss({ message: message });
  }
}
