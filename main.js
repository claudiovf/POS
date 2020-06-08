

let productsList = [];


document.getElementById('add-submit').addEventListener('click', function(event) {
    let inputs = document.querySelectorAll('.input-form');
    let newProduct = {};
        newProduct.category = document.getElementById('add-category').value;
        newProduct.name = document.getElementById('product-name').value;
        newProduct.price = document.getElementById('add-price').value;
        newProduct.cost = document.getElementById('add-cost').value;

    function export2txt() {

        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(productsList)], {
            type: "text/plain"
        }));
        a.setAttribute("download", "productsList.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    

productsList.push(newProduct);
console.log(productsList);

  export2txt();

event.preventDefault();

}, false);


