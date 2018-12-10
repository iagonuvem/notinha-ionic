import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import {  IonicPage, 
          NavController, 
          NavParams, 
          ToastController,
          LoadingController
} from 'ionic-angular';

import { ServerConfig } from '../../services/server';

import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private url:string;
  private login:string;
  private password:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public server: ServerConfig,
    private storage: Storage,
    public http: Http
    ) {
      this.url = this.server.url;
  }

  AttemptLogin() {
    // console.log(this.login);
    // console.log(this.senha);
    const loader = this.loadingCtrl.create({
      content: "",
      dismissOnPageChange: true
    });
    loader.present();
    
    
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let options = new RequestOptions({headers : headers});

    // let postData = new FormData();
    // postData.append('user', 'activia');

    var postData = {
      "login" : this.login,
      "password" : this.password
    }

    this.http.post(this.url+'/users/login', postData, options)
    .map(res => res.json())
    .subscribe(data => {
      if(data.ok == 0){
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: data.msg,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      else{
        this.storage.clear().then(() => {
          this.storage.set('user', data.data);
          this.navCtrl.setRoot(HomePage,data.data);
        });
      }
    })
  }

  ionViewWillLeave(){
    
  }
}
