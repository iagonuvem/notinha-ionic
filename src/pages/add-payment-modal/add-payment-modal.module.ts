import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPaymentModalPage } from './add-payment-modal';

@NgModule({
  declarations: [
    AddPaymentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPaymentModalPage),
  ],
})
export class AddPaymentModalPageModule {}
