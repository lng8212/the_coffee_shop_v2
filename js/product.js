const API_URL = "http://localhost:8080/CoffeeShop";

var totalPrice = 0;
var totalTopping = 0;
var totalSize = 0;
var cart = [];

var item = {
  id: 1,
  name_drink: "",
  price: 0,
  img: "",
  id_type: 3,
  size: "S",
  topping: [],
  descript: "",
  quantity: 1,
};

function addToCart() {
  console.log(item);
  cart.push(item);
  sessionStorage.setItem("cart", JSON.stringify(cart));
  alert("Thêm vào giỏ hàng thành công!");
  const numberOfCart = $(".number-of-bag").text();
  $("#number-of-bag").text(Number(numberOfCart) + 1);
  $("#close-mymodal").click();
  item = {
    id: 1,
    name_drink: "",
    price: 0,
    img: "",
    id_type: 3,
    size: "S",
    topping: [],
    descript: "",
    quantity: 1,
  };
}

function onIncreQuantityModal() {
  item.quantity += 1;
  totalPrice = item.price * item.quantity;
  item.totalPrice = totalPrice + totalTopping + totalSize;
  $("#buttonAddModal").text(
    `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
  );
  $("#quantityModal").text(item.quantity);
}

function onDecreQuantityModal() {
  if (item.quantity > 1) {
    item.quantity -= 1;
    totalPrice = item.price * item.quantity;
    item.totalPrice = totalPrice + totalTopping + totalSize;
    $("#buttonAddModal").text(
      `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
    );
    $("#quantityModal").text(item.quantity);
  }
}

function onChangeSize(name, value) {
  totalSize = (item.price * value) / 100;
  console.log(name.id);
  item.size = name.id;
  item.totalPrice = totalPrice + totalTopping + totalSize;
  $("#buttonAddModal").text(
    `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
  );
}

function onIncreQuantityTopping(id, price) {
  const quantityTopping = $(`#${id + "topping"}`);
  let q = quantityTopping.text();
  if (Number(q) === 0) {
    totalTopping += price;
    item.topping.push(id);
    item.totalPrice = totalPrice + totalTopping + totalSize;
    $("#buttonAddModal").text(
      `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
    );
    quantityTopping.text(1);
  }
}

function onDecreQuantityTopping(id, price) {
  const quantityTopping = $(`#${id + "topping"}`);
  let q = quantityTopping.text();
  if (Number(q) === 1) {
    totalTopping -= price;
    item.topping = item.topping.filter((id) => id === id);
    item.totalPrice = totalPrice + totalTopping + totalSize;
    $("#buttonAddModal").text(
      `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
    );
    quantityTopping.text(0);
  }
}

$(document).ready(function () {
  let cartJSON = sessionStorage.getItem("cart");
  let carts = [];
  if (cartJSON) {
    carts = JSON.parse(cartJSON);
    cart = carts;
  }
  $(document).ajaxStart(function () {
    $(".loading").css("display", "flex");
  });
  $(document).ajaxStop(function () {
    $(".loading").hide();
  });

  $.ajax({
    url: `${API_URL}/getDrinks`,
    success: function (result) {
      console.log(result);

      $("#getDrinksProduct").empty();

      if (result) {
        result.forEach((product, index) => {
          $("#getDrinksProduct").append(`
            <div class="product-item">
              <img src="${product.img}"
                  alt="${product.name_drink}" />
              <h3>${product.name_drink}</h3>
              <div class="product-item__price">
                  <div>
                      <p class="price-discount">
                      ${product.price} đ
                      </p>
                  </div>
                  <a href="#ex1" rel="modal:open" data-id="${product.id_drink}" class="openModalDialog">
                      <span class="btn-add" id="myBtn">
                          <img src='../assets/plus.svg' alt="" />
                      </span>
                  </a>
                  </div>
              </div>
            `);
        });
      }
    },
  });
});

$(document).on("click", ".openModalDialog", function () {
  let myDrinkId = $(this).data("id");
  console.log(myDrinkId);

  $("#buttonAddModal").attr("disabled", true);

  $("#getListTopping").empty();
  $("#getListSize").empty();
  $("#getDrinkModal").empty();

  $.ajax({
    url: `${API_URL}/get-drink-by-id?id=${myDrinkId}`,
    success: function (result) {
      console.log(result);
      if (result) {
        $("#buttonAddModal").attr("disabled", false);
        item = Object.assign(item, result);
        totalPrice = item.quantity * item.price;
        item.totalPrice = totalPrice + totalTopping + totalSize;
        $("#buttonAddModal").text(
          `${totalPrice + totalTopping + totalSize} đ - Thêm vào giỏ hàng`
        );
        $("#getDrinkModal").append(`
          <div class="order-image">
            <img src="${result.img}" alt="${result.name_drink}" />
            </div>
          `).append(`
          <div class="order-order">
          <h1 id="drinkNameModal">${result.name_drink}</h1>
          <div class="order-price">
              <div class="order-price__text">
                  <p id="drinkPriceModal">${result.price} đ</p>
              </div>
              <div class="order-number">
                  <span class="btn btn-minus" onclick="onDecreQuantityModal()">-</span><span id="quantityModal">1</span>
                  <span class="btn btn-add" onclick="onIncreQuantityModal()">+</span>
              </div>
          </div>
      </div>
          `);

        result.listSize.forEach((size, index) => {
          $("#getListSize").append(`
              <div>
                  <input type="radio" id="${size.name_size}" name="size" value="${size.percent_plus}" onchange="onChangeSize(${size.name_size},${size.percent_plus})"/>
                  <label for="${size.name_size}">
                      <p>${size.name_size}</p>
                      <p>+ ${size.percent_plus} %</p>
                  </label>
              </div>
              `);
        });

        result.listTopping.forEach((top, index) => {
          $("#getListTopping").append(`
              <div class="order-topping__item">
                  <div class="order-topping__name">
                      <p>${top.name_topping}</p>
                      <p>+ ${top.price_plus} đ</p>
                  </div>
                  <div class="order-number">
                      <span class="btn btn-minus" onclick="onDecreQuantityTopping(${
                        top.id_topping
                      }, ${top.price_plus})">-</span>
                      <span id="${top.id_topping + "topping"}">0</span>
                      <span class="btn btn-add" onclick="onIncreQuantityTopping(${
                        top.id_topping
                      }, ${top.price_plus})">+</span>
                  </div>
              </div>
              `);
        });
      }
    },
  });
});
