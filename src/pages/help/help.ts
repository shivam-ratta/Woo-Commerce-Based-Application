import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-help ',
  templateUrl: 'help.html'
})
export class HelpPage {
  private faqExpand1: boolean;
  private faqExpand2: boolean;
  private faqExpand3: boolean;
  private faqExpand4: boolean;

  constructor(public navCtrl: NavController, public translate: TranslateService, public modalCtrl: ModalController) {

  }

  faqExpandToggle1() {
    this.faqExpand1 = !this.faqExpand1;
  }

  faqExpandToggle2() {
    this.faqExpand2 = !this.faqExpand2;
  }

  faqExpandToggle3() {
    this.faqExpand3 = !this.faqExpand3;
  }

  faqExpandToggle4() {
    this.faqExpand4 = !this.faqExpand4;
  }

  cartPage() {
    let modal = this.modalCtrl.create(CartPage);
    modal.present();
  }

}
