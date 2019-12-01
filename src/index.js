console.log("Hello webpack!");
console.log(`The time is ${new Date()}`);
import './scss/main.scss'
import './scss/bootstrap/bootstrap.min.css';
import 'bootstrap';

const cart = (function() {
    const cartStorage = [];
    let nodes = [];

  function Product(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
  }

  const object = {};

  object.addProduct = function(node, name, price, count) {
      for (var item of cartStorage) {
          if (item.name === name) {
            item.count++;
              return;
          }
      }
      const newItem = new Product(name, price, count);
      // console.log(newItem.name + ' ' + newItem.price);
      cartStorage.push(newItem);
      document.getElementById('cont1').appendChild(node);
      nodes.push(node);
  }

  object.removeOneProduct = function(node, name) {
      for (var item in cartStorage) {
          if (cartStorage[item].name === name) {
              cartStorage[item].count--;
              if (cartStorage[item].count <= 0) {
                  cartStorage.splice(item, 1);
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
      for (var nd of nodes)
          document.getElementById('cont1').removeChild(nd);
      nodes = [];
  }

  object.totalSum = function() {
      let totalSum = 0;
      for (var item of cartStorage) {
          totalSum += item.price * item.count;
      }
      return Number(totalSum.toFixed(2));
  }

  object.changeCount = function(node, name, quantity) {
    for (var item of cartStorage) {
        if (item.name == name) {
            node.childNodes[5].innerHTML = (name + '&nbsp&nbsp Total: ' + (item.count + quantity));
        }
    }
  };
  return object;
})();

$('.clearCart').click(function() {
  cart.clearCart();
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
  //console.log('Cart cleared.');
});

$('.btn-buy').click(function(event) {
  event.preventDefault();
  const name = $(this).parent().data('name');
  const price = Number($(this).parent().data('price'));
  // console.log(name);
  const nodeCopy = event.target.parentNode.parentNode.cloneNode(true);
  // console.log(nodeCopy.childNodes[3].childNodes[1].nodeName);
  const minus = document.createElement('button');
  const plus = document.createElement('button');
  minus.className = "btn btn-danger btn-md minus-count";
  plus.className = "btn btn-success btn-md plus-count";
  plus.innerHTML = "+";
  minus.innerHTML = "-";
  nodeCopy.childNodes[3].childNodes[1].replaceWith(minus);
  nodeCopy.childNodes[3].appendChild(plus);
  for (var node of nodes) {
      if (node.childNodes[3].getAttribute('data-name') == name) {
          cart.changeCount(node, name, 1);
      }
  }
  cart.addProduct(nodeCopy, name, price, 1);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');


  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  let newCart = 0;
  if (width < 1270)
      newcart = $('.dropdownIcon');
  else
      newcart = $('.open-cart');

  const imgtodrag = $(this).parent().parent('.card').find("img").eq(0);
  if (imgtodrag) {
      const imgclone = imgtodrag.clone()
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
  const name = $(this).parent().data('name');
  // console.log(name);
  const nodeCopy = event.target.parentNode.parentNode.cloneNode(true);
  // console.log(nodeCopy.childNodes[3].nodeName);
  cart.changeCount(event.target.parentNode.parentNode, name, -1);
  cart.removeOneProduct(nodeCopy, name);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
});

$(document).on("click", ".plus-count", function() {
    const name = $(this).parent().data('name');
    const price = Number($(this).parent().data('price'));
  cart.changeCount(event.target.parentNode.parentNode, name, 1);
  cart.addProduct(null, name, price, 1);
  $('.totalSum').html('Total sum: ' + cart.totalSum() + '$');
});

