<template>
  <label
    class="themeSwitch"
    id="themeSwitch"
    :class="theme ? 'justify-end px-[14px]' : 'justify-start px-[10px]'"
  >
    <input
      type="checkbox"
      class="themeSwitch__input"
      for="themeSwitch"
      @change="theme = !theme"
    />
    <span class="themeSwitch__btn" :class="{ off: theme }"></span>
    <span class="themeSwitch__label">
      {{ theme ? "ON" : "OFF" }}
    </span>
  </label>
</template>
    
  <script>
export default {
  name: "theme-switch",
  data() {
    return {
      theme: true,
    };
  },

  computed: {},

  methods: {},
};
</script>

<style lang="scss">
</style>