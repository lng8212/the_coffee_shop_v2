const API_URL = "http://localhost:8080/CoffeeShop";
var total = 0;

var cartGlobal = [];

function orderCart(e) {
  e.preventDefault();
  console.log(e);
  console.log("abc");
}

function deleteAllCart() {
  const newCart = [];
  sessionStorage.setItem("cart", JSON.stringify(newCart));

  $("#getCartItems").empty();

  $("#orderCart").attr("disabled", true);
  $("#totalText").text(`${0} đ`);
  $("#totalAllText").text(`${0} đ`);
}

function deleteFromCart(id) {
  const newCart = cartGlobal.filter((c) => c.id !== id);
  sessionStorage.setItem("cart", JSON.stringify(newCart));

  $("#getCartItems").empty();

  newCart.forEach((product, index) => {
    var toppingChoose = "";
    product.topping.forEach((t) => {
      tChoose = product.listTopping.find((top) => top.id_topping === t);
      if (tChoose) {
        toppingChoose += tChoose.name_topping + ",";
      }
    });
    total += product.totalPrice;
    $("#getCartItems").append(`
      <div>
          <div class="checkout-order__product-item">
              <div>
                  <p>${product.name_drink} X ${product.quantity}</p>
                  <p>${product.size}, ${toppingChoose}</p>
              </div>
              <div>${product.totalPrice} đ</div>
          </div>
          <div class="checkout-order__product-action">
              <a onclick="deleteFromCart(${product.id})">Xoá</a>
          </div>
      </div>
      `);

    $("#orderCart").attr("disabled", false);
    $("#totalText").text(`${total} đ`);
    $("#totalAllText").text(`${total + 10000} đ`);
  });
}

$(document).ready(function () {
  let cartJSON = sessionStorage.getItem("cart");
  $("#getCartItems").empty();
  $("#orderCart").attr("disabled", true);
  if (cartJSON) {
    let cart = JSON.parse(cartJSON);
    cartGlobal = cart;

    cart.forEach((product, index) => {
      var toppingChoose = "";
      product.topping.forEach((t) => {
        tChoose = product.listTopping.find((top) => top.id_topping === t);
        if (tChoose) {
          toppingChoose += tChoose.name_topping + ",";
        }
      });
      total += product.totalPrice;
      $("#getCartItems").append(`
        <div>
            <div class="checkout-order__product-item">
                <div>
                    <p>${product.name_drink} X ${product.quantity}</p>
                    <p>${product.size}, ${toppingChoose}</p>
                </div>
                <div>${product.totalPrice} đ</div>
            </div>
            <div class="checkout-order__product-action">
                <a onclick="deleteFromCart(${product.id})">Xoá</a>
            </div>
        </div>
        `);
    });

    $("#orderCart").attr("disabled", false);
    $("#totalText").text(`${total} đ`);
    $("#totalAllText").text(`${total + 10000} đ`);
  }

  let form = $("#formOrder");

  form.submit(function (e) {
    e.preventDefault();
    var ten = $('[name="ten"]').val();
    var sdt = $('[name="sdt"]').val();
    var diachi = $('[name="diachi"]').val();
    var ac = $('[name="ac"]').val();
    console.log(ten, sdt, diachi, ac, cartGlobal);
  });
});
