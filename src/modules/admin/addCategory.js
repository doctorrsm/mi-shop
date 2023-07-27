import { postData, getData, deleteData } from "../api";

export const addCategory = () => {
  const nameInp = document.getElementById("category-name");
  const previewInp = document.getElementById("category-image");
  const saveBtn = document.getElementById("category-add-btn");
  const container = document.getElementById("category-container");
  const select = document.getElementById("product-category");

  const categoryData = {
    name: "",
    preview: "",
  };

  const render = (data) => {
    container.innerHTML = "";

    data.forEach((item, index) => {
      container.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.name}</td>
            <td class="text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" data-category="${item.id}">
                    удалить
                </button>
            </td>
        </tr>
        `
      );

      select.insertAdjacentHTML('beforeend',
      `
      <option value="${item.id}">${item.name}</option>
      `
      )
    });
  };

  const checkValues = () => {
    if (nameInp.value === "" || previewInp.value === "") {
      saveBtn.disabled = true;
    } else {
      saveBtn.disabled = false;
    }
  };

  const updateTable = () => {
    getData("/categories").then((data) => {
      render(data);
    });
  };

  nameInp.addEventListener("input", (e) => {
    categoryData.name = nameInp.value;
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
        categoryData.preview = reader.result;
      };

      reader.onerror = () => {
        categoryData.preview = "";
        previewInp.value = "";
      };

      reader.readAsDataURL(file);
    } else {
      previewInp.value = "";
    }
    checkValues();
  });

  saveBtn.addEventListener("click", () => {
    postData("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
       nameInp.value = '' ;
       previewInp.value = '';
      updateTable();
    });
  });

  container.addEventListener("click", (e) => {
    if(e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.category;
        deleteData(`/categories/${id}`).then(() => {
            updateTable();
        })
    }
  });

  updateTable();
  checkValues();
};
