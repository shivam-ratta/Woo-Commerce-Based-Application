import {Injectable} from "@angular/core";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {HmacSHA512} from 'crypto-js'

/**
 * Created by work on 20/11/17.
 */

var ap;
@Injectable()
export class AtomPaynetz {

  //iab:InAppBrowser;
  //HmacSHA512:any;
  browser:any;
  callback:any;
  config:any;
  response:any;
  constructor(public iab:InAppBrowser){
   // this.iab = iab;
    //this.HmacSHA512 = HmacSHA512;
    console.log(HmacSHA512);
    ap=this;

  }

  getResponse(){
    return this.response;
  }

  pay(config,data, callback){
    this.callback=callback;
    this.config = config;
    if(config["mode"] == "live"){
      config["url"] = "https://payment.atomtech.in/paynetz/epi/fts";
      config["ru"] = "https://payment.atomtech.in/mobilesdk/param";
    } else {
      config["url"] = "https://paynetzuat.atomtech.in/paynetz/epi/fts";
      config["ru"] = "https://paynetzuat.atomtech.in/mobilesdk/param";
    }
    if(this.validate(config,data)){
        let url = this.generateUrl(config, data);
        this.browser = this.iab.create(url,"_blank",{
            "location":"yes",
            "clearcache":"yes",
            "hardwareback":"no"
        });

      this.browser.on("loadstop")
        .subscribe(
          (event) => {
            console.log(event);
            var expr = /\/mobilesdk\/param/;  // no quotes here
            if(expr.test(event.url)){
               //alert(event.url);
              this.browser.executeScript({code:"document.getElementsByTagName('h5')[0].innerHTML"}, this.parseResponse);
            }
          },
          err => {
            console.log(event);
          });

    }
  }
  parseResponse(params) {
    if(params){
      console.log(params);
      if(params instanceof Array){
        let responseStr = params[0];
        console.log(responseStr);
        let resTArr = responseStr.split("|");
        let rParams = {};
        for(let i =0;i < resTArr.length;i++){
          let paramMap = resTArr[i];
          var expr = /=/;
          if(expr.test(paramMap)){
            let pMap = paramMap.split("=");
            rParams[pMap[0]] = pMap[1];
          }
        }
        ap.response=rParams;
        if(!ap.validateResponse()){
          //ap.response={};
        }
        console.log(rParams);
      }
    }
    ap.browser.close();
    ap.callback(ap.response);
 }

  validateResponse(){
    if(!ap.response){
      return false;
    } else {

      let str = ap.response["mmp_txn"]+ap.response["mer_txn"]+ap.response["f_code"]+ap.response["prod"]+ap.response["discriminator"]+ap.response["amt"]+ap.response["bank_txn"];
      //let str =response["login"] + config["pass"] +"NBFundTransfer" + config["prodid"] + data["txnid"] + data["amt"] + "INR";
      let signature =  HmacSHA512(str, ap.config["resHashKey"]).toString();
      //alert(signature+"===>" + ap.response["signature"]);
      if(signature == ap.response["signature"]){
        return true;
      } else {
        return false;
      }
    }
  }
  generateUrl(config, data){
    let url = config["url"];
    url = url + "?";
    url = url + "login=" + config["login"];
    url = url + "&pass=" + config["pass"];
    url = url + "&prodid=" + config["prodid"];

    for(let d in data){
      url = url + "&" +d + "=" + data[d];
    }
    url = url + "&txnscamt=0";
    url = url + "&custacc=12345678";

    url = url + "&signature=" + this.generateChecksum(config,data);
    url = url + "&ru=" + config["ru"];
    console.log(url);
    return url;

  }

  generateChecksum(config,data){
    let str =config["login"] + config["pass"] +"NBFundTransfer" + config["prodid"] + data["txnid"] + data["amt"] + "INR";
    //let signature =
    let signature =  HmacSHA512(str, config["reqHashKey"]).toString();
    return signature;
  }


  validate(config,data){
    if(!config){
      alert("Please provide atom config");
      return false;
    }
    if(!config["login"]){
      alert("Invalid config param: login");
      return false;
    }
    if(!config["pass"]){
      alert("Invalid config param: pass");
      return false;
    }
    if(!config["prodid"]){
      alert("Invalid config param: prodid");
      return false;
    }    if(!config["reqHashKey"]){
      alert("Invalid config param: reqHashKey");
      return false;
    }
    if(!config["resHashKey"]){
      alert("Invalid config param: resHashKey");
      return false;
    }

    if(!data["amt"]){
      alert("Invalid param: amount");
      return false;
    }

    if(!data["txnid"]){
      alert("Invalid param: txnid");
      return false;
    }

    return true;

  }
}
