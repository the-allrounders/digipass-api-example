import './sass/style.scss';

const available_filters = {
  "meal_type": [
    {
      "id": "1",
      "label": "Voorgerecht",
      "key": "entree",
      "classes": "active-filter",
      "type": "meal_type"
    },
    {
      "id": "2",
      "label": "Hoofdgerecht",
      "key": "main_course",
      "classes": "active-filter",
      "type": "meal_type"
    },
    {
      "id": "3",
      "label": "Nagerecht",
      "key": "dessert",
      "classes": "active-filter",
      "type": "meal_type"
    }
  ],
  "made_without": [
    {
      "id": "4",
      "label": "Gluten",
      "key": "gluten",
      "classes": "",
      "type": "made_without"
    },
    {
      "id": "5",
      "label": "Noten",
      "key": "noten",
      "classes": "",
      "type": "made_without"
    },
    {
      "id": "6",
      "label": "Zuivel",
      "key": "zuivel",
      "classes": "",
      "type": "made_without"
    }
  ],
  "dish_info": [
    {
      "id": "7",
      "label": "Vegetarisch",
      "key": "vegetarian",
      "classes": "",
      "type": "dish_info"
    },
    {
      "id": "8",
      "label": "Veganistisch",
      "key": "vegan",
      "classes": "",
      "type": "dish_info"
    },
    {
      "id": "9",
      "label": "Halal",
      "key": "halal",
      "classes": "",
      "type": "dish_info"
    }
  ]
};

let active_filters = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
  document.querySelector('#filters_container').addEventListener('click', toggle_filter);
  document.querySelector('#dishes_container').addEventListener('click', flip_card);
  print_filters();
  print_dishes();
}

function print_filters() {
  const container = document.querySelector('#filters_container');
  const inner_filters = container.querySelector('#inner_filters');

  const meal_type_filters = available_filters.meal_type.map(format_filter_button);
  const dish_info_filters = available_filters.dish_info.map(format_filter_button);
  const made_without_filters = available_filters.made_without.map(format_filter_button);
  inner_filters.insertAdjacentHTML('beforebegin', `<h2 class="filter-heading">Gangen</h2><ul id="meal_type_filters">${meal_type_filters.join('')}</ul>`);
  inner_filters.insertAdjacentHTML('beforeend', `<h2 class="filter-heading">Filters</h2><ul id="dish_info_filters">${dish_info_filters.join('')}</ul>`);
  inner_filters.insertAdjacentHTML('beforeend', `<h2 class="filter-heading">Toon gerechten zonder</h2><ul id="made_without_filters">${made_without_filters.join('')}</ul>`);
  init_active_filters();
}

function init_active_filters() {
  active_filters = Array.prototype.slice.call(document.querySelectorAll('.filter.active-filter')).map(get_active_filter_object);
}

function format_filter_button(filter) {
  return (
    `<li class="filter-wrapper">` +
      `<button class="filter filter-button ${filter.classes}" data-key="${filter.key}" data-value="${filter.value ? filter.value : ''}" data-filter="${filter.type}" data-id="${filter.id}">${filter.label}</button>` +
    `</li>`
  );
}

function toggle_filter(e) {
  const filter = get_parent_by_class('filter', e.target);
  if (filter) {
    if (filter.classList.contains('active-filter')) {
      active_filters = active_filters.filter(active_filter => {
        return active_filter.id != filter.getAttribute('data-id');
      });
    } else {
      active_filters.push(get_active_filter_object(filter));
    }
    filter.classList.toggle('active-filter');
    print_dishes();
  }
}

function get_active_filter_object(filter) {
  return {
    "id": filter.getAttribute('data-id'),
    "type": filter.getAttribute('data-filter'),
    "value": filter.getAttribute('data-value'),
    "key": filter.getAttribute('data-key')
  }
}

function filter_dish(item) {
  // console.log(item);
  let keep_dish = true;
  let temp_keep_dish = false;
  let break_loop = false;
  active_filters.forEach(active_filter => {
    if (break_loop) return;
    switch (active_filter.type) {
      case 'meal_type':
        temp_keep_dish = !temp_keep_dish ? item.meal_type == active_filter.key : true;
        break;
      case 'made_without':
        item.allergens.forEach(allergen => {
          if (allergen.key == active_filter.key) {
            keep_dish = false;
            break_loop = true;
          }
        });
        break;
      case 'dish_info':
        item.filters.forEach(filter => {
          console.log(active_filter);
          if (filter.key == active_filter.key && !filter.value) {
            keep_dish = false;
            break_loop = true;
          }
        });
        break;
    }
  });
  return keep_dish ? temp_keep_dish : keep_dish;
}

function print_dishes() {
  console.log(active_filters);
  fetch('menu.json').then(response=> {
    return response.json();
  }).then(data=> {
    document.querySelector('#dishes_container').innerHTML = (data.filter(filter_dish).map(format_card).join(''));
  });
}

function format_card(item) {
  return (
    `<div class="card">` +
      `<div class="front">` +
        `<img src="${item.image}">` +
        `<div class ="bar">` +
          `<h4>${item.course}</h4>` +
        `</div>` +
        `<h3>${item.name}</h3>` +
      `</div>` +
      `<div class="back">` +
      `<div class="bar">` +
        `<h4>Ingredients</h4>` +
      `</div>` +
      `<p>${item.ingredients.join(" - ")}</p>` +
      `<div class ="bar">` +
        `<h4>Origin</h4>` +
      `</div>` +
      `${format_dish_origins(item.origin)}` +
      `</div>` +
    `</div>`
  )
}

function format_dish_origins(origins) {
  const origins_html = origins.map(format_origin);
  return `<ul>${origins_html.join('')}</ul>`;
}

function format_origin(origin) {
  return (
    `<li>${origin.title} - ${origin.origin}</li>`
  );
}

function flip_card(e) {
  const card = get_parent_by_class('card', e.target);
  if (card) {
    card.classList.toggle('flip');
  }
}

function get_parent_by_class(parentClass, child) {
  var node = child;
  while (node != null) {
    if (node.className && node.classList.contains(parentClass)) {
      return node;
    }
    node = node.parentNode;
  }
  return false;
}

