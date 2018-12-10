import { Component } from '@angular/core';
import { 
  NavController, 
  ModalController, 
  NavParams,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { ServerConfig } from '../../services/server';

import { AddNotinhaModalPage } from './../add-notinha-modal/add-notinha-modal';
import { AddPaymentModalPage } from './../add-payment-modal/add-payment-modal';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private url:string;
  public paymentEnabled:boolean=false;
  public balance: Array<{}>
  public notinha = {

  }
  public user: {
    _id : "",
    name: "",
    nickname: "",
    phone: "",
    img: "",
    admin: 0
  }
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private server: ServerConfig,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public http: Http
    ) {
      
  }

  modalNotinha(){
    const modal = this.modalCtrl.create(AddNotinhaModalPage);
    modal.onDidDismiss(data => {
      // console.log(data);
      if(data){
        this.balance = data;
      }
    });
    modal.present();
  }

  insertStatement(){
    const prompt = this.alertCtrl.create({
      title: 'Fechar Fatura',
      message: "Insira a data limite de pagamento, após fechar a fatura será aberta uma nova automaticamente.",
      inputs: [
        {
          name: 'date_close',
          placeholder: 'Data Limite de Pagamento',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Fechar Fatura',
          handler: data => {
            const loader = this.loadingCtrl.create({
              duration: 5000
            });
            loader.present();
            let headers = new Headers();
            headers.append('Content-type', 'application/json');

            let options = new RequestOptions({headers : headers});

            this.http.post(this.url+'/statements/insert', data, options)
            .map(res => res.json())
            .subscribe(data => {
              // console.log(data);
              const toast = this.toastCtrl.create({
                message: data.msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
              loader.dismiss();
              let headers = new Headers();
              headers.append('Content-type', 'application/json');

              let options = new RequestOptions({headers : headers});

              var postData = {
                'user' : this.user.nickname
              }

              this.http.post(this.url+'/notinhas/getBalanceByName', postData, options)
              .map(res => res.json())
              .subscribe(data => {
                // console.log(data);
                this.balance = data;
              })
            })
          }
        }
      ]
    });
    prompt.present();
  }

  modalPayment(){
    const modal = this.modalCtrl.create(AddPaymentModalPage);
    modal.present();
  }

  ionViewWillEnter(){
    this.storage.get('user').then((userData) => {
      // console.log(userData);
      this.url = this.server.url;
      this.user = userData;

      let headers = new Headers();
      headers.append('Content-type', 'application/json');

      let options = new RequestOptions({headers : headers});

      var postData = {
        'user' : this.user.nickname
      }

      this.http.post(this.url+'/notinhas/getBalanceByName', postData, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.balance = data;
      })

      this.http.get(this.url+'/statements/getCurrent')
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if(data != undefined){
          for(var i in data.statement){
            if(data.statement[i].name == this.user.nickname && data.statement[i].balance < 0){
              this.paymentEnabled = true;
            }
          }
        }
      })
    });
  }

}
