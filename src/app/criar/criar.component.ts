import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss'],
})
export class CriarComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() viagemAdicionada = new EventEmitter<any>();

  viagem = {
    localViagem: '',
    descricao: '',
    estado: '',
    localizacao: '',
    comentarios: '',
  };

  constructor(private modalController: ModalController) {}

  onClose(): void {
    this.closeModal.emit();
    this.modalController.dismiss();
  }

  onSubmit(): void {
    this.viagemAdicionada.emit(this.viagem);
    this.modalController.dismiss(this.viagem);
  }
}
