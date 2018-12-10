import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNotinhaModalPage } from './add-notinha-modal';

@NgModule({
  declarations: [
    AddNotinhaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNotinhaModalPage),
  ],
})
export class AddNotinhaModalPageModule {}
