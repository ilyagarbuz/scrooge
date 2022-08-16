<template>
  <form class="form" @submit.prevent="onSubmit">
    <div class="input-field">
      <input ref="input" id="upload" type="file" />
      <label for="description">Выберите файл</label>
    </div>

    <button class="btn waves-effect waves-light" type="submit">
      Загрузить
      <i class="material-icons right">send</i>
    </button>
  </form>
</template>

<script>
import M from "materialize-css";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default {
  data() {
    return {
      image: null,
    };
  },
  methods: {
    onSubmit() {
      const image = this.$refs.input.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `${image.name}`);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
      });
    },
  },
  mounted() {
    M.updateTextFields();
  },
};
</script>
