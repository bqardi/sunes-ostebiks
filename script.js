var url = new URLSearchParams(location.search);

var cheeses = document.querySelector(".cheeses");
var navLeft = document.querySelector(".js-nav-left");
var navRight = document.querySelector(".js-nav-right");

var paramObj = setParamObj(0, url.get("page"));

getData(`https://express.bqardi.dk/api/v1/cheeses${paramObj.paramStr}`, displayCheeses);

function getData(url, callback){
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var link = "./index.html?page=";
            navLeft.href = link + paramObj.prev;
            navRight.href = data.next ? link + paramObj.next : link + paramObj.current;
            callback(data);
        });
}

function setParamObj(limit, page){
    var limitStr = "";
    if (limit > 0) {
        limitStr = `${page ? "" : "?"}limit=${limit}${page ? "&" : ""}`;
    }
    page = parseInt(page);
    return {
        paramStr: page ? `?${limitStr}page=${page}` : limitStr,
        current: page || 1,
        prev: page - 1 || 1,
        next: page + 1 || 2
    }
}

function displayCheeses(data){
    cheeses.innerHTML = "";
    data.results.forEach(item => {
        var cheese = createCheese(item);
        cheeses.appendChild(cheese);
    });
}

function createCheese(data){
    var cheese = document.createElement("article");
    cheese.className = "cheeses__item";

    var title = document.createElement("h2");
    title.className = "cheeses__title";
    title.textContent = data.name;
    
    var price = document.createElement("p");
    price.className = "cheeses__price";
    price.textContent = "kr. " + data.price.$numberDecimal;
    
    var weight = document.createElement("p");
    weight.className = "cheeses__weight";
    weight.textContent = "Vægt: " + data.weight + "g";

    
    cheese.append(
        title,
        price,
        createImg(data),
        weight,
        createStrengthBar(data.strength)
    );

    return cheese;
}

function createImg(data){
    var imgContainer = document.createElement("div");
    imgContainer.className = "cheeses__container";    
    var img = document.createElement("img");
    img.className = "cheeses__img";
    img.src = "https://express.bqardi.dk/api/v1/cheeses/image/" + data.img;
    img.alt = data.name;
    img.title = data.name;
    imgContainer.appendChild(img);
    return imgContainer;
}

function createStrengthBar(dataStrength){
    var strength = document.createElement("div");
    var strengthTitle = document.createElement("p");
    var strengthBar = document.createElement("div");

    var strengthIconHTML = `<svg viewBox="0 0 24 24"><path d="M3 18.34C3 18.34 4 7.09 7 3L12 4L11 7.09H9V14.25H10C12 11.18 16.14 10.06 18.64 11.18C21.94 12.71 21.64 17.32 18.64 19.36C16.24 21 9 22.43 3 18.34Z"></path></svg>`;
    
    strength.className = "cheeses__strength";
    strengthTitle.className = "cheeses__strengthTitle";
    strengthBar.className = "cheeses__strengthBar";
    
    strengthTitle.textContent = "Styrke:";

    var strengthAmount = getStrength(dataStrength);
    for (let i = 0; i < strengthAmount; i++) {
        strengthBar.innerHTML += strengthIconHTML;
    }

    strength.append(strengthTitle, strengthBar);

    return strength;
}

function getStrength(strengthStr){
    switch (strengthStr) {
        case "mild":
            return 1;
        case "mellem":
            return 2;
        case "kraftig":
            return 3;
    
        default:
            break;
    }
    return 0;
}