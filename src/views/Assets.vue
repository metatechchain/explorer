<template>
  <div class="assets">
    <div class="content-box xl:pt-[40px] pt-[30px] pb-[30px] px-[31px]">
      <block-header>
        <template v-slot:title>
          <h2 class="ml-3">Validators</h2>
        </template>
      </block-header>

      <div class="tabs sm:!flex-row !flex-col">
        <div
          @click="currentTab = 'metatech'"
          class="tab"
          :class="{ active: currentTab === 'metatech' }"
        >
          METATECH Coin Finance Assets
        </div>
        <div
          @click="currentTab = 'all'"
          class="tab"
          :class="{ active: currentTab === 'all' }"
        >
          All ERC20 Tokens (3)
        </div>
      </div>
    </div>

    <div class="content-box pt-[24px] pb-[20px] px-[31px] mt-8">
      <div v-if="currentTab === 'metatech'" class="metatech">
        <table class="metatech-table with-header">
          <tr>
            <td
              class="thead"
              :data-th="th.value"
              v-for="(th, idx) in theadData"
              :key="'th-' + idx"
            >
              {{ th.value }}
            </td>
          </tr>
          <tr v-for="(item, idx) in tableData" :key="idx">
            <td
              :data-th="theadData[idx2].value"
              v-for="(i, idx2) in item"
              :key="'td-' + idx2"
            >
              {{ i.value }}
            </td>
          </tr>
          <tr v-if="tableData.length < 1" class="mlg:hidden">
            <td
              :data-th="th.value"
              v-for="(th, idx) in theadData"
              :key="'noItem-' + idx"
              class="!text-[#1E1E1E]"
            >
              no items
            </td>
          </tr>
        </table>
        <div class="no-items" v-if="tableData.length < 1">No items</div>
      </div>
      <div v-if="currentTab === 'all'" class="all">
        <table class="metatech-table with-header">
          <tr>
            <td
              class="thead"
              :data-th="th.value"
              v-for="(th, idx) in theadData2"
              :key="'th-' + idx"
            >
              {{ th.value }}
            </td>
          </tr>
          <tr v-for="(item, idx) in tableData2" :key="idx">
            <td
              :data-th="theadData2[idx2].value"
              v-for="(i, idx2) in item"
              :key="'td-' + idx2"
            >
            <template v-if="i.key == 'address'">
              {{ i.value | formatHash}}
            </template>
            <template v-else-if="i.key == 'totalSupply'">
              {{ formatNumberByLocale($defi.fromTokenValue(i.value, 0).toFixed(0), 0) }}
            </template>
            <template v-else>
              {{ i.value }}
            </template>
            </td>
          </tr>
          <tr v-if="tableData2.length < 1" class="mlg:hidden">
            <td
              :data-th="th.value"
              v-for="(th, idx) in theadData2"
              :key="'noItem-' + idx"
              class="!text-[#1E1E1E]"
            >
              no items
            </td>
          </tr>
        </table>
        <div class="no-items" v-if="tableData2.length < 1">No items</div>
      </div>
    </div>
  </div>
</template>
    
    <script>
import BlockHeader from "@/components/common/BlockHeader.vue";
// import gql from "graphql-tag";
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
} from "@/filters";
import { WEIToMTC } from "@/utils/transactions";
export default {
  components: { BlockHeader },
  name: "assets-page",

  data() {
    return {
      currentTab: "metatech",
      bold: true,
      theadData: [
        { value: "Asset" },
        { value: "Name" },
        { value: "Hash" },
        { value: "Price" },
        { value: "Total Supply" },
        { value: "Market Cap" },
      ],
      theadData2: [
        { value: "Asset" },
        { value: "Name" },
        { value: "Hash" },
        { value: "Total Supply" },
      ],
      tableData: [],
      tableData2: [
        [
          { value: "nTT" },
          { value: "MTC Test Token" },
          { value: "0x53bbcf ... 43ae" },
          { value: "199,999,000" },
        ],
        [
          { value: "nTT" },
          { value: "MTC Test Token" },
          { value: "0x53bbcf ... 43ae" },
          { value: "1,000,000,000" },
        ],
        [
          { value: "nTT" },
          { value: "MTC Test Token" },
          { value: "0x53bbcf ... 43ae" },
          { value: "8,000,000" },
        ],
      ],
      tokens: [],
    };
  },


  created() {
        this.init();
  },
  methods: {
        async init() {
          const rawData = await this.$defi.fetchERC20Tokens()
          this.tokens = rawData
          const tempTableData = []
          if(rawData && rawData.length) {
            rawData.forEach(element => {
              tempTableData.push([
                {value: element.symbol, key: 'symbol'},
                {value: element.name, key: 'name'},
                { value: element.address, key : 'address' },
                {value: element.totalSupply, key: 'totalSupply'}
            ])
          });
          this.tableData2 = tempTableData
          }
          try {
            const { $defi } = this;
              const result = await Promise.all([
                  $defi.fetchERC20Tokens(),
                  $defi.init(),
              ]);
              // this.tokens = result[0].filter((_item) => _item.isActive && _item.symbol !== 'MTC');
              this.tokens = result[0];
              // this.$emit('records-count', this.tokens.length);
          } catch (e) {console.log(e)}
        },
        timestampToDate,
        formatHash,
        numToFixed,
        formatNumberByLocale,
        formatHexToInt,
        WEIToMTC,
    },
    
};
</script>