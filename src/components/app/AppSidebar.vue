<template>
  <ul class="sidenav app-sidenav" :class="{ open: modelValue }">
    <router-link
      v-for="link in links"
      :key="link.url.name"
      v-slot="{ href, navigate, isExactActive }"
      :to="link.url"
      active-class="active"
      custom
    >
      <li :class="[isExactActive && 'active']">
        <a
          :href="href"
          @click="navigate"
          class="waves-effect waves-orange pointer"
        >
          {{ link.title }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  props: ["modelValue"],
  data() {
    return {
      links: [
        { title: "Счет", url: { name: "home" } },
        { title: "История", url: { name: "history" } },
        { title: "Планирование", url: { name: "planning" } },
        { title: "Новая запись", url: { name: "record" } },
        { title: "Категории", url: { name: "categories" } },
      ],
    };
  },
};
</script>
