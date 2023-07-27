import { postData, getData, deleteData } from "../api";

export const addProduct = () => {
  const titleInp = document.getElementById("product-title");
  const nameInp = document.getElementById("product-name");
  const priceInp = document.getElementById("product-price");
  const previewInp = document.getElementById("product-image");
  const saveBtn = document.getElementById("product-add-btn");
  const container = document.getElementById("product-table");
  const select = document.getElementById("product-category");

  const productData = {
    title: "",
    name: "",
    price: 0,
    preview: "",
    category: 0,
  };

  const render = (data) => {
    container.innerHTML = "";

    data.forEach((item, index) => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.title}</td>
            <td>${item.name}</td>
            <td>${item.price} ₽</td>
            <td class="text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" data-product="${item.id}">
                    удалить
                </button>
            </td>
        </tr>
        `
      );


    });
  };

  const checkValues = () => {
    if (
      nameInp.value === "" ||
      previewInp.value === "" ||
      titleInp.value === "" ||
      Number(priceInp.value) === 0 ||
      select.value === "default"
    ) {
      saveBtn.disabled = true;
    } else {
      saveBtn.disabled = false;
    }
  };

  const updateTable = () => {
    getData("/products").then((data) => {
      render(data);
    });
  };

  select.addEventListener("change", (e) => {
    productData.category = select.value;

    const url = select.value !== 'default' ? `/products?category=${select.value}` : `/products`;

    getData(url).then((data) => {
        render(data);
      });

    checkValues();
  });

  nameInp.addEventListener("input", (e) => {
    productData.name = nameInp.value;
    checkValues();
  });

  titleInp.addEventListener("input", (e) => {
    productData.title = titleInp.value;
    checkValues();
  });

  priceInp.addEventListener("input", (e) => {
    productData.price = Number(priceInp.value);
    checkValues();
  });

  previewInp.addEventListener("input", (e) => {
    const file = previewInp.files[0];

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const reader = new FileReader();

      reader.onload = () => {
        productData.preview = reader.result;
      };

      reader.onerror = () => {
        productData.preview = "";
        previewInp.value = "";
      };

      reader.readAsDataURL(file);
    } else {
      previewInp.value = "";
    }
    checkValues();
  });

  saveBtn.addEventListener("click", () => {
    postData("/products", productData).then((data) => {
       nameInp.value = '' ;
       previewInp.value = '';
       titleInp.value = '';
       priceInp.value = '';
      updateTable();
    });
  });

  container.addEventListener("click", (e) => {
    if(e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.product;
        deleteData(`/products/${id}`).then(() => {
            updateTable();
        })
    }
  });

  updateTable();
  checkValues();
};
