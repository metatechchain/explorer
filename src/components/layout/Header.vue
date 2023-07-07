<template>
  <div id="main-header" class="lg:h-[245px] h-[442px]">
    <div
      class="my-container flex justify-between items-center gap-8 lg:!pt-14 !pt-10"
    >
      <div
        class="flex lg:flex-row flex-col items-center lg:gap-32 xl:gap-40 w-full"
      >
        <div class="flex items-center lg:mb-0 mb-7">
          <button
            @click="$store.commit('set_nav', true)"
            class="nav-toggle-btn mr-10"
          >
            <img src="../../assets/icons/hamburger.svg" />
          </button>
          <div class="logo">
            <img src="../../assets/logo2.png" alt="logo" />
          </div>
        </div>
        <div class="search lg:flex-grow-[2] w-full lg:w-auto max-w-[780px]">
          <h3 class="lg:hidden font-semibold text-white text-2xl mb-3">
            The Metatech coin Explorer
          </h3>
          <div class="search-input lg:ml-0 mx-auto">
            <img @click="searchData" class="cursor-pointer" src="../../assets/icons/search_icon.svg" alt="" />
            <input
              type="search"
              placeholder="Search by addresses, transactions, and blocks"
              v-model="searchText"
            />
          </div>

          <!-- <div
            class="lg:hidden font-light text-white text-opacity-50 text-lg mt-2"
          >
            This section will be text advertisement
          </div> -->
        </div>
      </div>
      <!-- <div class="theme-switch lg:block hidden">
        <theme-switch />
      </div> -->
    </div>
  </div>
</template>

<script>
// import ThemeSwitch from "../common/ThemeSwitch.vue";
import { getTypeByStr } from '@/utils/transactions';
export default {
  // components: { ThemeSwitch },
  name: "main-header",
  data() {
    return {
      searchText: ''
    };
  },
  methods: {
    searchData() {
      if(this.searchText) {
        const type = getTypeByStr(this.searchText);
        let routeName = '';
        // 
        switch (type) {
            case 'transaction_hash':
                routeName = 'transactionDetails';
                break;
            case 'address':
                routeName = 'wallet';
                break;
            case 'block':
                routeName = 'blocksDetails';
                break;
            // default:
                // this.$refs.alertWindow.show();
        }

        if (routeName) {
            this.$router.push({ name: 'transactionDetails', query: {id: this.searchText} }, null, () => {});
        }
        this.searchText = ''
      }
    },
  }

};
</script>

<style lang="scss">
#main-header {
  background-image: url("../../assets/img/Header-01.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: top center;
}

@media screen and (max-width: 1024px) {
  #main-header {
    background-image: url("../../assets/img/Header-01.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom left;
  }
}
.search-input input {
    background: rgb(255 255 255 / 56%) !important;
}
</style>