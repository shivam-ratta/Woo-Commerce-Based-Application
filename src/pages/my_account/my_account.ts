import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { Address } from "../../models/address.models";
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { AddressSelectPage } from '../addressselect/addressselect';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { WordpressClient } from '../../providers/wordpress-client.service';

@Component({
	selector: 'page-my_account ',
	templateUrl: 'my_account.html',
	providers: [WordpressClient]
})
export class My_accountPage {
	account: string = "profile";
	private user: UserResponse;
	private selectedAddress: Address;
	private addressChangeText = 'Change';
	private subscriptions: Array<Subscription> = [];

	constructor(public navCtrl: NavController, private toastCtrl: ToastController, private service: WordpressClient, public translate: TranslateService, public modalCtrl: ModalController) {
		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
	}

	ionViewDidEnter() {
		this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
		this.translate.get(this.selectedAddress == null ? 'add' : 'change').subscribe(value => {
			this.addressChangeText = value;
		});
	}

	updateInfo() {
		if (!this.user.first_name || !this.user.first_name.length) {
			this.translate.get('field_error_name_first').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.user.last_name || !this.user.last_name.length) {
			this.translate.get('field_error_name_last').subscribe(value => {
				this.showToast(value);
			});
		} else {
			this.translate.get('updated').subscribe(value => {
				this.showToast(value);
			});
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(this.user));
			let subscription: Subscription = this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), { first_name: this.user.first_name, last_name: this.user.last_name }).subscribe(data => {
			}, err => {
			});
			this.subscriptions.push(subscription);
		}
	}

	showToast(message: string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}

	addressPage() {
		this.navCtrl.push(AddressSelectPage, { action: 'choose' });
	}

	isReadonly() {
		return true;
	}

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}


	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.present();
	}
}
