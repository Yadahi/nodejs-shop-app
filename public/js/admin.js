const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
