/* eslint-disable array-element-newline */
console.log("Hello webpack!");
console.log(`The time is ${new Date()}`);
import './scss/bootstrap/bootstrap.min.css';
import 'bootstrap';
import './scss/main.scss';
const cartStorage = [];
const nodes = [];

const itemsMap = new Map();

function Product(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
}

function addProduct(node, name, price, count) {
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

function removeOneProduct(node, name) {
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

function clearCart() {
    cartStorage.splice(0, cartStorage.length);
    for (var nd of nodes)
        document.getElementById('cont1').removeChild(nd);
    nodes.splice(0, nodes.length);
}

function totalSum() {
    let sum = 0;
    for (var item of cartStorage) {
        sum += item.price * item.count;
    }
    return Number(sum.toFixed(2));
}

function changeCount(node, name, quantity) {
    for (var item of cartStorage) {
        if (item.name == name) {
            node.childNodes[5].innerHTML = (name + '&nbsp&nbsp Total: ' + (item.count + quantity));
        }
    }
}

$('.clearCart').click(function () {
    clearCart();
    $('.totalSum').html('Total sum: ' + totalSum() + '$');
    //console.log('Cart cleared.');
});

$('.btn-buy').click(function (event) {

    for (var [key, value] of itemsMap) {
        console.log(key.name + ' = ' + value.length);
    }


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
            changeCount(node, name, 1);
        }
    }
    addProduct(nodeCopy, name, price, 1);
    $('.totalSum').html('Total sum: ' + totalSum() + '$');

    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let newcart = $('.open-cart');
    if (width < 1270)
        newcart = $('.dropdownIcon');


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
        }, function () {
            $(this).detach()
        });
    }

});

$(document).on("click", ".minus-count", function () {
    //console.log('minus content');
    const name = $(this).parent().data('name');
    // console.log(name);
    const nodeCopy = event.target.parentNode.parentNode.cloneNode(true);
    // console.log(nodeCopy.childNodes[3].nodeName);
    changeCount(event.target.parentNode.parentNode, name, -1);
    removeOneProduct(nodeCopy, name);
    $('.totalSum').html('Total sum: ' + totalSum() + '$');
});

$(document).on("click", ".plus-count", function () {
    const name = $(this).parent().data('name');
    const price = Number($(this).parent().data('price'));
    changeCount(event.target.parentNode.parentNode, name, 1);
    addProduct(null, name, price, 1);
    $('.totalSum').html('Total sum: ' + totalSum() + '$');
});


$("#dropdownImage").on("click", function () {
    $("#myDropdown").toggle("show");
});

window.onload = function () {
    $.get({
        dataType: "json",
        url: "https://nit.tron.net.ua/api/category/list",
        success(data) {
            console.log(data);
            for (var category of data) {
                itemsMap.set(category.id, []);
            }
            itemsMap.set()
            /* data.forEach(function(item) {
               console.log(item.name);
               }); */
        }

        /*  let tempElem = '<li class="category"><button id="category_all">All</button></li>';
           $(".categories_list").append(temp_elem);
           $("#category_all").on("click", function (event) {
             show_category("all");
           });
           for (let i = 0; i < data.length; i++) {
             temp_elem = '<li class="category"><button id="category_' + data[i].id + '">' + data[i].name + '</button></li>';
             $(".categories_list").append(temp_elem);
             $('#category_' + data[i].id).on("click", function (event) {
               show_category(data[i].id);
             });
             categories_json.set(data[i].id, data[i]);
             }
            } */
    });
}