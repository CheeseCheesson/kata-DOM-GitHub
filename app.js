const wrapper = document.querySelector(".wrapper")
const search = document.querySelector(".search");
const searchValue = document.querySelector(".search__value");
const cardContainer = document.querySelector(".card");
let searchResult = [];
let keyStr = "";

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

const createRepoList = function (item) {
  searchResult.push(item);
  const userItem = document.createElement("li");
  userItem.id = `${item.name}`;
  userItem.className = "search__item";
  userItem.innerHTML = `${item.name}`;
  searchValue.append(userItem);
};

const searchQueryRepo = async () => {
  if (search.value) {
    return await fetch(
      `https://api.github.com/search/repositories?q=${search.value}&per_page=5&page=1`,
      {}
    ).then((response) => {
      if (response.ok) {
        response.json().then((response) => {
          searchResult.length = 0;
          searchValue.innerHTML = "";
          response.items.forEach((element) => {
            createRepoList(element);
          });
        });
      } else {
        throw ({message: "Data don\'t loading..."})
      }
    }).catch(e => {
      console.log(e.message);
    });
  } else {
    searchValue.innerHTML = "";
  }
};

const createElemRepo = function (item) {
  cardContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="card__item">
  <div class="card__content">
  <div class="card__avatar">
  <img class="card__avatar-img" src="${item.owner.avatar_url}" alt="">

  </div>  
  <div class="card__name">
      Name: <span class="card__name-value">${item.name}</span>
    </div>
    <div class="card__owner">
      Owner: <span class="card__owner-value">${item.owner.login}</span>
    </div>
    <div class="card__stars">
      Stars: <span class="card__stars-value">${item.stargazers_count}</span>
    </div>
    
  </div>
  <div class="card__button">
    <span class="cross"></span>
  </div>
</div>
  `
  );
  search.value = "";
  searchValue.innerHTML = "";
};

const getData = function (element, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name == element) {
      return array[i];
    }
  }
};

const addItemRepo = function (event) {
  let liItem = event.target.closest("li");
  if (!liItem) {
    return;
  } else {
    const selectedItem = liItem.id;
    const selectedData = getData(selectedItem, searchResult);
    createElemRepo(selectedData);
  }
};

const removeList = function (event) {
  if (
    event.target.className === "card__button" ||
    event.target.className === "cross"
  ) {
    let targetList = event.target.closest(".card__item");
    targetList.remove();
  }
};
wrapper.addEventListener('click', ()=>{
  searchValue.innerHTML = "";
})
cardContainer.addEventListener("click", removeList);
searchValue.addEventListener("click", addItemRepo);
search.addEventListener("keydown", debounce(searchQueryRepo, 200));