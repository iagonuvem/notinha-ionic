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
 * Generated class for the AddNotinhaModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-notinha-modal',
  templateUrl: 'add-notinha-modal.html',
})
export class AddNotinhaModalPage {
  public txtAction:string='Adicionar';
  public url:string;
  public users:Array<any>;
  public btnEnabled:boolean = true;
  public payed_by = [];
  public participants = [];
  public notinha = {
    _id : "",
    description: "",
    total_value: 0.0,
    created_by: "",
    payed_by: [],
    participants: []
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public server: ServerConfig,
    public storage: Storage,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public loadingCtrl : LoadingController,
    public http: Http
    ) {
      this.url = this.server.url;
  }

  ionViewWillLoad(){
    this.http.get(this.url+'/users/getAll')
        .map(res => res.json())
        .subscribe(userData => {
          // console.log(data);
          this.users = userData;

          if(this.navParams.get('txtAction')){
            this.txtAction = this.navParams.get('txtAction');
          }
          else{
            this.txtAction = 'Adicionar';
          }
      
          if(this.navParams.get('data')){
            this.notinha._id = this.navParams.get('data')._id;
            this.notinha.description = this.navParams.get('data').description;
            this.notinha.total_value = this.navParams.get('data').total_value;
            this.payed_by = this.navParams.get('data').payed_by;
            this.participants = this.navParams.get('data').participants;
            
            for(var i in this.users){
              this.users[i].checkedPayed = false;
              this.users[i].checkedParticipant = false;
      
              for(var j in this.payed_by){
                if(this.users[i].nickname == this.payed_by[j].nickname){
                  this.users[i].checkedPayed = true;
                }
              }
      
              for(var j in this.participants){
                if(this.users[i].nickname == this.participants[j].nickname){
                  this.users[i].checkedParticipant = true;
                }
              }
            }
          }
        })
  }

  ionViewDidLoad() {
    
  }

  addPayer(nickname,e){
    const prompt = this.alertCtrl.create({
      title: 'Adicionar Valor Pago',
      message: "Digite o valor pago por "+nickname,
      inputs: [
        {
          name: 'amount_payed',
          placeholder: 'Valor',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Salvar',
          handler: data => {
            let payed_by = this.payed_by;
            let notinha = this.notinha;
            let alertCtrl = this.alertCtrl;
            let soma = 0.0;
            soma += parseFloat(data.amount_payed);

            new Promise(function(resolve,reject){
              if(payed_by.length != 0){
                // console.log("Não primeiro pagador");
                for(var i in payed_by){
                  soma += parseFloat(payed_by[i].amount_payed);
                }
              }
              resolve(soma);
            })
            .then(function(soma : any){
              if(soma > notinha.total_value){
                let d = parseFloat(data.amount_payed) - (soma - notinha.total_value);
                let alert = alertCtrl.create({
                  title: 'Ops...',
                  subTitle: 'Há uma inconsistência nos dados!',
                  message: nickname+' não pode pagar mais do que R$'+d,
                  buttons: ['Ok']
                });
                alert.present();
                e.checked = false;
                // console.log('valor errado!');
              }
              else{
                payed_by.push({'nickname': nickname, 'amount_payed': data.amount_payed});
              }
            })
          }
        }
      ],
      enableBackdropDismiss: false
    });
    

    if(e.checked == true){
      prompt.present();
    }
    else{
      for(var i in this.payed_by){
        if(this.payed_by[i].nickname == nickname){
          // delete this.payed_by[i];
          this.payed_by.splice(parseInt(i),1)
        }
      }
      // console.log(this.payed_by);
    }
  }

  addParticipant(nickname,e){
    if(e.checked == true){
      this.participants.push({'nickname': nickname, 'amount_to_pay': '0'});
    }
    else{
      for(var i in this.participants){
        if(this.participants[i].nickname == nickname){
          this.participants.splice(parseInt(i),1)
        }
      }
      // console.log(this.participants);
    }
  }

  save(){
    this.btnEnabled = false;
    const loader = this.loadingCtrl.create({
      content: "",
      dismissOnPageChange: true
    });
    loader.present();
    
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    let options = new RequestOptions({headers : headers});

    this.storage.get('user').then((userData) => {
      this.notinha.created_by = userData.nickname;
      this.notinha.participants = this.participants;
      this.notinha.payed_by = this.payed_by;
      let soma = 0.0;

      for(var i in this.notinha.payed_by){
        soma += parseFloat(this.notinha.payed_by[i].amount_payed);  
      }
      
      if(this.notinha.participants.length == 0 || this.notinha.payed_by.length == 0 || this.notinha.total_value == 0 || this.notinha.description == ''){
        let alert = this.alertCtrl.create({
          title: 'Ops...',
          subTitle: 'Verifique se você preencheu todos os dados corretamente!',
          buttons: ['Ok']
        });
        alert.present();
        loader.dismiss();
        this.btnEnabled = true;
      }
      else if(soma != this.notinha.total_value){
        let alert = this.alertCtrl.create({
          title: 'Ops...',
          subTitle: 'Não há pagadores suficientes para o valor total da notinha',
          buttons: ['Ok']
        });
        alert.present();
        loader.dismiss();
        this.btnEnabled = true;
      }
      else{
        // Atualizar
        if(this.notinha._id != null && this.notinha._id != ''){
          this.http.post(this.url+'/notinhas/update', this.notinha, options)
          .map(res => res.json())
          .subscribe(data => {
            // console.log(data);
            const toast = this.toastCtrl.create({
              message: data.msg,
              duration: 3000,
              position: 'top'
            });
            this.http.post(this.url+'/notinhas/getBalanceByName', {user : userData.nickname} , options)
            .map(res => res.json())
            .subscribe(balance => {
              // console.log(data);
              toast.present();
              loader.dismiss();
              this.viewCtrl.dismiss(balance);
            })
          })
        }
        // Inserir nova
        else{
          this.http.post(this.url+'/notinhas/insert', this.notinha, options)
          .map(res => res.json())
          .subscribe(data => {
            // console.log(data);
            const toast = this.toastCtrl.create({
              message: data.msg,
              duration: 3000,
              position: 'top'
            });
            this.http.post(this.url+'/notinhas/getBalanceByName', {user : userData.nickname} , options)
            .map(res => res.json())
            .subscribe(balance => {
              // console.log(data);
              toast.present();
              loader.dismiss();
              this.viewCtrl.dismiss(balance);
            })
          })
        }
        
      }

    })
    
  }
}
