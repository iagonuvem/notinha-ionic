import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  AlertController,
  ToastController,
  LoadingController,
  ViewController
} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { ServerConfig } from '../../services/server';

/**
 * Generated class for the AddPaymentModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-payment-modal',
  templateUrl: 'add-payment-modal.html',
})
export class AddPaymentModalPage {
  public url:string;
  public user = {
    balance: 0.0,
    nickname: "",
    _id: ""
  };
  public users:Array<any>;
  public btnEnabled:boolean=false;
  public payment = {
    statement_id: '',
    payer_id : '',
    payer_name : '',
    receiver_id : '',
    receiver_name: '',
    amount: 0.0
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public server: ServerConfig,
    public storage: Storage,
    public loadingCtrl : LoadingController,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public http: Http) {
      this.url = this.server.url;

  }

  save(){
    this.btnEnabled = false;
    const loader = this.loadingCtrl.create({
      content: "",
      dismissOnPageChange: true
    });
    loader.present();

    this.storage.get('user').then((userData) => {
      let headers = new Headers();
      headers.append('Content-type', 'application/json');

      let options = new RequestOptions({headers : headers});

      this.http.post(this.url+'/statements/getBalanceById', {'_id' : this.payment.statement_id}, options)
      .map(res => res.json())
      .subscribe(data => {
        for(var i in data.statement){
          if(data.statement[i].name == this.payment.receiver_name){
            if(this.payment.amount > data.statement[i].balance){
              let alert = this.alertCtrl.create({
                title: 'Ops...',
                subTitle: 'Há uma inconsistência nos dados!',
                message: 'Você não pode pagar para '+this.payment.receiver_name+' mais do que R$'+data.statement[i].balance,
                buttons: ['Ok']
              });
              loader.dismiss();
              alert.present();
              this.btnEnabled = true;
            }
            else{
              this.payment.amount = parseFloat(this.payment.amount.toString());
              let postData = this.payment;
              this.http.post(this.url+'/payments/insert', postData , options)
              .map(res => res.json())
              .subscribe(data => {
                const toast = this.toastCtrl.create({
                  message: data.msg,
                  duration: 3000,
                  position: 'top'
                });
                this.viewCtrl.dismiss();
                loader.dismiss();
                toast.present();
              })
            }
          }
        }
        
      })

      this.http.post(this.url+'/users/getByName', {'nickname' : this.payment.receiver_name}, options)
      .map(res => res.json())
      .subscribe(data => {
        this.payment.receiver_id = data._id;
      })

      this.http.post(this.url+'/users/getByName', {'nickname' : userData.nickname}, options)
      .map(res => res.json())
      .subscribe(data => {
        this.payment.payer_id = data._id;
        this.payment.payer_name = data.nickname;
      })

      
    })
    
  }

  ionViewWillLoad() {
    this.storage.get('user').then((userData) => {
      this.user.nickname = userData.nickname;
      this.user._id = userData._id;
      
      let headers = new Headers();
      headers.append('Content-type', 'application/json');

      let options = new RequestOptions({headers : headers});
      
      this.http.post(this.url+'/statements/getBalanceByUser', {'user' : userData.nickname}, options)
      .map(res => res.json())
      .subscribe(data => {
        this.user.balance = data.balance;
      })

      this.http.get(this.url+'/statements/getCurrent')
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if(data != undefined){
          this.payment.statement_id = data._id;
          this.users = [];
          for(var i in data.statement){
            this.http.post(this.url+'/statements/getBalanceByUserStatement', {'user' : data.statement[i].name, '_id' : data._id}, options)
            .map(res => res.json())
            .subscribe(balanced => {
              // console.log(balanced);
              if(balanced.name != this.user.nickname && balanced.balance > 0){
                this.users.push(balanced);             
              }
              if(balanced.name == this.user.nickname && balanced.balance < 0){
                this.btnEnabled = true;
              }
              // this.user.balance = data.balance;
            })

            // if(data.statement[i].name != this.user.nickname &&  data.statement[i].balance > 0){
            //   this.users.push(data.statement[i]);
            // }
          }
        }
      })
    
    })
    
    // console.log('ionViewDidLoad AddPaymentModalPage');
  }

}
