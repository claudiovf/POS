function clearAll() {
        mainCateg.classList.remove('stock-active');
        mainContent.classList.replace('main-content-form', 'main-content');
        formContainer.classList.remove('form-container-active');
        orderItemsWrap.classList.remove('main-cart-active');
        mainCart.classList.remove('main-cart-active');
        mainItems.classList.remove('main-active');
}

function startNewOrder() {
    mainCateg.classList.add('categ-active');
    mainItems.classList.add('main-active');
    mainCart.classList.add('main-cart-active');
    orderItemsWrap.classList.add('main-cart-active');
    mainCateg.innerHTML = '';
    console.log(mainCart.className);
}

function createCategButtons() {
    for (let i = 0; i < db.length; i++) {
        let categ = db[i];
        if(!(mainCateg.innerHTML.includes(db[i].category))) {    
            let categButton = document.createElement('button');
            categButton.classList.add('categ');
            let categName = db[i].category;
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
    }
}

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

function prepareItems(){
    mainPay.classList.add('main-pay-active');
    mainCart.classList.add('main-cart-active');
    orderItemsWrap.classList.add('main-cart-active');
}

function displayItems() {
    for (let i = 0; i < categItems.length; i++) {
        let item = categItems[i];
        let itemButton = document.createElement('button');
        itemButton.classList.add('button-class');
        let itemDisplay = document.createTextNode(item.name);
        itemButton.appendChild(itemDisplay);
        mainItems.appendChild(itemButton);
    }
}

function addItemToOrder() {
    if(event.target.innerHTML.length < 40 && event.target.innerHTML.length > 0 ) {
        orderItemsWrap.classList.add('main-cart-active');
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
    }
}
