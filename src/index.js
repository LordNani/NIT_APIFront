console.log("Hello webpack!");
console.log(`The time is ${new Date()}`);
import './scss/main.scss'
import './scss/bootstrap/bootstrap.min.css';
import 'bootstrap';

var cart = (function() {
    const cartStorage = [];
    let nodes = [];

  function Product(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
  }

  var object = {};

  object.addProduct = function(node, name, price, count) {
      for (var i in cartStorage) {
          if (cartStorage[i].name === name) {
              cartStorage[i].count++;
              return;
          }
      }
      var newItem = new Product(name, price, count);
      // console.log(newItem.name + ' ' + newItem.price);
      cartStorage.push(newItem);
      document.getElementById('cont1').appendChild(node);
      nodes.push(node);
  }

  object.removeOneProduct = function(node, name) {
      for (var i in cartStorage) {
          if (cartStorage[i].name === name) {
              cartStorage[i].count--;
              if (cartStorage[i].count <= 0) {
                  cartStorage.splice(i, 1);
                  for (var nd in nodes) {
                      if (nodes[nd].childNodes[3].getAttribute('data-name') == node.childNodes[3].getAttribute('data-name')) {
                          document.getElementById('cont1').removeChild(nodes[nd]);
                          nodes.splice(nd, 1);
                      }
                  }
              }
              return;
          }
      }
  }

  object.clearCart = function() {
      cartStorage.splice(0, cartStorage.length);
      for (var nd in nodes)
          document.getElementById('cont1').removeChild(nodes[nd]);
      nodes = [];
  }

  object.totalSum = function() {
      var totalSum = 0;
      for (var i in cartStorage) {
          totalSum += cartStorage[i].price * cartStorage[i].count;
      }
      return Number(totalSum.toFixed(2));
  }

  return object;
})();

$('.clearCart').click(function() {
  cart.clearCart();
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
  //console.log('Cart cleared.');
});

$('.btn-buy').click(function(event) {
  event.preventDefault();
  var name = $(this).parent().data('name');
  var price = Number($(this).parent().data('price'));
  // console.log(name);
  var nodeCopy = event.target.parentNode.parentNode.cloneNode(true);
  // console.log(nodeCopy.childNodes[3].childNodes[1].nodeName);
  var minus = document.createElement('button');
  var plus = document.createElement('button');
  minus.className = "btn btn-danger btn-md minus-count";
  plus.className = "btn btn-success btn-md plus-count";
  plus.innerHTML = "+";
  minus.innerHTML = "-";
  nodeCopy.childNodes[3].childNodes[1].replaceWith(minus);
  nodeCopy.childNodes[3].appendChild(plus);
  for (var node in nodes) {
      if (nodes[node].childNodes[3].getAttribute('data-name') == name) {
          changeCount(nodes[node], name, 1);
      }
  }
  cart.addProduct(nodeCopy, name, price, 1);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');


  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var newCart;
  if (width < 1270)
      newcart = $('.dropdownIcon');
  else
      newcart = $('.open-cart');

  var imgtodrag = $(this).parent().parent('.card').find("img").eq(0);
  if (imgtodrag) {
      var imgclone = imgtodrag.clone()
          .offset({
              top: imgtodrag.offset().top,
              left: imgtodrag.offset().left
          })
          .css({
              'opacity': '0.5',
              'position': 'absolute',
              'height': '200px',
              'width': '200px',
              'z-index': '100',
              'border-radius': '15%'
          })
          .appendTo($('body'))
          .animate({
              'top': newcart.offset().top + 15,
              'left': newcart.offset().left + 40,
              'width': 0,
              'height': 0
          }, 1000, 'easeInOutExpo');

      imgclone.animate({
          'width': 0,
          'height': 0
      }, function() {
          $(this).detach()
      });
  }
});

$(document).on("click", ".minus-count", function() {
  //console.log('minus content');
  var name = $(this).parent().data('name');
  // console.log(name);
  var nodeCopy = event.target.parentNode.parentNode.cloneNode(true);
  // console.log(nodeCopy.childNodes[3].nodeName);
  changeCount(event.target.parentNode.parentNode, name, -1);
  cart.removeOneProduct(nodeCopy, name);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
});

$(document).on("click", ".plus-count", function() {
  var name = $(this).parent().data('name');
  var price = Number($(this).parent().data('price'));
  changeCount(event.target.parentNode.parentNode, name, 1);
  cart.addProduct(null, name, price, 1);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
});

function changeCount(node, name, quantity) {
  for (var i in cartStorage) {
      if (cartStorage[i].name == name) {
          node.childNodes[5].innerHTML = (name + '&nbsp&nbsp Total: ' + (cartStorage[i].count + quantity));
      }
  }
}
