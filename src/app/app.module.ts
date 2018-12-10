import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { NotinhaPage } from '../pages/notinha/notinha';
import { UserPage } from '../pages/user/user';
import { ProfilePage } from '../pages/profile/profile';
import { StatementPage } from '../pages/statement/statement';
import { PaymentPage } from '../pages/payment/payment';

// Modals
import { PaymentModalPageModule } from './../pages/payment-modal/payment-modal.module';
import { AddNotinhaModalPageModule } from './../pages/add-notinha-modal/add-notinha-modal.module';
import { AddPaymentModalPageModule } from './../pages/add-payment-modal/add-payment-modal.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

import { ServerConfig } from '../services/server';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    UserPage,
    NotinhaPage,
    ProfilePage,
    StatementPage,
    PaymentPage,
    // PaymentModalPage,
    // AddNotinhaModalPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    PaymentModalPageModule,
    AddNotinhaModalPageModule,
    AddPaymentModalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    UserPage,
    NotinhaPage,
    ProfilePage,
    StatementPage,
    PaymentPage,
    // PaymentModalPage,
    // AddNotinhaModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerConfig,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
