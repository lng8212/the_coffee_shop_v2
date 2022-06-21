$(document).ready(function () {
  let cartJSON = localStorage.getItem("cart");
  let carts = [];
  if (cartJSON) {
    carts = JSON.parse(cartJSON);
    console.log(carts);
    $("#number-of-bag").text(carts.length);
  } else {
    $("#number-of-bag").text(0);
  }
});
