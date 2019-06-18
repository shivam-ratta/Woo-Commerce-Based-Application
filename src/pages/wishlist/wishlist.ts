import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Global } from '../../providers/global';
import { Product } from "../../models/product.models";

@Component({
	selector: 'page-wishlist ',
	templateUrl: 'wishlist.html',
	providers: [Global]
})

export class WishlistPage {
	private favorites: Array<Product>;

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, private global: Global) {
		this.favorites = global.getFavorites();
	}

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}

}
