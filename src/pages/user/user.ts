import { Component } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerConfig } from '../../services/server';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  public url:string;
  public users:Array<{}>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private server: ServerConfig,
    public http: Http) {
      this.url = this.server.url;
      let headers = new Headers();
      headers.append('Content-type', 'application/json');
      let options = new RequestOptions({headers : headers});
      
      this.http.get(this.url+'/users/getAll')
      .map(res => res.json())
      .subscribe(data => {
        this.users = data;
        // loader.dismiss();
      })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad UserPage');
  }

}
