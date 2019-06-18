import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Constants } from "../../models/constants.models";
import { Address } from "../../models/address.models";
import { UserResponse } from "../../models/user-response.models";
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-address ',
	templateUrl: 'address.html'
})
export class AddressPage {
	private address = new Address();
	private addresses: Array<Address>;

	constructor(public translate: TranslateService, public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController, private toastCtrl: ToastController) {
		let address: Address = this.navParams.get('address');
		if (address != null) {
			this.address = address;
		} else {
			this.address.id = -1;
			let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
			if (user != null) {
				this.address.first_name = user.first_name;
				this.address.last_name = user.last_name;
				this.address.email = user.email;
				this.address.phone = user.username;
			}
		}
		this.addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
	}

	saveAddress() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (!this.address.first_name || !this.address.first_name.length) {
			this.translate.get('field_error_name_first').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.last_name || !this.address.last_name.length) {
			this.translate.get('field_error_name_last').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.email || this.address.email.length <= 5 || !reg.test(this.address.email)) {
			this.translate.get('field_error_email').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.phone || !this.address.phone.length) {
			this.translate.get('field_error_phone').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.address_1 || !this.address.address_1.length) {
			this.translate.get('field_error_address_line1').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.address_2 || !this.address.address_2.length) {
			this.translate.get('field_error_address_line2').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.city || !this.address.city.length) {
			this.translate.get('field_error_city').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.state || !this.address.state.length) {
			this.translate.get('field_error_state').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.postcode || !this.address.postcode.length) {
			this.translate.get('field_error_postalcode').subscribe(value => {
				this.showToast(value);
			});
		} else if (!this.address.country || !this.address.country.length) {
			this.translate.get('field_error_country').subscribe(value => {
				this.showToast(value);
			});
		} else {
			if (this.address.id == -1) {
				if (!this.addresses) {
					this.addresses = new Array<Address>();
				}
				this.address.id = this.addresses.length + 1;
				this.addresses.push(this.address);
			} else {
				let index = -1;
				for (let i = 0; i < this.addresses.length; i++) {
					if (this.address.id == this.addresses[i].id) {
						index = i;
						break;
					}
				}
				if (index != -1) {
					this.addresses[index] = this.address;
				}
			}
			window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(this.addresses));
			this.navCtrl.pop();
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
}
