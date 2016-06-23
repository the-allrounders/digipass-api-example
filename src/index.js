import './sass/style.scss';

const base_url = 'https://digipass-api.herokuapp.com/api';
const organisation_id = '576b90806013e1995016f345';
const organisation_token = 'lol456';

let user_id;

let user_preferences = {};
let user_active_filters = [];

let refresh_switch = true;

const available_filters = {
  "meal_type": [
    {
      "id": "1",
      "label": "Voorgerecht",
      "key": "entree",
      "classes": "active",
      "type": "meal_type"
    },
    {
      "id": "2",
      "label": "Hoofdgerecht",
      "key": "main_course",
      "classes": "active",
      "type": "meal_type"
    },
    {
      "id": "3",
      "label": "Nagerecht",
      "key": "dessert",
      "classes": "active",
      "type": "meal_type"
    }
  ],
  "made_without": [
    {
      "id": "4",
      "label": "Gluten",
      "key": "57669e2ed0bf105540f743d1",
      "classes": "",
      "type": "made_without"
    },
    {
      "id": "5",
      "label": "Noten",
      "key": "57669e2ed0bf105540f743d2",
      "classes": "",
      "type": "made_without"
    },
    {
      "id": "6",
      "label": "Zuivel",
      "key": "57669e2ed0bf105540f743c8",
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
  document.querySelector('#users-container').addEventListener('click', select_user);
  document.querySelector('#filters-container').addEventListener('click', toggle_filter);
  document.querySelector('#dishes-container').addEventListener('click', flip_card);
  document.querySelector('#show-inner-filters').addEventListener('click', toggle_inner_filters);
  document.querySelector('#toggle-users-sidebar').addEventListener('click', toggle_user_sidebar);
  print_filters();
  print_dishes();
  setInterval(fetch_users, 1000);
  setInterval(fetch_user_preferences, 1000);
}

function toggle_refresh_switch() {

}

function toggle_user_sidebar(e) {
  const button = get_parent_by_class('button', e.target);
  if (button) {
    document.querySelector('body').classList.toggle('users-sidebar-visible');
    button.classList.toggle('active');
  }
}

function fetch_users() {
  console.log(`${base_url}/organisations/${organisation_id}/users`);
  fetch(`${base_url}/organisations/${organisation_id}/users`, get_organisation_request())
    .then(response => {
      return response.json();
    }).then(data => {
      print_users(data);
  });
}

function print_users(users) {
  const users_container = document.querySelector('#users-container');
  const users_html = users.map(format_user);
  users_container.innerHTML = `<h2>Gebruikers in dit restaurant</h2><ul id="users-container-inner">${users_html.join('')}</ul>`;
}

function format_user(user) {
  user = user.user;
  return (
    `<li><button class="button user-button" data-id="${user._id}">${user.name.first} ${user.name.last}</button></li>`
  );
}

function select_user(e) {
  const user_button = get_parent_by_class('user-button', e.target);
  if (user_button) {
    user_id = user_button.getAttribute('data-id');
    const current_user_button = document.querySelector('.user-button.active');
    if (current_user_button) {
      current_user_button.classList.remove('active');
    }
    user_button.classList.add('active');
    document.querySelector('body').classList.remove('users-sidebar-visible');
    document.querySelector('#toggle-users-sidebar').classList.remove('active');
    fetch_user_preferences();
  }
}

function fetch_user_preferences() {
  if (user_id && user_id != '') {
    fetch(`${base_url}/users/${user_id}/preferences`, get_organisation_request())
      .then(response => {
        return response.json();
      }).then(data => {
        process_user_preferences(data);
    });
  }
}

function process_user_preferences(preferences) {
  if (preferences && preferences.length && JSON.stringify(user_preferences) != JSON.stringify(preferences)) {
    const new_active_filter_buttons = [];
    preferences.forEach(preference => {
      switch (preference.title) {
        case 'Allergieen':
          preference.values.forEach(value => {
            available_filters.made_without.forEach(filter => {
              if (value.value == "true" && filter.key == value._id) {
                const filter_button = document.querySelector(`[data-key="${filter.key}"]`);
                user_active_filters.push(get_active_filter_object(filter_button));
                new_active_filter_buttons.push(filter_button);
              }
            });
          });
          break;
        case 'Vegetarisch':
          if (preference.values[0].value == "true") {
            const filter_button = document.querySelector(`[data-key="vegetarian"]`);
            user_active_filters.push(get_active_filter_object(filter_button));
            new_active_filter_buttons.push(filter_button);
          } else {
            document.querySelector(`[data-key="vegetarian"]`).classList.remove('active');
          }
          break;
        case 'Veganistisch':
          if (preference.values[0].value == "true") {
            const filter_button = document.querySelector(`[data-key="vegan"]`);
            user_active_filters.push(get_active_filter_object(filter_button));
            new_active_filter_buttons.push(filter_button);
          } else {
            document.querySelector(`[data-key="vegan"]`).classList.remove('active');
          }
          break;
      }
    });
    if (user_active_filters.length) {
      // if (confirm("Er zijn nieuwe voorkeuren voor jou binnen gekomen. Menukaart aanpassen?")) {
        new_active_filter_buttons.forEach(filter => {
          filter.classList.add('active');
        });
        active_filters = active_filters.concat(user_active_filters);
        print_dishes();
      // }
    }
  }
  user_preferences = preferences;
}

function print_filters() {
  const container = document.querySelector('#filters-container');
  const inner_filters = container.querySelector('#inner-filters');

  const meal_type_filters = available_filters.meal_type.map(format_filter_button);
  const dish_info_filters = available_filters.dish_info.map(format_filter_button);
  const made_without_filters = available_filters.made_without.map(format_filter_button);
  inner_filters.insertAdjacentHTML('beforebegin', `<ul class="filters-container" id="meal-type-filters">${meal_type_filters.join('')}</ul>`);
  inner_filters.insertAdjacentHTML('beforeend', `<h2 class="filter-heading">Filters</h2><ul class="filters-container" id="dish-info-filters">${dish_info_filters.join('')}</ul>`);
  inner_filters.insertAdjacentHTML('beforeend', `<h2 class="filter-heading">Toon gerechten zonder</h2><ul class="filters-container" id="made-without-filters">${made_without_filters.join('')}</ul>`);
  init_active_filters();
}

function toggle_inner_filters(e) {
  const button = get_parent_by_class('button', e.target);
  if (button) {
    const filters_container = document.querySelector('#filters-container');
    filters_container.classList.toggle('inner-filters-visible');
    button.classList.toggle('active');
  }
}

function init_active_filters() {
  active_filters = Array.prototype.slice.call(document.querySelectorAll('.filter.active')).map(get_active_filter_object);
}

function format_filter_button(filter) {
  return (
    `<li class="filter-wrapper">` +
      `<button class="button filter filter-button ${filter.classes}" data-key="${filter.key}" data-value="${filter.value ? filter.value : ''}" data-filter="${filter.type}" data-id="${filter.id}">${filter.label}</button>` +
    `</li>`
  );
}

function toggle_filter(e) {
  const filter = get_parent_by_class('filter', e.target);
  if (filter) {
    if (filter.classList.contains('active')) {
      active_filters = active_filters.filter(active_filter => {
        return active_filter.id != filter.getAttribute('data-id');
      });
    } else {
      active_filters.push(get_active_filter_object(filter));
    }
    filter.classList.toggle('active');
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
  fetch('menu.json').then(response=> {
    return response.json();
  }).then(data=> {
    document.querySelector('#dishes-container').innerHTML = (data.filter(filter_dish).map(format_card).join(''));
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

function get_organisation_request() {
  const headers = new Headers({
    "Authorization": "Bearer " + organisation_token
  });
  return {
    headers
  };
}
