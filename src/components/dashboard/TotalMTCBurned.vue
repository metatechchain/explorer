<template>
  <div class="total-mtc-burned content-box px-[35px] py-[30px]" style="max-height: 400px;">
    <div class="md:grid md:grid-cols-10">
      <div class="xl:col-span-4 md:col-span-5">
        <block-header>
          <template v-slot:title>
            <h3>Total MTC Burned</h3>
          </template>
        </block-header>

        <div class="mtc-box">
          <div>
            <span class="num">{{ formatNumberByLocale(burntTotalCount, 0) }}</span>
            <span>MTC</span>
          </div>
        </div>
      </div>
      <div class="xl:col-span-6 md:col-span-5 ml-8">
        <ul class="mtc-list">
          <li v-for="(item, idx) in burntListData" :key="idx">
            <div class="mtc-block">
              <img src="../../assets/img/flame-1.png" alt="" />
              <span>
                {{ item.mtcValue }}
              </span>
            </div>
            <div>
              <div class="name">{{ item.blockNumber | formatHexToInt }}</div>
              <div class="time"><timeago :datetime="timestampToDate(item.timestamp)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BlockHeader from "../common/BlockHeader.vue";
import gql from "graphql-tag";
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
} from "@/filters";
import { WEIToMTC } from "@/utils/transactions";
const GET_BURNT_TOTAL = gql`
  query GetMtcBurnedTotalAmount {
    mtcBurnedTotalAmount
  }
`;

const GET_BURNT_LIST = gql`
                    query GetMtcLatestBlockBurnList($count: Int = 25) {
                      mtcLatestBlockBurnList(count: $count) {
                            blockNumber
                            timestamp
                            mtcValue
                        }
                    }
                `;

export default {
  components: { BlockHeader },
  name: "total-mtc-burned",
  data() {
    return {
      // mtc: [
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      //   {
      //     name: "Block 9903",
      //     time: "About 2 hours ago",
      //     block: 0,
      //   },
      // ],

      burntTotalCount: 0,
      burntListData: []
    };
  },
  apollo: {
    mtcBurnedTotalAmount: {
      query: GET_BURNT_TOTAL,
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.mtcBurnedTotalAmount) {
          this.burntTotalCount = data.mtcBurnedTotalAmount;
        }
      },
    },
    mtcLatestBlockBurnList: {
      query: GET_BURNT_LIST,
      variables: {
          count: 4,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.mtcLatestBlockBurnList) {
          this.burntListData = data.mtcLatestBlockBurnList;
        }
      },
    }
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
