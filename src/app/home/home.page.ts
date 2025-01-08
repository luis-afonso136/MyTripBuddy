import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CriarComponent } from '../criar/criar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  viagens: any[] = [];
  viagensFiltradas: any[] = [];
  segmentoAtual: string = 'future-trips'; // Estado inicial do segmento
  apiUrl: string = 'https://mobile-api-one.vercel.app/api';
  name: string = 'luis.manuel.afonso@ipvc.pt';  // Ajuste com o seu nome
  password: string = 'T8@oXkZy';  // Ajuste com a sua senha

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.buscarViagens();  // Carregar viagens ao iniciar a página
  }

  // Buscar as viagens da API
  async buscarViagens() {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,  // Basic Authentication
    });
  
    try {
      const viagens = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/travels`, { headers }));
      console.log('Viagens recebidas da API:', viagens);  // Log para verificar as viagens
      this.viagens = viagens;
      this.filtrarViagens();  // Filtra as viagens após buscar da API
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      this.exibirErro('Erro ao buscar viagens');
    }
  }

  // Método de filtrar viagens
filtrarViagens() {
  console.log('Segmento Atual:', this.segmentoAtual);  // Verifique o valor de segmentoAtual
  console.log('Viagens antes de filtrar:', this.viagens);  // Log das viagens antes de filtrar
  
  // Verifique os valores de 'state' nas viagens
  this.viagens.forEach(viagem => {
    console.log('State da viagem:', viagem.state);  // Verifica o valor do estado de cada viagem
  });

  // Aplica o filtro com comparação mais robusta
this.viagensFiltradas = this.viagens.filter((viagem) =>
  this.segmentoAtual === 'future-trips'
    ? viagem.state?.trim().toLowerCase() === 'viagens futuras'
    : viagem.state?.trim().toLowerCase() === 'viagens já efetuadas'
);

  console.log('Viagens Filtradas:', this.viagensFiltradas);  // Verifique as viagens filtradas
}


  // Abrir o modal para criar nova viagem
  async openModal() {
    const modal = await this.modalController.create({
      component: CriarComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Dados retornados do modal:', result.data);  // Verifique os dados do modal
        this.viagens.push(result.data);  // Atualiza a lista local com a nova viagem
        this.filtrarViagens();  // Refaz a filtragem com a lista atualizada
        this.criarViagem(result.data);  // Cria a viagem na API
      }
    });

    return await modal.present();
  }

  // Criar viagem - Envia os dados para a API
  async criarViagem(viagem: any) {
    const { startAt, endAt, ...dadosViagem } = viagem; // Remover startAt e endAt para a requisição

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,  // Basic Authentication
    });

    try {
      const response = await firstValueFrom(this.http.post(`${this.apiUrl}/travels`, dadosViagem, { headers }));
      console.log('Viagem criada com sucesso!', response);
      this.viagens.push(response); // Adiciona a viagem retornada pela API à lista local
      this.filtrarViagens();  // Atualiza a lista filtrada após a criação
    } catch (error) {
      console.error('Erro ao criar viagem:', error);
      this.exibirErro('Erro ao criar viagem');
    }
  }

  // Editar viagem - Lógica para editar
  async editarViagem(viagem: any) {
    console.log('Editar viagem:', viagem);
    // Aqui você pode abrir um modal de edição com os dados da viagem e enviar um PUT para atualizar.
  }

  // Remover viagem - Lógica para remover viagem da lista e da API
  async removerViagem(viagem: any) {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${this.name}:${this.password}`)}`,  // Basic Authentication
    });

    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/travels/${viagem.id}`, { headers }));
      this.viagens = this.viagens.filter((v) => v.id !== viagem.id);  // Remove da lista local
      this.filtrarViagens();  // Refaz a filtragem
      console.log('Viagem removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover viagem:', error);
      this.exibirErro('Erro ao remover viagem');
    }
  }

  // Alterar segmento (viagens futuras ou já efetuadas)
  segmentoAlterado(event: any) {
    console.log('Valor do segmento selecionado:', event.detail.value);  // Verifique o valor do segmento
    this.segmentoAtual = event.detail.value;
    this.filtrarViagens();
  }

  // Exibir alertas de erro
  async exibirErro(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}
