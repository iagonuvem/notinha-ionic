import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { NotinhaPage } from '../pages/notinha/notinha';
import { UserPage } from '../pages/user/user';
import { ProfilePage } from '../pages/profile/profile';
import { StatementPage } from '../pages/statement/statement';
import { PaymentPage } from '../pages/payment/payment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public storage: Storage, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Faturas', component: StatementPage },
      { title: 'Minhas Notinhas', component: NotinhaPage },
      { title: 'Meus Pagamentos', component: PaymentPage },
      { title: 'Meus Dados', component: ProfilePage },
      { title: 'Usuários', component: UserPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.storage.clear().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
}
