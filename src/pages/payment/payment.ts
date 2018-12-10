import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  ToastController,
  LoadingController,
  ActionSheetController,
  ViewController
} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { ServerConfig } from '../../services/server';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  public url:string;
  public payed:Array<any>;
  public received:Array<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public server: ServerConfig,
    public storage: Storage,
    public loadingCtrl : LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public http: Http
    ) {
      this.url = this.server.url;

      let headers = new Headers();
      headers.append('Content-type', 'application/json');

      let options = new RequestOptions({headers : headers});

      this.storage.get('user').then((userData) => {
        this.http.post(this.url+'/payments/getAllByPayerName', {user : userData.nickname} , options)
        .map(res => res.json())
        .subscribe(data => {
          // console.log(data);
          this.payed = data;
        })

        this.http.post(this.url+'/payments/getAllByReceiverName', {user : userData.nickname} , options)
        .map(res => res.json())
        .subscribe(data => {
          // console.log(data);
          this.received = data;
        })
      })
      
  }

  checkPayment(_id){
    let actionSheet = this.actionSheetCtrl.create({
      // title: '',
      buttons: [
        {
          text: 'Checar Pagamento',
          icon: 'checkmark-circle',
          handler: () => {
            const loader = this.loadingCtrl.create({
              content: "",
              dismissOnPageChange: true
            });
            loader.present();
        
            let headers = new Headers();
            headers.append('Content-type', 'application/json');
        
            let options = new RequestOptions({headers : headers});
        
            this.http.post(this.url+'/payments/check', {_id : _id} , options)
                .map(res => res.json())
                .subscribe(data => {
                  if(data.success == true){
                    this.storage.get('user').then((userData) => {
                      this.http.post(this.url+'/payments/getAllByReceiverName', {user : userData.nickname} , options)
                      .map(res => res.json())
                      .subscribe(data => {
                        // console.log(data);
                        this.received = data;
                      })
                    })
                  }
                  
                  const toast = this.toastCtrl.create({
                    message: data.msg,
                    duration: 2000,
                    position: 'top'
                  });
                  loader.dismiss();
                  toast.present();
                })
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
    // console.log('ionViewDidLoad PaymentPage');
  }

}
