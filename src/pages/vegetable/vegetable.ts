import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ShortPage } from '../short/short';
import { CartPage } from '../cart/cart';
import { FilterPage } from '../filter/filter';
import { SearchPage } from '../search/search';
import { ItemdetailPage } from '../itemdetail/itemdetail';
@Component({
  selector: 'page-vegetable ',
  templateUrl: 'vegetable.html'
})
export class VegetablePage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  
   vegetableitems = [
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-1.jpg",
      prices: "1.50",
   },
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-2.jpg",
      prices: "1.50",
   },
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-3.jpg",
      prices: "1.50",
   },
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-4.jpg",
      prices: "1.50",
   },
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-5.jpg",
      prices: "1.50",
   },
   {
      names: "Fresh Onion - Medium Red 1kg",
      market: "Grocer market",
      image: "assets/imgs/veg-6.jpg",
      prices: "1.50",
   }
   
   ];
  
  shortPage() {
    let modal = this.modalCtrl.create(ShortPage);
    modal.present();
  }
          
    filterPage() {
    let modal = this.modalCtrl.create(FilterPage);
    modal.present();
  }
  
  searchPage() {
    let modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
  
  cartPage() {
    let modal = this.modalCtrl.create(CartPage);
    modal.present();
  }
 
  itemdetailPage() {
    this.navCtrl.push(ItemdetailPage);
  }
}
