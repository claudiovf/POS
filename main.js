
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
let stockLookupContainer = document.querySelector('.stock-lookup-container');



let productsList = [];
let db = [];
let oldDb = [];

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
    stockLookupContainer.classList.remove('stock-lookup-container-active');
    document.querySelector('.stock-results').innerHTML = '';
    document.querySelector('.stock-results-header').classList.remove('stock-results-header-active');
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
    let dbToSort = db;
    let dbSortedBtCat = dbToSort.sort(function(a, b) {
        var catA = a.category.toUpperCase(); // ignore upper and lowercase
        var catB = b.category.toUpperCase(); // ignore upper and lowercase
        if (catA < catB) {
          return -1;
        }
        if (catA > catB) {
            console.log(dbToSort);
          return 1;
        }
    });
    for (let i = 0; i < dbSortedBtCat.length; i++) {
        let categ = dbSortedBtCat[i];
        let exactName = ">" + dbSortedBtCat[i].category +  "&";
        let inner = mainCateg.innerHTML.replace(/</g, "&lt;");
        console.log(inner);


        if(!(inner.includes(exactName))) {    
            let categButton = document.createElement('button');
            categButton.classList.add('categ');
            let categDisplay = document.createTextNode(categ.category);
            categButton.appendChild(categDisplay);
            mainCateg.appendChild(categButton);
            console.log(categ);
            console.log(mainCateg.innerHTML.textContent, exactName, mainCateg.getElementsByTagName('button').textContent);
        }
    }
}

function switchOrderButtonName() {
    if(mainCateg.classList.contains('categ-active')) { 
        menuNew.innerHTML = "CANCEL ORDER";
        menuNew.style.color = "rgb(241, 173, 146)";
        menuStock.toggleAttribute('disabled');
        menuStock.style.color = "gray";
        menuStock.style.opacity = 0.4;
        
    }else{
        menuNew.textContent = "NEW ORDER";
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
    switchOrderButtonName();
};
menuNew.addEventListener('click', categDisplay);


function switchStockButtonNameOn() {
    // if(mainCateg.classList.contains('categ-active')) { 
        menuStock.innerHTML = "CLOSE";
        menuStock.style.color = "rgb(241, 173, 146)";
        menuNew.toggleAttribute('disabled');
        menuNew.style.color = "gray";
        menuNew.style.opacity = 0.4;
    
}
function switchStockButtonNameOff() {
        menuStock.textContent = "STOCK";
        menuStock.style.color = "rgb(20, 204, 158)";
        // mainPay.classList.remove('main-pay-active');
        // orderItemsWrap.classList.remove('main-cart-active');
        // mainCart.classList.remove('main-cart-active');
        // mainAddon.classList.remove('addon-active');
        mainAddon.innerHTML = '';
        mainItems.innerHTML = '';
        orderItemsWrap.innerHTML = '';
        orderPrice.innerHTML = '';
        textTotal.innerHTML = '0';
        menuNew.toggleAttribute('disabled');
        menuNew.style.color = "rgb(20, 204, 158)";
        menuNew.style.opacity = 1;
    }

function toggleStock() {
    if(mainCateg.classList.contains('stock-active')) {
        clearAll();
        switchStockButtonNameOff();
    }else{
        mainCateg.classList.toggle('stock-active');
        mainItems.classList.toggle('main-active');
        switchStockButtonNameOn();
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
    formAddCategoryOverlay.classList.remove('category-overlay-active');
    mainContent.classList.replace('main-content','main-content-form');
    formContainer.classList.add('form-container-active');
    stockLookupContainer.classList.remove('stock-lookup-container-active');
    mainAddon.innerHTML = '';
    orderItemsWrap.innerHTML = '';
    mainPay.classList.remove('main-pay-active');
    mainCart.classList.remove('main-cart-active');
    orderItemsWrap.classList.remove('main-cart-active');
    mainAddon.classList.remove('addon-active');
    console.log(event.target.innerHTML);
    document.querySelector('.stock-results-header').classList.remove('stock-results-header-active');
}
function displayLookup() {
    mainItems.innerHTML = '';
    document.querySelector('.stock-results').innerHTML = '';
    mainContent.classList.replace('main-content','main-content-form');
    stockLookupContainer.classList.add('stock-lookup-container-active');
    formContainer.classList.remove('form-container-active');
    mainAddon.innerHTML = '';
    orderItemsWrap.innerHTML = '';
    mainPay.classList.remove('main-pay-active');
    mainCart.classList.remove('main-cart-active');
    orderItemsWrap.classList.remove('main-cart-active');
    mainAddon.classList.remove('addon-active');
    console.log(event.target.innerHTML);
    document.querySelector('.stock-results-header').classList.add('stock-results-header-active');
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

function addNewForm(){
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



function stockLookupList() {
    let dbToSort = db;
    let dbSortedBtCat = dbToSort.sort(function(a, b) {
        var catA = a.category.toUpperCase(); // ignore upper and lowercase
        var catB = b.category.toUpperCase(); // ignore upper and lowercase
        if (catA < catB) {
          return -1;
        }
        if (catA > catB) {
            console.log(dbToSort);
          return 1;
        }
    });

    for (let i = 0; i < dbSortedBtCat.length; i++) {
        let itemOnDb = dbSortedBtCat[i];
        let divOnList = document.createElement('div');
        divOnList.classList.add('stock-results-item');
        divOnList.id = itemOnDb.name;
        let itemListName = document.createElement('div');
        itemListName.textContent = itemOnDb.name;
        let itemListCat = document.createElement('div');
        itemListCat.textContent = itemOnDb.category;
        let itemListPrice = document.createElement('div');
        itemListPrice.textContent = itemOnDb.price;
        let itemListCost = document.createElement('div');
        itemListCost.textContent = itemOnDb.cost;

        let itemListEdit = document.createElement('button');
        itemListEdit.classList.add('list-edit');
        itemListEdit.textContent = 'Edit';
        itemListEdit.value = 'Edit';

        let itemListDel = document.createElement('button');
        itemListDel.classList.add('list-delete');
        itemListDel.textContent = 'Delete';
        itemListDel.value = 'Delete';

        divOnList.appendChild(itemListName);
        divOnList.appendChild(itemListCat);
        divOnList.appendChild(itemListPrice);
        divOnList.appendChild(itemListCost);
        divOnList.appendChild(itemListEdit);
        divOnList.appendChild(itemListDel);

        document.querySelector('.stock-results').appendChild(divOnList);
        console.log('Done');
    }
}
function editAndDeleteButton(event) {
        if(event.target.innerHTML == 'Delete') {
            let itemName = event.path[1].childNodes[0].innerHTML
            
            function deleteItemConfirmation() {
                

                formAddCategoryOverlay.classList.add('category-overlay-active');
                formAddCategoryOverlay.innerHTML = '';
                let confirmDiv = document.createElement('div');
                confirmDiv.textContent = "Delete " + itemName + " ?";
                
                let itemListYesBtn = document.createElement('button');
                itemListYesBtn.classList.add('delete-yes');
                itemListYesBtn.textContent = 'Yes';
                itemListYesBtn.value = 'Yes';
            
                let itemListNoBtn = document.createElement('button');
                itemListNoBtn.classList.add('delete-no');
                itemListNoBtn.textContent = 'No';
                itemListNoBtn.value = 'No';
            
                confirmDiv.appendChild(itemListYesBtn);
                confirmDiv.appendChild(itemListNoBtn);
                formAddCategoryOverlay.appendChild(confirmDiv);
            
                document.querySelector('.delete-no').addEventListener('click', function(){
                    formAddCategoryOverlay.innerHTML = '';
                    formAddCategoryOverlay.classList.remove('category-overlay-active');
                    // stockLookupContainer.classList.remove('stock-lookup-container-active');  
                    console.log(confirmDiv, formAddCategoryOverlay.classList)
                })
                document.querySelector('.delete-yes').addEventListener('click', function(event){
                    if (event.target.innerHTML == "Yes") {
                        for (let i = 0; i < db.length; i++) {
                            let itemInList = db[i].name;

                            if (itemInList == itemName) {
                                let ItemToDelete = document.getElementById(itemName);
                                
                                console.log(ItemToDelete, itemName, itemInList);
                                document.querySelector('.stock-results').removeChild(ItemToDelete);
                                
                                oldDb = db;
                                db = oldDb.filter(oldDb => oldDb.name != ItemToDelete.id);
                                console.log(oldDb, db, ItemToDelete.id);
                                // let index = db.indexOf(itemName);
                                // if (index > -1) {
                                //    db.splice(index, 1);
                                //    console.log(db);
                                // }
                                
                            }
                        }
                        
                    }
                    
                    formAddCategoryOverlay.innerHTML = '';
                    formAddCategoryOverlay.classList.remove('category-overlay-active'); 
                    console.log(confirmDiv, formAddCategoryOverlay.classList)
                })
            
            
                
            }
            deleteItemConfirmation();

            console.log(event.path[1].childNodes[0].innerHTML, itemName);

        }else if(event.target.innerHTML == 'Edit') {
            console.log('no Edit');
        }
}
    document.querySelector('.stock-results').addEventListener('click', editAndDeleteButton);



    // Settings categ box options are added here
    if(event.target.innerHTML == 'ADD NEW') {
        displayForm();
        addNewForm();
    }else if(event.target.innerHTML == 'STOCK LOOKUP') {
        displayLookup();
        stockLookupList();
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
    formAddCategoryOverlay.innerHTML = '';
    let popUpDiv = document.createElement('div');
    popUpDiv.textContent = "New Category";
    popUpDiv.classList.add('new-categ-overlay');

    let newCategInput = document.createElement('input');
    newCategInput.type = "text";

    let newCategSubmit = document.createElement('button');
    newCategSubmit.classList.add('new-categ-submit');
    newCategSubmit.textContent = 'Add';
    newCategSubmit.value = 'Add';

    let newCategCancel = document.createElement('button');
    newCategCancel.classList.add('new-categ-cancel');
    newCategCancel.textContent = 'Cancel';
    newCategCancel.value = 'Cancel';

    popUpDiv.appendChild(newCategInput);
    popUpDiv.appendChild(newCategSubmit);
    popUpDiv.appendChild(newCategCancel);
    formAddCategoryOverlay.appendChild(popUpDiv);

    document.querySelector('.new-categ-cancel').addEventListener('click', function() {
        formAddCategoryOverlay.classList.remove('category-overlay-active');
    });
    
    document.querySelector('.new-categ-submit').addEventListener('click', function(event) {
        if(!(document.querySelector('.new-categ-overlay').value == '')) {
            let categOptionInForm = document.createElement('option');
                categOptionInForm.textContent = newCategInput.value;
                categOptionInForm.value = newCategInput.value;
                document.getElementById('add-category').appendChild(categOptionInForm);
                console.log("hello", document.querySelector('.new-categ-overlay').value, document.getElementById('add-category').innerText);
        formAddCategoryOverlay.classList.remove('category-overlay-active');
        document.querySelector('.new-categ-overlay').value = '';
        }else{
            console.log("hello", document.querySelector('.new-categ-overlay').value, document.getElementById('add-category').innerText);
        }
    });
}
formAddCategoryBtn.addEventListener('click', addNewCategory)




