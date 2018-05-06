# api-call-examples
Some examples for calls Inbest API
HOST: "http://inbest-app-dev.firebaseapp.buy.com"

To use this example you have to configure your localhost to use the url http://inbest-app-dev.firebaseapp.buy.com.
On linux configure /etc/hosts adding this line 
127.0.1.1       inbest-app-dev.firebaseapp.buy.com

Without this facebook login won't work.


### Errors
http 403 code: Invalid token

### Login

##### Login with Facebook (And Register)
HTTP POST
Url: "https://inbest-app-dev.firebaseapp.com/api/v1/login"
Data: 
```
{
type: 'facebook',
accessToken: 'user access token'
}
```
Response: 
```
SUCCESS: 
{success: true, token: 'token'}
ERROR: 
{success: false, message: 'message'}
```

Full example in login.html and login.js

##### Login with Google (And Register)
 HTTP POST
 Url: "https://inbest-app-dev.firebaseapp.com/api/v1/login"
 Data: 
 ```
 {
 type: 'google',
 accessToken: 'user access token'
 }
 ```
 Response: 
 ```
 SUCCESS: 
 {success: true, token: 'token'}
 ERROR: 
 {success: false, message: 'message'}
 ```

### Get Profile
HTTP GET
Url: "https://inbest-app-dev.firebaseapp.com/api/v1/profile"
Header: "Authorization Bearer TokenFromLogin"
Response:
 ```
 SUCCESS: 
 {success: true, profile: 
 	{
 		"email":"francisco@inbest.today",
 		"photoURL":"https://graph.facebook.com/10155415909851787/picture?height=500&width=500",
 		"name":"Francisco Memoli",
 		"balances":{
 				"live":"0",
 				"demo":"100"
 			}
 	}
 }
 ERROR: 
 {success: false, message: 'message'}

 ```


### Mercado pago buy
add resource
  <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>

Init mercadopago

    Mercadopago.clearSession();
    Mercadopago.setPublishableKey(mercadoPagoConfig.publickey);
    Mercadopago.getIdentificationTypes((code, data) => {
      this.docTypes = data;
      this.creditCard.docType = this.docTypes[0].id;
    });


#### create credit card token
  doPayment() {
    let that = this;
    let cardToSend = {
      cardNumber: this.creditCard.number,
      securityCode: this.creditCard.cvv,
      cardExpirationMonth: this.creditCard.expMonth,
      cardExpirationYear: this.creditCard.expYear,
      cardholderName: this.creditCard.name,
      docType: this.creditCard.docType,
      docNumber: this.creditCard.dni
    };
    Mercadopago.createToken(cardToSend, function (responseCode, response) {
      if (responseCode == 200) {
        let cardToken = response.id;
        that.executePayment(cardToken)
      } else {
      	console.log("error")
      	console.log(response)
      }
    });
  }

  executePayment(cardToken) {
    let that = this;
    Mercadopago.getPaymentMethod({
      "bin": that.creditCard.number
    }, function (responseCodePaymentMethod, responsePaymentMethod) {
      if (responseCodePaymentMethod == 200) {
        console.log('responsePaymentMethod', responsePaymentMethod);
        let payment = {
          email: that.getCurrentUser().email,
          amount: that.quantity,
          token: cardToken,
          payment_method_id: responsePaymentMethod[0].id
        };
        //Create payment on by inbet api.
	    let url = firebaseConfig.apiDomain + '/api/payment/pay';
	    this.http.post(url, payment).then((data) => {
          if ((<any>data).status == "completed" || (<any>data).status == "pending") {
            console.log("success")
          }
          console.log('data respnse payment', data);
        }, responseError => {
          console.log(responseError);
        });
      } else {
        console.log('payment.card_error')
      }
    });
  }
