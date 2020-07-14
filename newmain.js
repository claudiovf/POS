let mainContent = document.querySelector('.main-content');
let menuNew = document.querySelector('.menu-new');
let mainCateg = document.querySelector('.main-categ')
let mainItems = document.querySelector('.main-items');
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


function sortMyListBy(list, criteria) {
    let listToSort = list;
    console.log(listToSort);

    let listSorted = listToSort.sort(function(a, b) {
        var itemA = a[criteria].toUpperCase();
        var itemB = b[criteria].toUpperCase();
        if (itemA < itemB) {
            return -1;
        }
        if(itemA > itemB) {
            return 1;
        }
    });
    console.log(listSorted);
};


    // function updateButtons()