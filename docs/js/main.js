!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e){console.log("Hello webpack!"),console.log(`The time is ${new Date}`),window.onclick=function(t){if(!t.target.matches(".dropdownIcon"))for(var e=document.getElementsByClassName("dropdown-content"),n=0;n<e.length;n++){var o=e[n];o.classList.contains("show")&&o.classList.remove("show")}};var n=function(){function t(t,e,n){this.name=t,this.price=e,this.count=n}cartStorage=[],nodes=[];var e={addProduct:function(e,n,o,r){for(var a in cartStorage)if(cartStorage[a].name===n)return void cartStorage[a].count++;var c=new t(n,o,r);cartStorage.push(c),document.getElementById("cont1").appendChild(e),nodes.push(e)},removeOneProduct:function(t,e){for(var n in cartStorage)if(cartStorage[n].name===e){if(cartStorage[n].count--,cartStorage[n].count<=0)for(var o in cartStorage.splice(n,1),nodes)nodes[o].childNodes[3].getAttribute("data-name")==t.childNodes[3].getAttribute("data-name")&&(document.getElementById("cont1").removeChild(nodes[o]),nodes.splice(o,1));return}},clearCart:function(){for(var t in cartStorage.splice(0,cartStorage.length),nodes)document.getElementById("cont1").removeChild(nodes[t]);nodes=[]},totalSum:function(){var t=0;for(var e in cartStorage)t+=cartStorage[e].price*cartStorage[e].count;return Number(t.toFixed(2))}};return e}();function o(t,e,n){for(var o in cartStorage)cartStorage[o].name==e&&(t.childNodes[5].innerHTML=e+"&nbsp&nbsp Total: "+(cartStorage[o].count+n))}$(".clearCart").click((function(){n.clearCart(),$(".totalSum").html("Total sum: "+n.totalSum()+"$")})),$(".btn-buy").click((function(t){t.preventDefault();var e=$(this).parent().data("name"),r=Number($(this).parent().data("price")),a=t.target.parentNode.parentNode.cloneNode(!0),c=document.createElement("button"),i=document.createElement("button");for(var d in c.className="btn btn-danger btn-md minus-count",i.className="btn btn-success btn-md plus-count",i.innerHTML="+",c.innerHTML="-",a.childNodes[3].childNodes[1].replaceWith(c),a.childNodes[3].appendChild(i),nodes)nodes[d].childNodes[3].getAttribute("data-name")==e&&o(nodes[d],e,1);n.addProduct(a,e,r,1),$(".totalSum").html("Total sum: "+n.totalSum()+"$");var u=window.innerWidth>0?window.innerWidth:screen.width;newcart=u<1270?$(".dropdownIcon"):$(".open-cart");var l=$(this).parent().parent(".card").find("img").eq(0);l&&l.clone().offset({top:l.offset().top,left:l.offset().left}).css({opacity:"0.5",position:"absolute",height:"200px",width:"200px","z-index":"100","border-radius":"15%"}).appendTo($("body")).animate({top:newcart.offset().top+15,left:newcart.offset().left+40,width:0,height:0},1e3,"easeInOutExpo").animate({width:0,height:0},(function(){$(this).detach()}))})),$(document).on("click",".minus-count",(function(){var t=$(this).parent().data("name"),e=event.target.parentNode.parentNode.cloneNode(!0);o(event.target.parentNode.parentNode,t,-1),n.removeOneProduct(e,t),$(".totalSum").html("Total sum: "+n.totalSum()+"$")})),$(document).on("click",".plus-count",(function(){var t=$(this).parent().data("name"),e=Number($(this).parent().data("price"));o(event.target.parentNode.parentNode,t,1),n.addProduct(null,t,e,1),$(".totalSum").html("Total sum: "+n.totalSum()+"$")}))}]);