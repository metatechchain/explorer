<template>
  <footer id="main-footer">
    <p>©2023 Metatech Coin</p>
  </footer>
</template>
  
<script>
export default {
  name: "main-footer",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#main-footer {
  height: 96px;
  background: linear-gradient(
      0deg,
      rgba(49, 188, 60, 0.1),
      rgba(49, 188, 60, 0.1)
    ),
    #fcfcfc;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    font-size: 18px;
  }
}
</style>