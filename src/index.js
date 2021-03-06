/* eslint-disable multiline-comment-style */
/* eslint-disable array-element-newline */
import './scss/bootstrap/bootstrap.min.css';
import 'bootstrap';
import './scss/main.scss';
import {
    effectBuyItem
} from './ui.js';
const cartStorage = [];
const nodes = [];
const token = "s6r35uUpnFTq1naCmw8w";

const itemsMap = new Map();
const categoriesMap = new Map();

let currentCategoryId = 0;
let lastNode = 0;

function Product(name, price, count, id) {
    this.id = id
    this.name = name;
    this.price = price;
    this.count = count;
}

function addProduct(node, name, price, id) {
    const newItem = new Product(name, price, 1, id);
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
    totalSum();
}

function totalSum() {
    let sum = 0;
    let totalItems = 0;
    for (var item of cartStorage) {
        sum += item.price * item.count;
        totalItems += item.count;
    }
    $('#unique-cart-counter').html(totalItems);
    $('.totalSum').html('Total sum: ' + Number(sum.toFixed(2)) + '$');
}

function changeCount(name, quantity) {
    for (var item of cartStorage) {
        if (item.name == name) {
            item.count += quantity;
            // console.log(item.count);
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

$(document).on("click", ".card", function () {
    const check = $(this).find(".plus-count");
    if (check.length > 0)
        return;
    lastNode = $(this).clone(true);
    if (event.target.classList.contains("btn-buy")) {
        clickOnBuy();

        let newcart = $('.open-cart');
        if (getWidth() < 1270)
            newcart = $('.dropdownIcon');
        const imgtodrag = $(this).find("img");
        effectBuyItem(imgtodrag, newcart);
    } else {
        generateModal(lastNode.data('id'));
        //console.log(lastNode.data('id'));
        $('#itemModal').modal('show');
    }

});

$(document).on("click", ".add", function () {
    clickOnBuy();
});

function generateModal(id) {
    let thisItem;
    for (var item of itemsMap.get(currentCategoryId)) {
        //console.log(item.name);
        if (item.id == id) {
            thisItem = item;
            break;
        }
    }
    $('#item-modal-container').empty();
    const imageWrapper =
        jQuery('<div></div>', {
            "class": "images"
        });
    jQuery('<img>', {
        "class": "img-big",
        src: thisItem.image_url
    }).appendTo(imageWrapper);
    $('#item-modal-container').append(imageWrapper);

    const productWrapper =
        jQuery('<div></div>', {
            "class": "product"
        });
    jQuery('<h1></h1>', {
        "class": "title",
        text: thisItem.name
    }).appendTo(productWrapper);
    if (thisItem.special_price !== null) {
        productWrapper.append(jQuery('<h2></h2>', {
            "class": "newPrice",
            text: thisItem.special_price
        }));
    }
    jQuery('<h2></h2>', {
        "class": "oldPrice",
        text: thisItem.price
    }).appendTo(productWrapper);
    jQuery('<p></p>', {
        "class": "desc",
        text: thisItem.description
    }).appendTo(productWrapper);
    productWrapper.append(jQuery('<button></button>', {
        "class": "add",
        text: "Add to Cart"
    }));
    $('#item-modal-container').append(productWrapper);
}

function clickOnBuy() {
    const nodeCopy = lastNode;
    const name = nodeCopy.find(".priceWrapper").data('name');
    const price = Number(nodeCopy.find(".priceWrapper").data('price'));
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

    // animating the item image flying SOMEHOW BROKE IT

}

$(document).on("click", ".possibleCategory", function () {
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
        "class": "col-md-5 col-lg-3 col-xs-6 col-xl-3 card "
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
    const nodeCopy = $(this).closest('.card').clone(true);
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

$("#parentCategory").on("click", function () {
    $("#myDropdown1").toggle("show");
});


$(document).on("click", function () {
    if (event.target.closest("form") === null && event.target.closest("button") === null) {
        $(".p-4")[0].style.display = "none";
        $('#checkout-form')[0].reset();
    }

    if (!(event.target.matches('.dropdownIcon') || event.target.matches('.current-category'))) {
        var dropdowns = $(".dropdown-content");
        for (var openDropdown of dropdowns) {
            if (openDropdown.style.display != "none") {
                openDropdown.style.display = "none";
            }
        }
    }
});


window.onload = function () {


    $.get({
        dataType: "json",
        url: "https://nit.tron.net.ua/api/category/list",
        success(data) {
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

    const itemCounter = $('#unique-cart-counter').detach();
    if (getWidth() < 1270) {
        itemCounter.insertAfter($('#dropdownImage'));
        console.log(itemCounter);
    } else
        itemCounter.appendTo($('#cart-btn'));

}

window.onresize = function () {
    const itemCounter = $('#unique-cart-counter').detach();
    if (getWidth() < 1270) {
        itemCounter.insertAfter($('#dropdownImage'));
        console.log(itemCounter);
    } else
        itemCounter.appendTo($('#cart-btn'));
}

$("#checkout-btn").on("click", function () {
    $("#checkout-form").toggle("show");
});

$("form").submit(function (event) {

    event.preventDefault();
    let dataToSend = 'token=' + token + '&' + $("form").serialize();
    for (var item of cartStorage) {
        //console.log(item);
        dataToSend += '&products[' + item.id + ']=' + item.count;
    }
    console.log(dataToSend);
    $.post({
        url: 'https://nit.tron.net.ua/api/order/add',
        dataType: 'json',
        data: dataToSend,
        success(data) {
            // console.log(data);
            for (var error in data.errors) {
                console.log(data.errors[error]);
                postMessage(data.errors[error]);
                return;
            }
            postMessage('Order created');
            clearCart();

        }
    });
});

function postMessage(message) {
    $('.post-message').empty();
    if (message == 'Order created') {
        $('.post-message')[0].style.backgroundColor = "#63c550";
        setTimeout(function () {
            $("#checkout-form").toggle("show")
        }, 2000);
    } else {
        $('.post-message')[0].style.backgroundColor = "#ee2336";
    }
    $('.post-message').html(message);
}


function getWidth() {
    return (window.innerWidth > 0) ? window.innerWidth : screen.width;
}