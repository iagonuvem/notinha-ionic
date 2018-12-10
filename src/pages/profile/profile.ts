import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions} from '@angular/http';
import { ServerConfig } from '../../services/server';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public url:string;
  public userUpdate = {
    _id: "",
    name: "",
    nickname: "",
    phone: "",
    img:"",
    password: ""
  }
  public user : {
    _id: "",
    name: "",
    nickname: "",
    phone: "",
    img:"",
    password: ""
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private server: ServerConfig,
    public http: Http,
    public toastCtrl: ToastController
    ) {
      this.url = this.server.url;

      this.storage.get('user').then((userData) => {
        this.user = userData;
        this.userUpdate._id = userData._id;
        // console.log(this.user);
      })
  }

  updateUser(userUpdate){
    // console.log(userUpdate);
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let options = new RequestOptions({headers : headers});

    if(userUpdate.name == null || userUpdate.name == '' ){
      delete userUpdate.name;
    }

    if(userUpdate.nickname == null || userUpdate.nickname == '' ){
      delete userUpdate.nickname;
    }

    if(userUpdate.img == null || userUpdate.img == '' ){
      delete userUpdate.img;
    }
    
    if(userUpdate.phone == null || userUpdate.phone == '' ){
      delete userUpdate.phone;
    }

    if(userUpdate.password == null || userUpdate.password == '' ){
      delete userUpdate.password;
    }

    // console.log(userUpdate);
    this.http.post(this.url+'/users/update', userUpdate, options)
    .map(res => res.json())
    .subscribe(data => {
      // console.log(data);
      const toast = this.toastCtrl.create({
        message: data.msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }
  
  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProfilePage');
  }

}
