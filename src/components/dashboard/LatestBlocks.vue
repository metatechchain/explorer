<template>
  <div class="latest_blocks content-box px-[35px] pt-[30px] pb-[15px]">
    <block-header>
      <template v-slot:title>
        <h3>Latest Blocks</h3>
      </template>
      <template v-slot:actions>
        <router-link to="/blocks" class="view-all">View All</router-link>
      </template>
    </block-header>

    <ul class="blocks-list mt-6 max-h-400 overflow-y-auto overflow-x-hidden">
      <li v-for="(block, idx) in blockData" class="grid grid-cols-[repeat(14,minmax(0,1fr))]" :key="idx">
        <div class="col-span-4 heading">
          <div>Blocks</div>
          <div>Age</div>
          <div>Txns</div>
        </div>
        <div class="col-span-4 body">
          <div style="color: #3BA4A6;" class="cursor-pointer"
            @click="$router.push({ name: 'blocksDetails', query: { id: block.block.number } })">{{ block.block.number |
              formatHexToInt }}</div>
          <div>
            <timeago :datetime="timestampToDate(block.block.timestamp)" :auto-update="1"
              :converter-options="{ includeSeconds: true }"></timeago>
          </div>
          <div>{{ block.block.transactionCount }}</div>
        </div>
        <div class="col-span-6 flex justify-end items-center">
          <label>500 METATECH</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BlockHeader from "../common/BlockHeader.vue";
import { timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToMTC } from '@/utils/transactions'
export default {
  components: { BlockHeader },
  name: "latest-blocks",
  props: {
    blockData: Array
  },
  data() {
    return {
      // blocks: [MTC
      //   {
      //     Blocks: 9922,
      //     Age: "7 secs ago",
      //     Txns: 0,
      //     metatech: "500 METATECH",
      //   },
      //   {
      //     Blocks: 566456,
      //     Age: "30 secs ago",
      //     Txns: 0,
      //     metatech: "500 METATECH",
      //   },
      //   {
      //     Blocks: 3412,
      //     Age: "About 2 hours ago",
      //     Txns: 0,
      //     metatech: "500 METATECH",
      //   },
      //   {
      //     Blocks: 234235,
      //     Age: "About 3 hours ago",
      //     Txns: 0,
      //     metatech: "500 METATECH",
      //   },
      // ],
    };
  },
  methods: {
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC
  }
};
</script>