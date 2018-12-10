import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController
} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { ServerConfig } from '../../services/server';

import { AddNotinhaModalPage } from './../add-notinha-modal/add-notinha-modal';

/**
 * Generated class for the NotinhaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notinha',
  templateUrl: 'notinha.html',
})
export class NotinhaPage {
  public url:string;
  public owner:Array<{}>;
  public payed_by:Array<{}>;
  public participant:Array<{}>;
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
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public http: Http) {

      this.storage.get('user').then((userData) => {
        // console.log(userData);
        this.url = this.server.url;
        this.user = userData;

        this.getNotinhas(userData);
      });

      
  }

  notinhaAction(_id){
    // console.log(_id);
    let actionSheet = this.actionSheetCtrl.create({
      // title: '',
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          role: 'destructive',
          handler: () => {
            let headers = new Headers();
            headers.append('Content-type', 'application/json');

            let options = new RequestOptions({headers : headers});

            this.http.post(this.url+'/notinhas/getById', {_id : _id}, options)
            .map(res => res.json())
            .subscribe(data => {
              const modal = this.modalCtrl.create(AddNotinhaModalPage, {data: data, txtAction: 'Editar'});
              modal.present();
              modal.onDidDismiss(() => {
                this.getNotinhas(this.user);
              });
            })
            
          }
        },
        {
          text: 'Deletar',
          icon: 'trash',
          handler: () => {
            const confirm = this.alertCtrl.create({
              title: 'Você tem certeza?',
              message: 'Após deletar não será possível recuperar os dados, deseja continuar?',
              buttons: [
                {
                  text: 'Sim',
                  handler: () => {
                    let headers = new Headers();
                    headers.append('Content-type', 'application/json');

                    let options = new RequestOptions({headers : headers});

                    this.http.post(this.url+'/notinhas/delete', {_id : _id}, options)
                    .map(res => res.json())
                    .subscribe(data => {
                      this.getNotinhas(this.user);
                      const toast = this.toastCtrl.create({
                        message: data.msg,
                        duration: 3000
                      });
                      toast.present();
                    })
                  }
                },
                {
                  text: 'Não'
                }
              ]
            });
            confirm.present();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NotinhaPage');
  }

  getNotinhas(user){
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let options = new RequestOptions({headers : headers});

    var postData = {
      'user' : user.nickname
    }

    this.http.post(this.url+'/notinhas/getByOwner', postData, options)
    .map(res => res.json())
    .subscribe(data => {
      this.owner = data;
      // console.log(this.owner);
    })

    this.http.post(this.url+'/notinhas/getPayedByName', postData, options)
    .map(res => res.json())
    .subscribe(data => {
      this.payed_by = data;
      // console.log(this.participant);
    })

    this.http.post(this.url+'/notinhas/getByParticipant', postData, options)
    .map(res => res.json())
    .subscribe(data => {
      this.participant = data;
      // console.log(this.participant);
    })
  }

}
