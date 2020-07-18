let mainContent = document.querySelector('.main-content');
let mainMenu = document.querySelector('.main-menu');
let menuNew = document.querySelector('.menu-new');
let menuStock = document.querySelector('.menu-stock');
let mainCateg = document.querySelector('.main-categ');
let mainItems = document.querySelector('.main-items');
let mainAddon = document.querySelector('.main-addon');
let mainCart = document.querySelector('.main-cart');
let orderItemsWrap = document.querySelector('.order-items-wrap');    
let orderTotal = document.querySelector('#order-total-div');
let orderGst = document.querySelector('#order-gst-div');
let orderSubtotal = document.querySelector('#order-subtotal-div');
let stockLookupContainer = document.querySelector('.stock-container');
let stockResults = document.querySelector('.stock-results');

let productsList = [];

let db = [];
fetch('db.json')
    .then(res => res.json())
    .then(data => {
        db = data;
        console.log("Done: Fetch db")
    })
    .catch(err => console.error(err));

let oldDb = [];
fetch('oldDb.json')
    .then(res => res.json())
    .then(data => {
        oldDb = data;
        console.log("Done: Fetch oldDb")
    })
    .catch(err => console.error(err));


let listSorted = [];
function sortMyListBy(list, criteria) {
    let listToSort = list;

    listSorted = listToSort.sort(function(a, b) {
        var itemA = a[criteria].toUpperCase();
        var itemB = b[criteria].toUpperCase();
        if (itemA < itemB) {
            return -1;
        }
        if(itemA > itemB) {
            return 1;
        };
    });
    return listSorted;
};

function updateButtons(list, criteria, buttonClass, gridArea) {
    let buttonList = [];
    for (let i = 0; i < list.length; i++) {
        let item = list[i][criteria];
        let exactName = ">" + item +  "&";
        let inner = mainCateg.innerHTML.replace(/</g, "&lt;");

        if (!(inner.includes(exactName)) && !(item == "Sides")) {
            buttonList += item;
            let newButton = document.createElement('button');
            newButton.classList.add(buttonClass);
            let buttonShows = document.createTextNode(item);
            newButton.appendChild(buttonShows);
            gridArea.appendChild(newButton);
            
        };
    };
};
function disableMenuButtons(...button1) {
    let buttonList = [...button1];
    buttonList.forEach(element => {
        element.disabled = true;
        element.style['background-color'] = 'rgba(150, 150, 150, 0.1)';
        element.style.color = 'rgba(150, 150, 150, 0.3)';
        element.style.border = '2px solid rgba(150, 150, 150, 0.3)';

    });
};

function enableMenuButtons(...button1) {
    let buttonList = [...button1];
    buttonList.forEach(element => {
        element.disabled = false;
        element.style['background-color'] = "rgba(150, 150, 150, 0.1)";
        element.style.color = "rgb(49, 134, 113)";
        element.style.border = "2px solid rgb(49, 134, 113)";
    });
};

function startNewOrder(event) {
    disableMenuButtons(menuNew, menuStock);
    let cancelButton = [{"name": "CANCEL"}]
    updateButtons(cancelButton, "name", "close-active-tab", mainMenu, );

    mainCateg.innerHTML = '';

    let categProm = Promise.resolve(sortMyListBy(db, "category"));

    categProm.then(updateButtons(listSorted, "category", "categButton", mainCateg));
};
menuNew.addEventListener('click', startNewOrder);

function clearThisAreas(...areas) {
    let areasToClean = [...areas];
    areasToClean.forEach(element => {
        element.innerHTML = '';
    });
};

function closeActiveTab(event){
    if (event.target.className == "close-active-tab") {
        mainCart.classList.remove('active');
        stockLookupContainer.classList.remove('active');
        if (!(mainContent.className =='main-content')) {
            mainContent.classList.replace('main-content-mgmt', 'main-content');
        };
        clearThisAreas(mainCateg, mainItems, mainAddon, orderItemsWrap);
        
        [orderSubtotal, orderGst, orderTotal].forEach(element => {
                let zero = 0;
                element.textContent = zero.toFixed(2);
            });
        enableMenuButtons(menuNew, menuStock);
        mainMenu.removeChild(event.target);
    };
};
mainMenu.addEventListener('click', closeActiveTab)

function categSelection(event){
    mainItems.innerHTML = '';
    mainCart.classList.add('active'); //needs active for everything
    let categ = event.target.innerHTML;
    let categItems = listSorted.filter(function(item){
        return item.category == categ;
    });


    let itemProm = Promise.resolve(sortMyListBy(listSorted, "name"));
    itemProm.then(updateButtons(categItems, "name", "items", mainItems));
    
    let addonList = listSorted.filter(function(item){
        return item.subcategory == categItems[0].type;
    });
    mainAddon.innerHTML = '';
    updateButtons(addonList, "name", "items", mainAddon);

    mainCart.classList.add('active');
};
mainCateg.addEventListener('click', categSelection);

function updateTotals(itemPrice) {
    let totalNumber = Number(orderTotal.textContent) + Number(itemPrice);
    orderTotal.textContent = totalNumber.toFixed(2);
    
    orderSubtotal.textContent = (totalNumber / 1.1).toFixed(2);
    orderGst.textContent = (orderSubtotal.textContent * 0.1).toFixed(2);
};
function addToItemBox(name, price, selectFrom) {
console.log(name, price, selectFrom);
    
    if(selectFrom == "main-items") {
        let itemQtyDiv = document.createElement('div');
        itemQtyDiv.classList.add('item-qty');
        itemQtyDiv.textContent = "1 x"

        let itemNameDiv = document.createElement('div');
        itemNameDiv.classList.add('order-items-name');
        itemNameDiv.textContent = name;

        let itemPriceDiv = document.createElement('div');
        itemPriceDiv.classList.add('order-price');
        itemPriceDiv.textContent = price;

        let addedItemBox = document.createElement('div');
        addedItemBox.classList.add('order-items');
        orderItemsWrap.appendChild(addedItemBox);   
        
        [itemQtyDiv, itemNameDiv, itemPriceDiv].forEach((element) => {
            addedItemBox.appendChild(element)
        });
    }else if(selectFrom == "main-addon"){
        let addonNameDiv = document.createElement('div');
        addonNameDiv.classList.add('order-addon-name');
        addonNameDiv.textContent = '-' + name;

        let addonPriceDiv = document.createElement('div');
        addonPriceDiv.classList.add('order-addon-price');
        addonPriceDiv.textContent = price;

        let addedItemBox = document.createElement('div');
        addedItemBox.classList.add('order-items');
        orderItemsWrap.appendChild(addedItemBox); 

        [addonNameDiv, addonPriceDiv].forEach((element) => {
            addedItemBox.appendChild(element)
        }); 
    };
    updateTotals(price)
};
function addToOrder(event) {
    let itemNameSel = event.target.innerHTML;
    

    var itemPrice = function() {
        for (let i = 0; i < db.length; i++) {
            if(db[i].name == event.target.innerHTML) {
                
                return db[i].price;
            }
        }
    };
    
    
    let selectFrom = event.path[1].className;
        
    if( itemNameSel.length > 0 && itemNameSel.length < 60) {
       
        addToItemBox(itemNameSel, itemPrice(), selectFrom);
    }
};
mainItems.addEventListener('click', addToOrder);
mainAddon.addEventListener('click', addToOrder);

function popUpOverlay() {
    let popUpOverlay = document.createElement('div');
        popUpOverlay.classList.add('pop-up-overlay');

    let popUpBox = document.createElement('div');
        popUpBox.classList.add('pop-up-box');
        popUpOverlay.appendChild(popUpBox);
        mainContent.appendChild(popUpOverlay);
};
function displayDeletePopUp(name, list) {
    let popUpProm = Promise.resolve(popUpOverlay());  
    popUpProm.then(function() {
        let popUpBoxTitle = document.createElement('div');
        popUpBoxTitle.textContent = 'Delete ' + name + '?';

            let newButtons = document.createElement('div');

            let newButtonYes = document.createElement('button');
            newButtonYes.classList.add('action-button-green');
            newButtonYes.textContent = 'Yes';
            
            let newButtonNo = document.createElement('button');
            newButtonNo.classList.add('action-button-red');
            newButtonNo.textContent = 'Cancel';

            [newButtonYes, newButtonNo].forEach(element => {
                newButtons.appendChild(element);
            });
            [popUpBoxTitle, newButtons].forEach(element => {
                document.querySelector('.pop-up-box').appendChild(element);

        
        });
    });
};


// function displayEditBox(item) {
//     console.log('Waiting code')
// }
function displayListResult(list){
    
    list.forEach(element => {
        let listItem = document.createElement('div');
        listItem.classList.add('stock-results-item');
        stockResults.appendChild(listItem);

        let itemName = document.createElement('div');
        itemName.textContent = element.name;

        let itemCategory = document.createElement('div');
        itemCategory.textContent = element.category;

        let itemPrice = document.createElement('div');
        itemPrice.textContent = element.price; 

        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('action-button-green')
    

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('action-button-red')
        
        deleteButton.addEventListener('click', function(event){
            console.log(event.target.innerHTML)
                if(event.target.innerHTML == 'Delete'){
                    displayDeletePopUp(element.name, db)
                };
            });   
        
        [itemName, itemCategory, itemPrice, editButton, deleteButton].forEach(element => {
            listItem.appendChild(element);
        
        });
        
    });
};

function goToStock(event) {
    disableMenuButtons(menuNew, menuStock)
    let doneButton = [{"name": "DONE"}]
    updateButtons(doneButton, "name", "close-active-tab", mainMenu, );
    mainContent.classList.replace('main-content', 'main-content-mgmt');
    stockLookupContainer.classList.add('active');

    let listProm = Promise.resolve(sortMyListBy(db, "category"));

    listProm.then(displayListResult(listSorted));
    
};
menuStock.addEventListener('click', goToStock);




