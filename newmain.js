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
    element.style.color = "rgb(49, 134, 113)";
    element.style.border = "2px solid rgb(49, 134, 113)";
  });
}

function startNewOrder(event) {
  disableMenuButtons(menuNew, menuStock);
  let cancelButton = [{ name: "CANCEL" }];
  updateButtons(cancelButton, "name", "close-active-tab", mainMenu);

  mainCateg.innerHTML = "";

  let categProm = Promise.resolve(sortMyListBy(db, "category"));

  categProm.then(
    updateButtons(listSorted, "category", "categButton", mainCateg)
  );
}
menuNew.addEventListener("click", startNewOrder);

function clearThisAreas(...areas) {
  let areasToClean = [...areas];
  areasToClean.forEach((element) => {
    element.innerHTML = "";
  });
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
  let categ = event.target.innerHTML;
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
    let itemQtyDiv = document.createElement("div");
    itemQtyDiv.classList.add("item-qty");
    itemQtyDiv.textContent = "1 x";

    let itemNameDiv = document.createElement("div");
    itemNameDiv.classList.add("order-items-name");
    itemNameDiv.textContent = name;

    let itemPriceDiv = document.createElement("div");
    itemPriceDiv.classList.add("order-price");
    itemPriceDiv.textContent = price;

    let addedItemBox = document.createElement("div");
    addedItemBox.classList.add("order-items");
    orderItemsWrap.appendChild(addedItemBox);

    [itemQtyDiv, itemNameDiv, itemPriceDiv].forEach((element) => {
      addedItemBox.appendChild(element);
    });
  } else if (selectFrom == "addons") {
    let addonNameDiv = document.createElement("div");
    addonNameDiv.classList.add("order-addon-name");
    addonNameDiv.textContent = "-" + name;

    let addonPriceDiv = document.createElement("div");
    addonPriceDiv.classList.add("order-addon-price");
    addonPriceDiv.textContent = price;

    let addedItemBox = document.createElement("div");
    addedItemBox.classList.add("order-items");
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
  let popUpOverlay = document.createElement("div");
  popUpOverlay.classList.add("pop-up-overlay");

  let popUpBox = document.createElement("div");
  popUpBox.classList.add("pop-up-box");
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
    let popUpBoxTitle = document.createElement("div");
    popUpBoxTitle.textContent = "Delete " + item.name + "?";

    [popUpBoxTitle].forEach((element) => {
      document.querySelector(".pop-up-box").appendChild(element);
    });

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
      let listItem = document.createElement("div");
      listItem.classList.add("stock-results-item");
      stockResults.appendChild(listItem);

      let itemName = document.createElement("div");
      itemName.textContent = item.name;

      let itemCategory = document.createElement("div");
      itemCategory.textContent = item.category;

      let itemPrice = document.createElement("div");
      itemPrice.textContent = item.price;

      let editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("action-button-green");

      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("action-button-red");
      deleteButton.addEventListener("click", function (event) {
        if (event.target.innerHTML == "Delete") {
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
  let formContainer = document.createElement("div");
  formContainer.classList.add("add-form-container");

  let fieldNames = [...args];
  fieldNames.forEach((element) => {
    if (element == "Category") {
      let newField = document.createElement("div");
      newField.textContent = element;
      newField.classList.add("add-form-label");
      let selectBox = document.createElement("select");
      selectBox.classList.add("add-form-select");
      let optionsList = [];
      let selectOption = document.createElement("option");
      selectOption.textContent = "Select One";
      selectBox.appendChild(selectOption);
      db.forEach((element) => {
        if (!optionsList.includes(element.category)) {
          optionsList.push(element.category);
          let selectOption = document.createElement("option");
          selectOption.textContent = element.category;
          selectBox.appendChild(selectOption);
        }
      });
      let addCategButton = document.createElement("button");
      addCategButton.classList.add("add-form-category");
      addCategButton.textContent = '+';
      [newField, selectBox, addCategButton].forEach((element) => {
        formContainer.appendChild(element);
      });
    } else if(element == "Name"){
      let newField = document.createElement("div");
      newField.textContent = element;
      newField.classList.add("add-form-label");
      let newInput = document.createElement("input");
      newInput.classList.add("add-form-input");
      newInput.classList.add('field-name');
      newInput.type = "text";
      [newField, newInput].forEach((element) => {
        formContainer.appendChild(element);
      });
    }else if(element == "Price"){
        let newField = document.createElement("div");
        newField.textContent = element;
        newField.classList.add("add-form-label");
        let newInput = document.createElement("input");
        newInput.classList.add("add-form-input");
        newInput.classList.add('field-price');
        newInput.type = "text";
        [newField, newInput].forEach((element) => {
          formContainer.appendChild(element);
        });
    }
  });

  document.querySelector(".pop-up-box").appendChild(formContainer);
  document.querySelector('.add-form-select').addEventListener('change', function(){
      if(document.querySelector('.add-form-select').value == "Sides") {
    
        let newType = document.createElement("div");
        newType.textContent = "Sub Category";
        newType.classList.add("add-form-label");
        newType.classList.add("label-sub");
    
        let newSelect = document.createElement("select");
        newSelect.classList.add("add-form-sides-select");
        newSelect.style.width = '75%';
        ['Food', 'Drinks'].forEach(element => {
            let newOption = document.createElement('option');
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
  let newButtons = document.createElement("div");

  let newButtonYes = document.createElement("button");
  newButtonYes.classList.add("action-button-green");
  newButtonYes.textContent = confirm;

  let newButtonNo = document.createElement("button");
  newButtonNo.classList.add("action-button-red");
  newButtonNo.textContent = cancel;

  [newButtonYes, newButtonNo].forEach((element) => {
    newButtons.appendChild(element);
    newButtons.classList.add("pop-up-box-button-case");
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
    
    let newField = document.createElement("div");
    newField.textContent = "New Category";
    newField.classList.add("add-form-label");
    let newInput = document.createElement("input");
    newInput.classList.add("add-form-input");
    newInput.classList.add("field-category");
    newInput.type = "text";

    let newType = document.createElement("div");
    newType.textContent = "Type";
    newType.classList.add("add-form-label");

    let newSelect = document.createElement("select");
    newSelect.classList.add("add-form-type-select");
    newSelect.style.width = '75%';
    ['Food', 'Drinks', 'Sweet'].forEach(element => {
        let newOption = document.createElement('option');
        newOption.textContent = element;
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



