let mainContent = document.querySelector('.main-content');
let mainMenu = document.querySelector('.main-menu');
let menuNew = document.querySelector('.menu-new');
let menuStock = document.querySelector('.menu-stock');
let mainCateg = document.querySelector('.main-categ')
let mainItems = document.querySelector('.main-items');
let mainAddon = document.querySelector('.main-addon');
let mainCart = document.querySelector('.main-cart');
let orderItemsWrap = document.querySelector('.order-items-wrap');    
let orderTotal = document.querySelector('#order-total-div');
let orderGst = document.querySelector('#order-gst-div');
let orderSubtotal = document.querySelector('#order-subtotal-div');

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
    console.log(listToSort);

    listSorted = listToSort.sort(function(a, b) {
        var itemA = a[criteria].toUpperCase();
        var itemB = b[criteria].toUpperCase();
        if (itemA < itemB) {
            return -1;
        }
        if(itemA > itemB) {
            return 1;
        }
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
            
        }
    }
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
}

function startNewOrder(event) {
    disableMenuButtons(menuNew, menuStock);
    menuCancelButton()

    mainCateg.innerHTML = '';

    let categProm = Promise.resolve(sortMyListBy(db, "category"));

    categProm.then(updateButtons(listSorted, "category", "categButton", mainCateg));
    
    console.log("Done: Categ Buttons");
};
menuNew.addEventListener('click', startNewOrder);

function clearThisAreas(...areas) {
    let areasToClean = [...areas];
    areasToClean.forEach(element => {
        element.innerHTML = '';
    });
}
function menuCancelButton(){
    let cancelButton = [{"name": "CANCEL"}]
    updateButtons(cancelButton, "name", "cancel-button", mainMenu, );
}
mainMenu.addEventListener('click', function(event){
    if (event.target.innerHTML == "CANCEL") {
        mainCart.classList.remove('active');
        clearThisAreas(mainCateg, mainItems, 
            mainAddon, orderItemsWrap);
            [orderSubtotal, orderGst, orderTotal].forEach(element => {
                let zero = 0;
                element.textContent = zero.toFixed(2);
            });
        enableMenuButtons(menuNew, menuStock);
        mainMenu.removeChild(event.target);
    }
})
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
    console.log("Done: Items Button")
    console.log("Done: Addons Button")

    mainCart.classList.add('active');
};
mainCateg.addEventListener('click', categSelection);



function updateTotals(itemPrice) {
    let totalNumber = Number(orderTotal.textContent) + Number(itemPrice);
    orderTotal.textContent = totalNumber.toFixed(2);

    orderGst.textContent = (totalNumber * 0.1).toFixed(2);
    let subtotalNumber = totalNumber - Number(orderGst.textContent);

    orderSubtotal.textContent = subtotalNumber.toFixed(2);
}
function addToItemBox(name, price, selectFrom) {

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
        console.log(name, price); 
        
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
        console.log(name, price); 

        [addonNameDiv, addonPriceDiv].forEach((element) => {
            addedItemBox.appendChild(element)
        }); 
    }
    updateTotals(price)
}
function addToOrder(event) {
    let itemNameSel = event.target.innerHTML;
    let itemPrice = function() {
        for (let i = 0; i < db.length; i++) {
            if(db[i].name == event.target.innerHTML) {
                console.log(db[i].price);
                return db[i].price
            }
        }
    }
    
    let selectFrom = event.path[1].className;
    if( itemNameSel.length > 0 && itemNameSel.length < 40) {
        console.log(event.path[1].className); 
        addToItemBox(itemNameSel, itemPrice(), selectFrom);
    };
}
mainItems.addEventListener('click', addToOrder);
mainAddon.addEventListener('click', addToOrder);



