<template>
  <div class="block-details">
    <div
      class="content-box xl:pt-[40px] pt-[30px] pb-[30px] xl:px-[48px] px-[32px]"
    >
      <block-header>
        <template v-slot:title>
          <h2>Block Details</h2>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            <span class="cursor-pointer" @click="$router.push({name: 'home'})">Home</span> <img src="../assets/icons/chevron-right.svg" alt="" /> <span class="cursor-pointer" @click="$router.push({name: 'block'})">Block</span>
            <img src="../assets/icons/chevron-right.svg" alt="" /> Details
          </div>
        </template>
      </block-header>

      <ul class="strip-list mt-20">
        <li>
          <div>Block</div>
          <div class="imp">{{formatHexToInt(blockData?.number)}}</div>
        </li>
        <li>
          <div>Timestamp</div>
          <div>{{ timestampToDate(blockData?.timestamp)}}</div>
        </li>
        <li>
          <div>Transactions</div>
          <div>{{blockData?.transactionCount}} transactions in block</div>
        </li>
        <li>
          <div>Block Hash</div>
          <div>
            {{blockData?.hash}}
          </div>
        </li>
        <li>
          <div>Parent Hash</div>
          <div>
            {{blockData?.parent?.hash}}
          </div>
        </li>
      </ul>
    </div>

    <div class="content-box pt-[30px] pb-[30px] xl:px-[48px] px-[32px] mt-8">
      <block-header>
        <template v-slot:title>
          <h2>Transactions <span class="data-count">{{totalTransactions}}</span></h2>
        </template>
      </block-header>

      <table class="block-details-table with-header">
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
            <template v-if="i.key == 'has' || i.key == 'from' || i.key == 'to'" >
              <div class="cursor-pointer" v-if="i.key == 'has'" @click="$router.push({path: '/transaction/details', query: {id: i.value}})">
                {{ i.value | formatHash}}
              </div>
            </template>
            <template v-else-if="i.key == 'timeStamp'">
              <timeago :datetime="timestampToDate(i.value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
            </template>
            <template v-else-if="i.key == 'value'">
              {{ formatNumberByLocale(numToFixed(WEIToMTC(i.value), 2), 2) }}
            </template>
            <template v-else-if="i.key == 'gasUsed'">
              {{i.value | formatHexToInt}}
            </template>
            <template v-else>
              {{ i.valkue }}
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
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import gql from "graphql-tag";
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
  name: "block-details",
  data() {
    return {
      bold: true,
      blockData: {},
      totalTransactions: 0,
      theadData2: [
        { value: "TX Hash" },
        { value: "Time" },
        { value: "Form" },
        { value: "To" },
        { value: "Gas Used" },
        { value: "Amount (MTC)" },
      ],
      tableData2: [
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "About 7 secs ago" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "9922" },
          { value: "0" },
        ],
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "About 7 secs ago" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "9922" },
          { value: "0" },
        ],
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "About 7 secs ago" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "9922" },
          { value: "0" },
        ],
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "About 7 secs ago" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "9922" },
          { value: "0" },
        ],
        [
          { value: "0x1836d1 ... 4ec43e" },
          { value: "About 7 secs ago" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "0x1836d1 ... 4ec43e" },
          { value: "9922" },
          { value: "0" },
        ],
      ],
    };
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  apollo: {
    block: {
      query: gql`
        query BlockByNumber($number: Long) {
          block(number: $number) {
            number
            transactionCount
            hash
            parent {
              hash
            }
            timestamp
            txList {
              hash
              from
              to
              value
              gasUsed
              block {
                number
                timestamp
              }
            }
          }
        }
      `,
      variables() {
        return {
          number: `0x${parseInt(this.id).toString(16)}`,
        };
      },
      result({data}) {
        if(data && data.block) {
          this.blockData = data.block
          this.transactionsData = data.block.txList
          this.totalTransactions =  data.block.transactionCount
          const tempTransactionData = []
          data.block.txList.forEach(element => {
            tempTransactionData.push([
              { value: element.hash, key : 'has' },
              { value: element.block.timestamp, key: 'timeStamp' },
              { value: element.from, key: 'from' },
              { value: element.to, key: 'to'},
              { value: element.gasUsed, key: 'gasUsed' },
              { value: element.value, key: 'value' },
            ])
          });
          this.tableData2 = tempTransactionData
        }
      },
      error(_error) {
        this.dBlockByNumberError = _error.message;
      },
    },
  },
  methods: {
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC,
  },
};
</script>
