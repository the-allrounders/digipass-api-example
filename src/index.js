import '../sass/style.scss';

function init() {
    document.querySelector('#container').addEventListener('click', e => {
        const card = get_clicked_card("card", e.target);
        if(card){
            card.classList.toggle('flip');
        }

    });
    fetch("menu.json").then(response=> {
        return response.json();
    }).then(data=> {
        const items = data.filter(filter_dish).map(format_card);
        document.querySelector("#container").innerHTML = (items.join(""));
    });
}
function format_card(item){
    return (
        ` <div class="card">`+
        `<div class="front">`+
            `<img src="${item.image}">`+
            `<div class ="bar">`+
           ` <h4>${item.course}</h4>`+
        `</div>`+
           ` <h3>${item.name}</h3>`+
        `</div>`+
        `<div class="back">`+
        //`<img src="${item.image}" id="imageSmall">`+
        `<div class ="bar">`+
            `<h4>Ingredients</h4>`+
        ` </div>`+
            `<p>${item.ingredients.join("- ")} </p>`+
        `<div class ="bar">`+
            `<h4>Origin</h4>`+
        ` </div>`+
            `${dataOrigin(item.origin)}`+
       ` </div>`+
   ` </div>`
    )
}

document.addEventListener("DOMContentLoaded", init);

function dataOrigin(origins){
    const origins_html = origins.map(format_origin);
    return `<ul>${origins_html.join("")}</ul>`;
}

function format_origin(origin) {
    return (
        `<li>${origin.title} - ${origin.origin}</li>`
    );
}

function get_clicked_card(parentClass, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node.className && node.className.indexOf(parentClass) > -1) {
            return node;
        }
        node = node.parentNode;
    }
    return false;
}

function filter_dish(item){
    console.log(item);
    return item.vegetarian.value;
}

