let mainContent = document.querySelector(".main-content");
let mainMenu = document.querySelector(".main-menu");
let menuNew = document.querySelector(".menu-new");
let menuCancel = document.querySelector(".menu-cancel");
let menuStock = document.querySelector(".menu-stock");
let mainCateg = document.querySelector(".main-categ");
let mainItems = document.querySelector(".main-items");
let mainAddon = document.querySelector(".main-addon");
let mainCart = document.querySelector(".main-cart");
let orderItemsWrap = document.querySelector(".order-items-wrap");
let orderTotal = document.querySelector("#order-total-div");
let orderGst = document.querySelector("#order-gst-div");
let orderSubtotal = document.querySelector("#order-subtotal-div");
let stockLookupContainer = document.querySelector(".stock-container");
let stockResults = document.querySelector(".stock-results");
let stockAddNewButton = document.querySelector(".stock-add-new");
let popUpBoxGlobal = document.querySelector(".pop-up-box");

let productsList = [];

let db = [];
fetch("db.json")
  .then((res) => res.json())
  .then((data) => {
    db = data;
    console.log("Done: Fetch db");
  })
  .catch((err) => console.error(err));

let oldDb = [];
fetch("oldDb.json")
  .then((res) => res.json())
  .then((data) => {
    oldDb = data;
    console.log("Done: Fetch oldDb");
  })
  .catch((err) => console.error(err));

let listSorted = [];
function sortMyListBy(list, criteria) {
  let listToSort = list;

  listSorted = listToSort.sort(function (a, b) {
    var itemA = a[criteria].toUpperCase();
    var itemB = b[criteria].toUpperCase();
    if (itemA < itemB) {
      return -1;
    }
    if (itemA > itemB) {
      return 1;
    }
  });
  return listSorted;
}

function updateButtons(list, criteria, buttonClass, gridArea) {
  let buttonList = [];
  for (let i = 0; i < list.length; i++) {
    let item = list[i][criteria];
    let exactName = ">" + item + "&";
    let inner = mainCateg.innerHTML.replace(/</g, "&lt;");

    if (!inner.includes(exactName) && !(item == "Sides")) {
      buttonList += item;
      let newButton = document.createElement("button");
      newButton.classList.add(buttonClass);
      let buttonShows = document.createTextNode(item);
      newButton.appendChild(buttonShows);
      gridArea.appendChild(newButton);
    }
  }
}
function disableMenuButtons(...button1) {
  let buttonList = [...button1];
  buttonList.forEach((element) => {
    element.disabled = true;
    element.style["background-color"] = "rgba(150, 150, 150, 0.1)";
    element.style.color = "rgba(150, 150, 150, 0.3)";
    element.style.border = "2px solid rgba(150, 150, 150, 0.3)";
  });
}

function enableMenuButtons(...button1) {
  let buttonList = [...button1];
  buttonList.forEach((element) => {
    element.disabled = false;
    element.style["background-color"] = "rgba(150, 150, 150, 0.1)";
    element.style.color = "rgba(20, 204, 158)";
    element.style.border = "2px solid rgba(20, 204, 158)";
  });
}

function startNewOrder(event) {
    document.querySelector('.logo').style.animation = "logoIn 0.1s";
  disableMenuButtons(menuNew, menuStock);
  let cancelButton = [{ name: "CANCEL" }];
  updateButtons(cancelButton, "name", "close-active-tab", mainMenu);

  mainCateg.innerHTML = "";

  let categProm = Promise.resolve(sortMyListBy(db, "category"));

  categProm.then(
    updateButtons(listSorted, "category", "categButton", mainCateg)
  );
  
  categSelection();

}
menuNew.addEventListener("click", startNewOrder);

function clearThisAreas(...areas) {
  let areasToClean = [...areas];
  areasToClean.forEach((element) => {
    element.innerHTML = "";
  });
}
function createNewElement(args){
    let newElement = document.createElement(args[0]);
    newElement.textContent = args[1];
    newElement.classList.add(args[2])
    if(!(args[3] == null)) {
        newElement.classList.add(args[3]);
    }
    return newElement;
}
function closeActiveTab(event) {
  if (event.target.className == "close-active-tab") {
    mainCart.classList.remove("active");
    stockLookupContainer.classList.remove("active");
    if (!(mainContent.className == "main-content")) {
      mainContent.classList.replace("main-content-mgmt", "main-content");
    }
    clearThisAreas(mainCateg, mainItems, mainAddon, orderItemsWrap);

    [orderSubtotal, orderGst, orderTotal].forEach((element) => {
      let zero = 0;
      element.textContent = zero.toFixed(2);
    });
    enableMenuButtons(menuNew, menuStock);
    mainMenu.removeChild(event.target);
  }
}
mainMenu.addEventListener("click", closeActiveTab);

function categSelection(event) {
  mainItems.innerHTML = "";
  mainCart.classList.add("active"); //needs active for everything
  let categ = '';
  if(event == null) {
    categ = db[0].category;
  }else{
      categ = event.target.innerHTML;
  }
  
  let categItems = listSorted.filter(function (item) {
    return item.category == categ;
  });

  let itemProm = Promise.resolve(sortMyListBy(listSorted, "name"));
  itemProm.then(updateButtons(categItems, "name", "items", mainItems));

  let addonList = listSorted.filter(function (item) {
    return item.subcategory == categItems[0].type;
  });
  mainAddon.innerHTML = "";
  updateButtons(addonList, "name", "addons", mainAddon);

  mainCart.classList.add("active");
}
mainCateg.addEventListener("click", categSelection);

function updateTotals(itemPrice) {
  let totalNumber = Number(orderTotal.textContent) + Number(itemPrice);
  orderTotal.textContent = totalNumber.toFixed(2);

  orderSubtotal.textContent = (totalNumber / 1.1).toFixed(2);
  orderGst.textContent = (orderSubtotal.textContent * 0.1).toFixed(2);
}

function addToItemBox(name, price, selectFrom) {
  if (selectFrom == "items") {
    let addedItemBox = createNewElement(["div", '', "order-items"]);
    orderItemsWrap.appendChild(addedItemBox);

    let itemQtyDiv = createNewElement(["div", "1 x", "item-qty"]);
    let itemNameDiv = createNewElement(["div", name, "order-items-name"]);
    let itemPriceDiv = createNewElement(["div", price, "order-price"]);
    [itemQtyDiv, itemNameDiv, itemPriceDiv].forEach((element) => {
      addedItemBox.appendChild(element);
    });
  } else if (selectFrom == "addons") {
    
    let addonNameDiv = createNewElement(["div", "-" + name, "order-addon-name"]);
    let addonPriceDiv = createNewElement(["div", price, "order-addon-price"]);
    let addedItemBox = createNewElement(["div", '', "order-items"]);

    orderItemsWrap.appendChild(addedItemBox);

    [addonNameDiv, addonPriceDiv].forEach((element) => {
      addedItemBox.appendChild(element);
    });
  }
  updateTotals(price);
}
function addToOrder(event) {
  let itemNameSel = event.target.innerHTML;
  let itemPrice = function () {
    for (let i = 0; i < db.length; i++) {
      if (db[i].name == event.target.innerHTML) {
        return db[i].price;
      }
    }
  };
  let selectFrom = event.target.className;
  if (itemNameSel.length > 0 && itemNameSel.length < 40) {
    addToItemBox(itemNameSel, itemPrice(), selectFrom);
  }
}
mainItems.addEventListener("click", addToOrder);
mainAddon.addEventListener("click", addToOrder);

function popUpOverlay() {
  let popUpOverlay = createNewElement(["div", '', "pop-up-overlay"]);
  let popUpBox = createNewElement(["div", '', "pop-up-box"]);

  popUpOverlay.appendChild(popUpBox);
  mainContent.appendChild(popUpOverlay);
}
function cancelPopUp() {
  mainContent.removeChild(document.querySelector(".pop-up-overlay"));
}
function deleteItem(item, list) {
  let itemIndex = list.indexOf(item);
  list.splice(itemIndex, 1);
  return list;
}

function displayDeletePopUp(item, list) {
  let popUpProm = Promise.resolve(popUpOverlay());
  popUpProm.then(function () {
    let popUpBoxTitle = createNewElement(["div", "Delete " + item.name + "?"]);
    document.querySelector(".pop-up-box").appendChild(popUpBoxTitle);

    popUpProm.then(popUpActionButtons("Yes", "Cancel", item, list)).then(function(){
        document.querySelector('.pop-up-box-button-case').addEventListener('click', function(event) {
            if (event.target.innerHTML == "Yes") {
                deleteItem(item, list);
                cancelPopUp();
                displayListResult(list);
            }
        })
    });
  });
}

function displayListResult(list) {
  (stockResults.innerHTML = ""),
    list.forEach((item) => {
      let listItem = createNewElement(["div", '', "stock-results-item"]);
      stockResults.appendChild(listItem);

      let itemName = createNewElement(["div", item.name]);
      let itemCategory = createNewElement(["div", item.category]);
      let itemPrice = createNewElement(["div", item.price]);
      let editButton = createNewElement(["button", '', "action-button-green"]);
      let editIcon = createNewElement(["img", '', 'edit-img']);
      editIcon.src = "images/edit.png";
      editIcon.style.height = "2rem";
      editButton.appendChild(editIcon);
      let deleteButton = createNewElement(["button", '', "action-button-red"]);
      let deleteIcon = createNewElement(["img", '', 'delete-img']);
      deleteIcon.src = "images/bin.png";
      deleteIcon.style.height = "2rem";
      deleteButton.appendChild(deleteIcon);

      editButton.addEventListener('click', function(event){
          console.log(event.target)
        if (event.target.className == "action-button-green" || event.target.className == "edit-img") {
            let popUpProm = Promise.resolve(popUpOverlay());
            let formProm = Promise.resolve(
                displayAddNewPopUp("Category", "Name", "Price")
            );
            let buttonsProm = Promise.resolve(
                popUpActionButtons("Save", "Cancel")
            );

            popUpProm.then(formProm).then(buttonsProm).then(function() {
                document.querySelector('.add-form-category').disabled = true;
                document.querySelector('.add-form-category').style.opacity = 0.1;
                document.querySelector('.field-name').value = item.name;
                document.querySelector('.field-price').value = item.price;
                document.querySelector('.add-form-select').value = item.category;
                console.log(item.id);

                document.querySelector('.add-form-category').addEventListener('click', addCategoryToSelect)
                document.querySelector('.pop-up-box-button-case').addEventListener('click', function(event) {
                if (event.target.innerHTML == "Save") {

                    for (let i = 0; i < db.length; i++) {
                        if(item.id == db[i].id) {
                            item.name = document.querySelector('.field-name').value;
                            item.price = document.querySelector('.field-price').value;
                            item.category = document.querySelector('.add-form-select').value;  
                            if(!(document.querySelector('.add-form-sides-select') == null)) {
                                item.subcategory = document.querySelector('.add-form-sides-select').value;
                                delete item.type;
                            }
                            console.table(item)
                        }
                    }
                    cancelPopUp();
                    let listProm = Promise.resolve(sortMyListBy(db, "category"));

                    listProm.then(displayListResult(listSorted));
                    }
                })
            });
        }
      })
      deleteButton.addEventListener("click", function (event) {
        if (event.target.className == "action-button-red" || event.target.className == "delete-img") {
          displayDeletePopUp(item, db);
        }
      });

      [itemName, itemCategory, itemPrice, editButton, deleteButton].forEach(
        (element) => {
          listItem.appendChild(element);
        }
      );
    });
}

function goToStock(event) {
  disableMenuButtons(menuNew, menuStock);
  let doneButton = [{ name: "DONE" }];
  updateButtons(doneButton, "name", "close-active-tab", mainMenu);

  mainContent.classList.replace("main-content", "main-content-mgmt");
  stockLookupContainer.classList.add("active");

  let listProm = Promise.resolve(sortMyListBy(db, "category"));
  listProm.then(displayListResult(listSorted));
}
menuStock.addEventListener("click", goToStock);

function displayAddNewPopUp(...args) {
  let formContainer = createNewElement(["div", '', "add-form-container"]);

  let fieldNames = [...args];
  fieldNames.forEach((element) => {
    if (element == "Category") {
      let newField = createNewElement(["div", element, "add-form-label"]);
      let selectBox = createNewElement(["select", '', "add-form-select"]);
      let selectOption = createNewElement(["option", "Select One"]);
      selectBox.appendChild(selectOption);
      
      let optionsList = [];
      db.forEach((element) => {
        if (!optionsList.includes(element.category)) {
          optionsList.push(element.category);
          let selectOption = createNewElement(["option", element.category]);
          selectBox.appendChild(selectOption);
        }
      });
      let addCategButton = createNewElement(["button", "+", "add-form-category"]);
   
      [newField, selectBox, addCategButton].forEach((element) => {
        formContainer.appendChild(element);
      });
    } else if(element == "Name"){
      let newField = createNewElement(["div", element, "add-form-label"]);
      let newInput = createNewElement(["input", '', "add-form-input", "field-name"]);

      [newField, newInput].forEach((element) => {
        formContainer.appendChild(element);
      });
    }else if(element == "Price"){
        let newField = createNewElement(["div", element, "add-form-label"]);
        let newInput = createNewElement(["input", '', "add-form-input", "field-price"]);
      
        [newField, newInput].forEach((element) => {
          formContainer.appendChild(element);
        });
    }
  });

  document.querySelector(".pop-up-box").appendChild(formContainer);
  document.querySelector('.add-form-select').addEventListener('change', function(){
      if(document.querySelector('.add-form-select').value == "Sides") {
        let newType = createNewElement(["div", "Sub Category", "add-form-label", "label-sub"]);
    
        let newSelect = createNewElement(["select", '', "add-form-sides-select"]);
        newSelect.style.width = '75%';
        ['Food', 'Drinks'].forEach(element => {
            let newOption = createNewElement(["option", element]);
            newOption.textContent = element;
            newSelect.appendChild(newOption);
        });
        [newSelect, newType].forEach((element) => {
            document.querySelector('.add-form-container').insertBefore(element, document.querySelector('.add-form-container').childNodes[3]);
        });
      }else{
          if(!(document.querySelector('.label-sub') == null)) {
            document.querySelector('.add-form-container').removeChild(document.querySelector('.add-form-container').childNodes[3]);
            document.querySelector('.add-form-container').removeChild(document.querySelector('.add-form-container').childNodes[3]);
          }
      }
  })
}
function popUpActionButtons(confirm, cancel, item, list) {
  let newButtons = createNewElement(["div", '', "pop-up-box-button-case"]);
  let newButtonYes = createNewElement(["button", confirm, "action-button-green"]);
  let newButtonNo = createNewElement(["button", cancel, "action-button-red"]);
  
  [newButtonYes, newButtonNo].forEach((element) => {
    newButtons.appendChild(element);
  });

  document.querySelector(".pop-up-box").appendChild(newButtons);
  newButtonNo.addEventListener("click", cancelPopUp);
}
function addNewItemToList() {
    let newItem = {};
    if(!(document.querySelector('.add-form-select') == null) ) {
        newItem.category = document.querySelector('.add-form-select').value;
    }else{
        newItem.category = document.querySelector('.field-category').value;
    }
    newItem.name = document.querySelector('.field-name').value;
    newItem.price = Number(document.querySelector('.field-price').value).toFixed(2);
    newItem.id = Number(oldDb.length + 1);
    if(!(document.querySelector('.add-form-type-select') == null)){
        newItem.type = document.querySelector('.add-form-type-select').value;
    }else if(!(document.querySelector('.add-form-select').value == "Sides")){
        for (let i = 0; i < db.length; i++) {
            if(db[i].category == newItem.category) {
                newItem.type = db[i].type;
                break;
            }
        }
    }else if(document.querySelector('.add-form-select').value == "Sides") {
        newItem.subcategory = document.querySelector('.add-form-sides-select').value;
    }
    db.push(newItem);
    oldDb.push(newItem);
    console.table(newItem);
}

function addCategoryToSelect() {
    let activeForm = document.querySelector('.add-form-container');
    if(!(document.querySelector('.label-sub') == null)) {
        activeForm.removeChild(activeForm.childNodes[3]);
        activeForm.removeChild(activeForm.childNodes[3]);
      }
    activeForm.removeChild(activeForm.childNodes[0])
    activeForm.removeChild(activeForm.childNodes[0])
    activeForm.removeChild(activeForm.childNodes[0])
    
    let newField = createNewElement(["div", "New Category", "add-form-label"]);
    let newInput = createNewElement(["input", '', "add-form-input", "field-category"]);
    let newType = createNewElement(["div", "Type", "add-form-label"]);

    let newSelect = createNewElement(["select", '', "add-form-type-select"]);
    newSelect.style.width = '75%';
    ['Food', 'Drinks', 'Sweet'].forEach(element => {
        let newOption = createNewElement(["option", element]);
        newSelect.appendChild(newOption);
    });

    [newInput, newField, newSelect, newType].forEach((element) => {
        activeForm.insertBefore(element, activeForm.childNodes[0]);
    });
}

stockAddNewButton.addEventListener("click", function () {
  let popUpProm = Promise.resolve(popUpOverlay());
  let formProm = Promise.resolve(
    displayAddNewPopUp("Category", "Name", "Price")
  );
  let buttonsProm = Promise.resolve(
    popUpActionButtons("Add", "Cancel")
  );

  popUpProm.then(formProm).then(buttonsProm).then(function() {
    document.querySelector('.add-form-category').addEventListener('click', addCategoryToSelect)
    document.querySelector('.pop-up-box-button-case').addEventListener('click', function(event) {
    if (event.target.innerHTML == "Add") {
        addNewItemToList()
        cancelPopUp();
        let listProm = Promise.resolve(sortMyListBy(db, "category"));

        listProm.then(displayListResult(listSorted));
        }
    })
  });
});



