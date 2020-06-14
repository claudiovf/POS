
let mainContent = document.querySelector('.main-content');
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
let menuStock = document.querySelector('.menu-stock');
let addNewBtn = document.querySelector('.categ');
let formContainer = document.querySelector('.form-container');
let formAddCategoryBtn = document.querySelector('.form-add-category');
let formAddCategoryOverlay = document.querySelector('.form-add-category-overlay');


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



  function clearAll() {
    mainCateg.classList.remove('stock-active');
    mainContent.classList.replace('main-content-form', 'main-content');
    formContainer.classList.remove('form-container-active');
    orderItemsWrap.classList.remove('main-cart-active');
    mainCart.classList.remove('main-cart-active');
    mainItems.classList.remove('main-active');
    mainCateg.classList.remove('stock-active');
}
function startNewOrder() {
    mainCateg.classList.toggle('categ-active');
    mainItems.classList.add('main-active');
    mainCart.classList.add('main-cart-active');
    orderItemsWrap.classList.add('main-cart-active');
    mainCateg.innerHTML = '';
    menuNew.textContent = "CANCEL ORDER";
    console.log(menuNew.textContent);
}
function createCategButtons() {
    for (let i = 0; i < db.length; i++) {
        let categ = db[i];
        if(!(mainCateg.innerHTML.includes(db[i].category))) {    
            let categButton = document.createElement('button');
            categButton.classList.add('categ');
            let categDisplay = document.createTextNode(categ.category);
            categButton.appendChild(categDisplay);
            mainCateg.appendChild(categButton);
        }
    }
}

function switchButtonName() {
    if(mainCateg.classList.contains('categ-active')) { 
        menuNew.innerHTML = "CANCEL ORDER";
        menuNew.style.color = "rgb(241, 173, 146)";
        menuStock.toggleAttribute('disabled');
        menuStock.style.color = "gray";
        menuStock.style.opacity = 0.8;
        
    }else{
        menuNew.textContent = "NEW";
        menuNew.style.color = "rgb(20, 204, 158)";
        mainPay.classList.remove('main-pay-active');
        orderItemsWrap.classList.remove('main-cart-active');
        mainCart.classList.remove('main-cart-active');
        mainAddon.classList.remove('addon-active');
        mainAddon.innerHTML = '';
        mainItems.innerHTML = '';
        orderItemsWrap.innerHTML = '';
        orderPrice.innerHTML = '';
        textTotal.innerHTML = '0';
        menuStock.toggleAttribute('disabled');
        menuStock.style.color = "rgb(20, 204, 158)";
        menuStock.style.opacity = 1;
    }
}
function categDisplay(){
    clearAll();
    startNewOrder();
    createCategButtons();
    switchButtonName();
};
menuNew.addEventListener('click', categDisplay);



function toggleStock() {
    if(mainCateg.classList.contains('stock-active')) {
        clearAll();
    }else{
        mainCateg.classList.toggle('stock-active');
        mainItems.classList.toggle('main-active');
    }
}

function addNewStockButton() {
    mainCateg.innerHTML = '';   
    let addStockButton = document.createElement('button');
    addStockButton.classList.add('add-stock-btn');
    addStockButton.innerHTML = "ADD NEW";
    mainCateg.appendChild(addStockButton);
}
function lookupStockButton(){
    let stockLookButton = document.createElement('button');
    stockLookButton.classList.add('stock-look-btn');
    stockLookButton.innerHTML = 'STOCK LOOKUP';
    mainCateg.appendChild(stockLookButton);
}

function stockDisplay(){
    toggleStock();
    addNewStockButton();
    lookupStockButton();
}
menuStock.addEventListener('click', stockDisplay);



function displayForm() {
    mainItems.innerHTML = '';
    mainContent.classList.replace('main-content','main-content-form');
    formContainer.classList.add('form-container-active');
    mainAddon.innerHTML = '';
    orderItemsWrap.innerHTML = '';
    mainPay.classList.remove('main-pay-active');
    mainCart.classList.remove('main-cart-active');
    orderItemsWrap.classList.remove('main-cart-active');
    mainAddon.classList.remove('addon-active');
    console.log(event.target.innerHTML);
}


function prepareItemsArea(){
    mainPay.classList.add('main-pay-active');
    mainCart.classList.add('main-cart-active');
    orderItemsWrap.classList.add('main-cart-active');
}


function categBoxSelect(event){
    //Identify Button Selected
    let categ = event.target.innerHTML;
    console.log(event.target, categ);

    let categItems =  db.filter(function(item) {
        return item.category == categ;
        });
    //-------------------------------

    console.log(categItems, categ);


    mainContent.classList.replace('main-content-form', 'main-content');


    // Settings categ box options are added here
    if(event.target.innerHTML == 'ADD NEW') {
        displayForm();

        for (let i = 0; i < db.length; i++) {
            let item = db[i].category;

             if(!(document.getElementById('add-category').innerHTML.includes(item))) {
                let categOptionInForm = document.createElement('option');
                categOptionInForm.textContent = item;
                categOptionInForm.value = item;
                document.getElementById('add-category').appendChild(categOptionInForm);
                console.log("hello", item, categItems, document.getElementById('add-category').innerText);
             }else{
                 console.log(item);
             };
        };
    }
    //--------------------------------

    prepareItemsArea();

    // Create and Display Item Buttons
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
categOption.addEventListener('click', categBoxSelect);





function addToOrder(event) {
    //item Selection
    let itemSel = event.target.innerHTML;
    console.log(itemSel, event.target.innerHTML.length);

    // ignore blank spaces
    if(event.target.innerHTML.length < 40 && event.target.innerHTML.length > 0 ) {
        
        //create ITEMPRICE div
        let itemBox = document.createElement('div');
        itemBox.classList.add('order-items');
        orderItemsWrap.appendChild(itemBox);

        //add 1x to Item Name
        let itemText = "1 x " + itemSel;
        let cartItem = document.createElement('div');
        cartItem.textContent = itemText;
        cartItem.classList.add('order-items-name');
        itemBox.appendChild(cartItem);

        console.log(itemSel, cartItem);

        //find item price
        for (let i = 0; i < db.length; i++) {
            let itemPrice = db[i].price;
            let itemName = db[i].name;
            
            //match and add price to ITEMPRICE div
            if(itemSel == itemName) {
                let priceSend = document.createElement('div');
                priceSend.classList.add('order-price');
                priceSend.textContent = itemPrice;
                itemBox.appendChild(priceSend);
                
                // add selection price to Total Amount
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



function submitForm(event) {
    let newProduct = {};
        newProduct.category = document.getElementById('add-category').value;
        newProduct.name = document.getElementById('product-name').value;
        newProduct.price = document.getElementById('add-price').value;
        newProduct.cost = document.getElementById('add-cost').value;


productsList.push(newProduct);
db.push(newProduct);
console.log(productsList);

   // DownloadFuntion for manualy updating db
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
// export2txt();


//Clear Form
document.getElementById('product-name').value = '';
document.getElementById('add-price').value = '';
document.getElementById('add-cost').value = '';

event.preventDefault();



}

document.getElementById('add-submit').addEventListener('click', submitForm, false);


// END OF ADD NEW PRODUCT FORM

function addNewCategory() {
    formAddCategoryOverlay.classList.add('category-overlay-active');
    document.querySelector('.new-categ-cancel').addEventListener('click', function() {
        formAddCategoryOverlay.classList.remove('category-overlay-active');
    });
    document.querySelector('.new-categ-submit').addEventListener('click', function() {
        let categOptionInForm = document.createElement('option');
                categOptionInForm.textContent = document.querySelector('.new-categ-overlay').value;
                categOptionInForm.value = document.querySelector('.new-categ-overlay').value;;
                document.getElementById('add-category').appendChild(categOptionInForm);
                console.log("hello", document.querySelector('.new-categ-overlay').value, document.getElementById('add-category').innerText);
        formAddCategoryOverlay.classList.remove('category-overlay-active');
        document.querySelector('.new-categ-overlay').value = '';
    });
}
formAddCategoryBtn.addEventListener('click', addNewCategory)


