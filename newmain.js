let mainContent = document.querySelector('.main-content');
let menuNew = document.querySelector('.menu-new');
let mainCateg = document.querySelector('.main-categ')
let mainItems = document.querySelector('.main-items');
let mainAddon = document.querySelector('.main-addon');
let mainCart = document.querySelector('.main-cart');

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
            console.log("Done: updateButtons");
        }
    }
}
function startNewOrder() {
    mainCateg.innerHTML = '';
    sortMyListBy(db, "category")
        .then(updateButtons(listSorted, "category", "categButton", mainCateg))
}
menuNew.addEventListener('click', startNewOrder);

function categSelection(event){
    let categ = event.target.innerHTML;
    console.log(categ);


    let categItems = listSorted.filter(function(item){
        return item.category == categ;
    });

    mainItems.innerHTML = '';
    updateButtons(categItems, "name", "items", mainItems);
    
    let addonList = listSorted.filter(function(item){
        return item.subcategory == categItems[0].type;
    });
    mainAddon.innerHTML = '';
    updateButtons(addonList, "name", "items", mainAddon);
};



mainCateg.addEventListener('click', categSelection);







