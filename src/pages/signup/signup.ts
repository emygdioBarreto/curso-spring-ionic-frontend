import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertCtlr: AlertController) {
      this.formGroup = this.formBuilder.group({
        nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
        tipo: ['1', [Validators.required]],
        cpfOuCnpj: ['64467051074', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['123', [Validators.required]],
        logradouro: ['Rua do Joaquim', [Validators.required]],
        numero: ['S/N', [Validators.required]],
        complemento: ['', []],
        bairro: ['', []],
        cep: ['50100180', [Validators.required]],
        telefone1: ['22224444', [Validators.required]],
        telefone2: ['', []],
        telefone3: ['', []],
        estadoId: [null, [Validators.required]],
        cidadeId: [null, [Validators.required]]
      })
  }

  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(Response => {
        this.estados = Response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
        this.updateCidades();
      },
      error => {})
  }

  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id)
      .subscribe(Response => {
        this.cidades = Response;
        this.formGroup.controls.cidadeId.setValue(null);
      },
      error => {});
  }

  signupUser() {
    this.clienteService.insert(this.formGroup.value)
      .subscribe(Response => {
        this.showInsertOk();
      },
      error => {});
  }

  showInsertOk() {
    let alert = this.alertCtlr.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
}
