<template>
  <div
    class="block-header flex justify-between items-center flex-wrap gap-5"
    :class="{ 'border-b border-[rgba(0,0,0,0.05)] pb-7': borderBottom }"
  >
    <div>
      <slot name="title"></slot>
    </div>
    <div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "block-header",
  props: {
    borderBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>