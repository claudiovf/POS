
let menuNew = document.querySelector('.menu-new');
let mainCateg = document.querySelector('.main-categ')
let mainItems = document.querySelector('.main-items');
let categOption = document.querySelector('.main-categ');
let mainPay = document.querySelector('.main-pay');
let mainCart = document.querySelector('.main-cart');
let orderItemsWrap = document.querySelector('.order-items-wrap');
let orderItemList = document.querySelector('.order-items');
let orderPrice = document.querySelector('.order-price');
let orderTotal = document.querySelector('.order-total');
let textTotal = document.querySelector('.total-text');
let mainAddon = document.querySelector('.main-addon');

function categDisplay(){
    mainCateg.classList.toggle('categ-active');
    mainItems.classList.toggle('main-active');

    if(menuNew.textContent == "NEW") { 
        menuNew.textContent = "CANCEL ORDER"
        menuNew.style.color = "rgb(241, 173, 146)";
    }else{
        menuNew.textContent = "NEW";
        menuNew.style.color = "rgb(20, 204, 158)";
        mainPay.classList.remove('main-pay-active');
        mainCart.classList.remove('main-cart-active');
        mainAddon.classList.remove('addon-active');
        mainAddon.innerHTML = '';
        mainItems.innerHTML = '';
        orderItemsWrap.innerHTML = '';
        orderPrice.innerHTML = '';
        textTotal.innerHTML = '0';
    }
};

menuNew.addEventListener('click', categDisplay)


function showItems(event){
    let categ = event.target.id;
    console.log(event.target, categ);

    let categItems =  db.filter(function(item) {
        return item.category == categ;
        });
        
    console.log(categItems);

    mainPay.classList.add('main-pay-active');
    mainCart.classList.add('main-cart-active');
 

    mainItems.innerHTML = '';
    for (let i = 0; i < categItems.length; i++) {
        let item = categItems[i];
        let itemButton = document.createElement('button');
        itemButton.classList.add('button-class');
        let itemDisplay = document.createTextNode(item.name);
        itemButton.appendChild(itemDisplay);
        mainItems.appendChild(itemButton);
    }

};

categOption.addEventListener('click', showItems);



function addToOrder(event) {
    let itemSel = event.target.innerHTML;
    console.log(itemSel, event.target.innerHTML.length);

    if(event.target.innerHTML.length < 40) {

        mainAddon.classList.add('addon-active');
        let itemBox = document.createElement('div');
        itemBox.classList.add('order-items');
        orderItemsWrap.appendChild(itemBox);


        let itemText = "1 x " + itemSel;
        let cartItem = document.createElement('div');
        cartItem.textContent = itemText;
        cartItem.classList.add('order-items-name');
        itemBox.appendChild(cartItem);

        console.log(itemSel, cartItem);

        for (let i = 0; i < db.length; i++) {
            let itemPrice = db[i].price;
            let itemName = db[i].name;
            
            

            // if(orderTotal.innerHTML == '') {
            //     let totalSend = document.createElement('div')
            //     totalSend.textContent = 0;
            //     totalSend.classList.add('total-text');
            //     orderTotal.appendChild(totalSend);

            if(itemSel == itemName) {
                let priceSend = document.createElement('div');
                priceSend.classList.add('order-price');
                priceSend.textContent = itemPrice;
                itemBox.appendChild(priceSend);
                
                let currentTotal = orderTotal.firstChild.textContent;
                
                let newTotal = Number(textTotal.innerHTML) + Number(itemPrice);
                textTotal.innerHTML = newTotal.toFixed(2);
                console.log(currentTotal)
            }
        }
        event.preventDefault();
    }
}

mainItems.addEventListener('click', addToOrder);

// START OF ADD NEW PRODUCT FORM

let productsList = [];
let db = [];

fetch('db.json')
    .then(res => res.json())
    .then(data => {
        db = data;
        console.log(data)
    })
    .catch(err => console.error(err));


$('#add-price').on('blur', function() {
    const value = this.value.replace(/,/g, '');
    this.value = parseFloat(value).toLocaleString('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  });
  $('#add-cost').on('blur', function() {
    const value = this.value.replace(/,/g, '');
    this.value = parseFloat(value).toLocaleString('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  });


document.getElementById('add-submit').addEventListener('click', function(event) {
    let inputs = document.querySelectorAll('.input-form');
    let newProduct = {};
        newProduct.category = document.getElementById('add-category').value;
        newProduct.name = document.getElementById('product-name').value;
        newProduct.price = document.getElementById('add-price').value;
        newProduct.cost = document.getElementById('add-cost').value;

    // function export2txt() {

    //     const a = document.createElement("a");
    //     a.href = URL.createObjectURL(new Blob([JSON.stringify(db)], {
    //         type: "text/plain"
    //     }));
    //     a.setAttribute("download", "db.json");
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    // }
productsList.push(newProduct);
db.push(newProduct);
console.log(productsList);

//   export2txt();

document.getElementById('product-name').value = '';
document.getElementById('add-price').value = '';
document.getElementById('add-cost').value = '';

event.preventDefault();


}, false);


// END OF ADD NEW PRODUCT FORM

