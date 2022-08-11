import M from "materialize-css";

export default {
  beforeMount(el, { value, modifiers }) {
    if (modifiers.left) {
      M.Tooltip.init(el, { html: value, position: "left" });
    } else {
      M.Tooltip.init(el, { html: value, position: "top" });
    }
  },
  beforeUnmount(el) {
    const tooltip = M.Tooltip.getInstance(el);

    if (tooltip && tooltip.destroy) tooltip.destroy();
  },
};
