<template>
  <div id="app">
    <div>
      <Header />
      <div class="flex w-full lg:gap-9">
        <div>
          <navigation-menu />
        </div>
        <div class="main flex-grow-[2]">
          <router-view />
          <ads-component />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import AdsComponent from "./components/common/adsComponent.vue";
import Footer from "./components/layout/Footer.vue";
import Header from "./components/layout/Header.vue";
import NavigationMenu from "./components/layout/NavigationMenu.vue";
import gql from "graphql-tag";

export default {
  components: { Header, NavigationMenu, Footer, AdsComponent },
  name: "app",
  data() {
    return {};
  },
  apollo: {
    price: {
      query: gql`
        query Price($to: String!) {
          price(to: $to) {
            price
          }
        }
      `,

      result(_data) {
        if (!_data.data.price) {
          return;
        }

        let tokenPrice = parseFloat(_data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        this.$store.commit("setTokenPrice", tokenPrice);
      },

      variables() {
        return {
          to: "USD",
        };
      },
    },

    gasPrice: {
      query: gql`
        query GasPrice {
          gasPrice
        }
      `,

      result(_data) {
        const gasPrice = parseInt(_data.data.gasPrice);

        if (gasPrice) {
          this.$store.commit("setGasPrice", gasPrice);
        }
      },
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (this.$store.getters.nav) {
        this.$store.commit("set_nav", false);
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  justify-content: space-between;
}

.main {
  width: 100%;
  max-width: 1550px;
  margin-right: 40px;
  position: relative;
  top: -70px;
  z-index: 2;

  &::before {
    content: "";
    width: calc(100% - 30px);
    height: 265px;
    position: absolute;
    top: -18px;
    right: 10px;
    z-index: -1;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
  }
}
#navigation .nav__item.active a::before {
  background: linear-gradient(90deg, #3BA4A6 2.52%, rgba(49, 188, 60, 0) 87.6%) !important;
}
.block-header .view-all, .stats__block span.positive, .mtc-box, .block-header .data-count, #main-footer[data-v-3d302860], .tabs .tab.active {
    background: rgb(59 164 166 / 13%) !important;
}

@media (min-width: "1960px") {
  .main {
    margin: 0px auto;
  }
}

@media (max-width: "1024px") {
  .main {
    top: -132px;

    &::before {
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

@media (max-width: "1024px") {
  .main {
    margin: 0px 19px;
  }
}
</style>
