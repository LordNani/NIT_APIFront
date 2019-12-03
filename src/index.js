/* eslint-disable multiline-comment-style */
/* eslint-disable array-element-newline */
//console.log("Hello webpack!");
//console.log(`The time is ${new Date()}`);
import './scss/bootstrap/bootstrap.min.css';
import 'bootstrap';
import './scss/main.scss';
import {
    effectBuyItem
} from './ui.js';
const cartStorage = [];
const nodes = [];

const itemsMap = new Map();
const categoriesMap = new Map();

let currentCategoryId = 0;


function Product(name, price, count, id) {
    this.id = id
    this.name = name;
    this.price = price;
    this.count = count;
}

function addProduct(node, name, price, id) {
    const newItem = new Product(name, price, 1, id);
    // console.log(newItem.name + ' ' + newItem.price);
    cartStorage.push(newItem);
    $("#cart-container").append(node);
    nodes.push(node);
}

function removeOneProduct(node, name) {
    for (var item in cartStorage) {
        if (cartStorage[item].name === name) {
            changeCount(name, -1);
            if (cartStorage[item].count <= 0) {
                cartStorage.splice(item, 1);
                for (var nd in nodes) {
                    if (nodes[nd].find('.priceWrapper').data('name') == node.find('.priceWrapper').data('name')) {
                        nodes[nd].remove();
                        nodes.splice(nd, 1);
                        console.log(cartStorage);
                    }
                }
            }
            return;
        }
    }
}

function clearCart() {
    cartStorage.splice(0, cartStorage.length);
    $('#cart-container').empty();
    nodes.splice(0, nodes.length);
}

function totalSum() {
    let sum = 0;
    for (var item of cartStorage) {
        sum += item.price * item.count;
    }
    $('.totalSum').html('Total sum: ' + Number(sum.toFixed(2)) + '$');
}

function changeCount(name, quantity) {
    for (var item of cartStorage) {
        if (item.name == name) {
            item.count += quantity;
            console.log(item.count);
            for (var nd of nodes)
                if (nd.find('.priceWrapper').data('name') == name)
                    nd.find('.dot').html(item.count);
        }
    }
}

$('.clearCart').click(function () {
    clearCart();
    totalSum();
    //console.log('Cart cleared.');
});

$(document).on("click", ".btn-buy", function () {
    //console.log('clicked on button buy');
    const name = $(this).siblings("div")[1].getAttribute('data-name');
    const price = Number($(this).siblings("div")[1].getAttribute('data-price'));
    //console.log(name + " " + price);
    const nodeCopy = $(this).closest("div").clone(true);
    const minus = jQuery('<button></button>', {
        "class": "btn btn-danger btn-md minus-count",
        text: "-"
    });
    const plus = jQuery('<button></button>', {
        "class": "btn btn-success btn-md plus-count",
        text: "+"
    });
    const wrapper = jQuery('<div></div>', {
        "class": "buttons-wrapper"
    });
    wrapper.append(minus, plus);
    nodeCopy.append((jQuery('<span></span>', {
        "class": "dot",
        text: 1
    })));
    nodeCopy.find("input").replaceWith(wrapper);

    let foundNode = false;
    for (var node of nodes) {
        if (node.find('.priceWrapper').data('name') == name) {
            changeCount(name, 1);
            foundNode = true;
        }
    }

    if (!foundNode)
        addProduct(nodeCopy, name, price, nodeCopy.data('id'));

    totalSum();

    //animating the item image flying
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let newcart = $('.open-cart');
    if (width < 1270)
        newcart = $('.dropdownIcon');
    const imgtodrag = $(this).closest('div').find('img');
    effectBuyItem(newcart, imgtodrag);
});

$(document).on("click", ".possibleCategory", function () {
    //console.log(categoriesMap.get(this.id).name);
    if (this.id == 0)
        setCategory(this.id, "All Products");
    else
        setCategory(this.id, categoriesMap.get(this.id).name);
});

function setCategory(id, name) {
    currentCategoryId = id;
    let urlToGet = "https://nit.tron.net.ua/api/product/list/category/" + currentCategoryId;
    $('#parentCategory').text(name);
    if (currentCategoryId == "0")
        urlToGet = "https://nit.tron.net.ua/api/product/list";
    $.get({
        dataType: "json",
        url: urlToGet,
        success(data) {
            //console.log(data);
            //      for (var [key, value] of itemsMap) {
            //        console.log(key + ' = ' + value.length);
            //  }
            const items = itemsMap.get(currentCategoryId);
            if (items.length == 0)
                for (var item of data) {
                    items.push(item);
                    //  console.log(item.id + "  " + item.name + "   " + item.price);
                }
            else
                console.log("Already got data of that category!");

            $("#main-row").empty();
            for (var i of items) {
                $("#main-row").append(generateCard(i.id, i.image_url, i.name, i.price, i.special_price));
            }
        }
    });
}

function generateCard(itemID, img, name, price, specialPrice) {
    const node = jQuery('<div></div>', {
        "class": "col-md-5 col-lg-3 col-xs-6 col-xl-3 card ",
    });
    node.attr('data-id', itemID);
    jQuery('<img>', {
        src: img,
        alt: "Picture of item"
    }).appendTo(node);

    const wrapper =
        jQuery('<div></div>', {
            "class": "priceWrapper"
        });

    wrapper.attr('data-name', name);
    wrapper.attr('data-price', price);

    (jQuery('<div></div>', {
        "class": "item-name crop",
        text: name
    })).appendTo(node);

    if (specialPrice !== null) {
        wrapper.attr('data-price', specialPrice);
        wrapper.append(jQuery('<p></p>', {
            "class": "newPrice",
            text: specialPrice
        }));
    }

    wrapper.append(jQuery('<p></p>', {
        "class": "oldPrice",
        text: price
    }));
    wrapper.appendTo(node);

    jQuery('<input>', {
        type: "button",
        value: "BUY",
        "class": "btn-buy"
    }).appendTo(node);

    return node;
}

$(document).on("click", ".minus-count", function () {
    const name = $(this).closest('.card').find('.priceWrapper').data('name');
    //console.log(name);
    const nodeCopy = $(this).closest('.card').clone(true);
    console.log(nodeCopy);
    removeOneProduct(nodeCopy, name);
    totalSum();
});

$(document).on("click", ".plus-count", function () {
    const name = $(this).closest('.card').find('.priceWrapper').data('name');
    changeCount(name, 1);
    totalSum();
});


$("#dropdownImage").on("click", function () {
    $("#myDropdown2").toggle("show");
});

$(document).on("click", function () {
    if (!(event.target.matches('.dropdownIcon'))) {
        var dropdowns = $(".dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

window.onload = function () {
    $.get({
        dataType: "json",
        url: "https://nit.tron.net.ua/api/category/list",
        success(data) {
            // console.log(data);
            itemsMap.set('0', []);
            $('#myDropdown1').append(jQuery('<li></li>', {
                id: '0',
                "class": 'possibleCategory',
                text: 'All Products'
            }));

            for (var category of data) {
                categoriesMap.set(category.id, category);
                itemsMap.set(category.id, []);
                $('#myDropdown1').append(jQuery('<li></li>', {
                    id: category.id,
                    "class": 'possibleCategory',
                    text: category.name
                }));
            }
            setCategory('0');
        }

    });
}
