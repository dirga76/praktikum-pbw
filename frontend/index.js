const { createApp, ref, onMounted } = Vue;
const app = createApp({
  setup() {
    const url = "http://localhost:7000/product";

    const product = ref({
      id: null,
      name: "",
      brand: "",
      price: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });
    const getProduct = async () => {
      try {
        product.value.isUpdate = false;
        const resProduct = await axios.get(url);
        if (resProduct.data.length === 0)
          throw new Error("Produk Tidak Ditemukan");
        product.value.list = resProduct.data;
        return resProduct.data;
      } catch (err) {
        product.value.isError = true;
        product.value.errorMessage = err.message;
        product.value.isUpdate = false;
      }
    };

    const deleteProduct = async (id) => {
      try {
        product.value.isUpdate = false;
        const resProduct = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resProduct.data.length === 0)
          throw new Error("Gagal menghapus produk");
        product.value.list = resProduct.data;
        product.value.name = "";
        product.value.brand = "";
        product.value.price = "";
        await getProduct();
        return resProduct.data;
      } catch (err) {
        product.value.list = resProduct.data;
        product.value.name = "";
        product.value.brand = "";
        product.value.price = "";
        product.value.isError = true;
        product.value.errorMessage = err.message;
      }
    };

    const getProductById = async (id) => {
      try {
        const resProduct = await axios.get(url + `/${id}`);
        if (resProduct.data.length === 0)
          throw new Error("Produk Tidak Ditemukan");
        product.value.isUpdate = true;
        product.value.id = id;
        product.value.name = resProduct.data.name;
        product.value.brand = resProduct.data.brand;
        product.value.price = resProduct.data.price;

        return resProduct.data;
      } catch (err) {
        product.value.name = "";
        product.value.brand = "";
        product.value.price = "";
        product.value.isUpdate = false;
        product.value.isError = true;
        product.value.errorMessage = err.message;
      }
    };

    const submitProduct = async () => {
      console.log("TRiger");
      try {
        product.value.isUpdate = false;
        const resProduct = await axios.post(url + "/create", {
          name: product.value.name,
          brand: product.value.brand,
          price: product.value.price,
        });
        product.value.isError = false;
        product.value.name = "";
        product.value.brand = "";
        product.value.price = "";
        product.value.isUpdate = false;
        if (!resProduct) throw new Error("Gagal menambahkan produk");
        await getProduct();
      } catch (err) {
        product.value.isError = true;
        product.value.errorMessage = err.message;
      }
    };

    const updateProduct = async () => {
      try {
        product.value.isUpdate = true;
        const resProduct = await axios.put(url + "/update", {
          id: product.value.id,
          name: product.value.name,
          brand: product.value.brand,
          price: product.value.price,
        });
        product.value.isError = false;
        product.value.name = "";
        product.value.brand = "";
        product.value.price = "";
        product.value.isUpdate = false;
        product.value.isError = true;
        if (!resProduct) throw new Error("Gagal mengubah produk");
        await getProduct();
      } catch (err) {
        product.value.isUpdate = false;
        product.value.isError = true;
        product.value.errorMessage = err.message;
      }
    };
    onMounted(async () => {
      await getProduct();
    });
    return {
      product,
      deleteProduct,
      getProductById,
      submitProduct,
      updateProduct,
    };
  },
});

app.mount("#app");
