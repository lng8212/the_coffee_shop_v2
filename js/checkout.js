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

  form.submit(async function (e) {
    e.preventDefault();
    var ten = $('[name="ten"]').val();
    var sdt = $('[name="sdt"]').val();
    var diachi = $('[name="diachi"]').val();
    var ac = $('[name="ac"]').val();
    const customer = {
      name_customer: ten,
      phone_number: sdt,
      address: diachi,
    };
    const list_bill_detail = cartGlobal.map((c) => {
      console.log(c);
      const size_id = c.listSize.find((li) => li.name_size === c.size).id_size;
      return {
        id_product: c.id,
        id_size: size_id,
        amount: c.quantity,
        note: "",
        list_topping: c.topping.map((item) => {
          return {
            id_topping: item,
          };
        }),
      };
    });
    console.log(ten, sdt, diachi, ac, cartGlobal, customer, list_bill_detail);

    let note = prompt("Ghi chú cho đơn hàng này:", "");
    if (note == null || note == "") {
      note = "";
    }

    const date = new Date();

    const data = {
      customer,
      list_bill_detail,
      note_of_bill: note,
      order_day:
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2),
    };

    const rawResponse = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(data),
    });
    if (rawResponse) {
      sessionStorage.clear();
      alert("Bạn đã đặt hàng thành công!");
      window.location.href = "/";
    }
  });
});
