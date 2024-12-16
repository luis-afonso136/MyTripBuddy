import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss'],
})
export class CriarComponent {

  @Output() closeModal = new EventEmitter<void>();

  constructor(private modalController: ModalController) {}

  onClose(): void {
    this.closeModal.emit();
    this.modalController.dismiss();
  }
}
