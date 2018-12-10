import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-modal',
  templateUrl: 'payment-modal.html',
})
export class PaymentModalPage {
  public checked:string = "true"
  public paymentsChecked:any = []
  public paymentsUnchecked:any = []

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
      for(var i in this.navParams.data.obj){
        if(this.navParams.data.obj[i].checked == true){
          this.paymentsChecked.push(this.navParams.data.obj[i]);
        }
        else{
          this.paymentsUnchecked.push(this.navParams.data.obj[i]);
        }
      }
}

  ionViewDidLoad() {
  }

}
