define(["modules/jquery-mozu","underscore","modules/backbone-mozu","modules/api","hyprlivecontext","hyprlive"],function(e,n,i,t,a,o){var l=i.MozuModel.extend({mozuType:"order",awsData:null,handlesMessages:!0,initialize:function(){n.bindAll(this,"submit")},applyShippingMethods:function(e){var i=this;i.apiModel.getShippingMethods().then(function(t){0===t.length&&i.onCheckoutError(o.getLabel("awsNoShippingOptions"));var a="";e&&(a=n.findWhere(t,{shippingMethodCode:e})),a&&a.shippingMethodCode||(a=n.min(t,function(e){return e.price}));var l=i.get("fulfillmentInfo");l.shippingMethodCode=a.shippingMethodCode,l.shippingMethodName=a.shippingMethodName,i.apiModel.update({fulfillmentInfo:l}).then(function(){i.set("fulfillmentInfo",l),i.applyBilling()})})},applyBilling:function(){var e=this;return t.all.apply(t,n.map(n.filter(e.apiModel.getActivePayments(),function(e){return"StoreCredit"!==e.paymentType&&"GiftCard"!==e.paymentType}),function(n){return e.apiVoidPayment(n.id)})).then(function(){return e.apiGet()}).then(function(n){return console.log(n),e.applyPayment()})},applyPayment:function(){var e=this;if(e.get("amountRemainingForPayment")<0)return e.trigger("awscheckoutcomplete",e.id),void 0;var n={newBillingInfo:{paymentType:"PayWithAmazon",paymentWorkflow:"PayWithAmazon",card:null,billingContact:{email:e.get("fulfillmentInfo").fulfillmentContact.email},orderId:e.id,isSameBillingShippingAddress:!1},externalTransactionId:e.awsData.awsReferenceId};e.apiCreatePayment(n).then(function(){e.trigger("awscheckoutcomplete",e.id),e.isLoading(!1)},function(){e.isLoading(!1)})},submit:function(){var e=this;e.isLoading(!0);var n=e.get("fulfillmentInfo"),i=n.shippingMethodCode;null===e.awsData?e.awsData=n.data:n.data=e.awsData,e.apiUpdateShippingInfo(n).then(function(n){e.set("fulfillmentInfo",n.data),e.apiModel.data.requiresFulfillmentInfo?e.applyShippingMethods(i):e.applyBilling()})},onCheckoutError:function(e){var n=this,i={};throw n.isLoading(!1),i={items:[{message:e||o.getLabel("unknownError")}]},this.trigger("error",i),i}});return{AwsCheckoutPage:l}});