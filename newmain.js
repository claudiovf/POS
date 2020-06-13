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

function switchToCancelOrder() {
    if(mainCateg.classList.contains('categ-active')) { 
        menuNew.innerHTML = "CANCEL ORDER";
        menuNew.style.color = "rgb(241, 173, 146)";
    }
}