import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  // NavParams,
  LoadingController,
  ModalController
} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { ServerConfig } from '../../services/server';

import {PaymentModalPage} from '../payment-modal/payment-modal';

import 'rxjs/add/operator/map';


/**
 * Generated class for the StatementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statement',
  templateUrl: 'statement.html',
})
export class StatementPage {
  
  public url:string;
  public statements: Array<{}>
  public user =  {
    _id : "",
    name: "",
    nickname: "",
    phone: "",
    img: "",
    admin: 0
  }

  constructor(
    public navCtrl: NavController,
    public server: ServerConfig,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public http: Http
  ) {
    this.url = this.server.url;
    const loader = this.loadingCtrl.create({
      content: "",
      dismissOnPageChange: true
    });
    

    this.storage.get('user').then((userData) => {
      loader.present();
      this.user = userData;

      this.http.get(this.url+'/statements/getAll')
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.statements = data;
        loader.dismiss();
      })
    })
  }

  getPaymentsByStatement(statementId){
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let options = new RequestOptions({headers : headers});

    var postData = {
      '_id' : statementId
    }

    this.http.post(this.url+'/payments/getAllByStatement', postData, options)
    .map(res => res.json())
    .subscribe(data => {
      // console.log(data);
      if(data){
        const modal = this.modalCtrl.create(PaymentModalPage, {'obj' : data});
        modal.present();
      }
    })
  }

  ionViewWillLoad() {
    this.url = this.server.url;
  }

  ionViewDidLoad(){
    
  }

}
