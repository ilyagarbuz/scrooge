import M from "materialize-css";

export default {
  install: (app) => {
    app.config.globalProperties.$message = (text) => {
      M.toast({ html: text });
    };

    app.config.globalProperties.$error = (text) => {
      M.toast({ html: `[Ошибка]: ${text}` });
    };
  },
};
