<template>
  <table
    class="w-transaction-table mt-10"
    :class="{ 'with-header': `${bold}` }"
  >
    <tr
      v-for="(row, x) in tableData2"
      :key="x"
      :class="{ bold: bold && x === 0 }"
    >
      <td v-for="(col, y) in row" :key="y" :data-th="tableData2[0][y].value">
        <template v-if="tableData2[x][y].key == 'timeStamp'">
          <timeago :datetime="timestampToDate(tableData2[x][y].value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
        </template>
        <template v-else>
          <div v-if="tableData2[x][y].key == 'has'" @click="$router.push({ name: 'transactionDetails', query: {id: tableData2[x][y].rawData} })">
            {{ tableData2[x][y].value }}
          </div>
          <div v-else>
            {{ tableData2[x][y].value }}
          </div>
        </template>
      </td>
    </tr>
  </table>
</template>

<script>
import {  timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToMTC } from '@/utils/transactions'
export default {
  name: "transaction-table",  
  props: {
    transactions: {
      type: Object
    },
  },
  created() {
    if(this.transactions) {
      const tempData = [[
          { value: "TX Hash" },
          { value: "Time" },
          { value: "Address" },
          { value: "Gas Used" },
          { value: "Amount (MTC)" },
        ]]
      this.transactions.edges.forEach((ele)=> {
        tempData.push([
          { value: this.formatHash(ele.transaction.hash), key : 'has' , rawData: ele.transaction.hash},
          { value: ele.transaction.block.timestamp, key: 'timeStamp' },
          {value: '', key:'addres'},
          { value: this.formatHexToInt(ele.transaction.gasUsed), key: 'gasUsed' },
          { value: this.formatHexToInt(ele.transaction.value), key: 'value' },
        ])
        this.tableData2 = tempData
      })
    }
  },
  data() {
    return {
      bold: true,
      tableData2: [
        [
          { value: "TX Hash" },
          { value: "Time" },
          { value: "Address" },
          { value: "Gas Used" },
          { value: "Amount (MTC)" },
        ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
        // [
        //   { value: "0x183 ... 43e" },
        //   { value: "about 3 hours ago" },
        //   { value: "0x183 ... 43e" },
        //   { value: "156629" },
        //   { value: "0" },
        // ],
      ],
    };
  },
  updated() {
    // console.log('here', this.transactions)
    if(this.transactions) {
      const tempData = [[
          { value: "TX Hash" },
          { value: "Time" },
          { value: "Address" },
          { value: "Gas Used" },
          { value: "Amount (MTC)" },
        ]]
      this.transactions.edges.forEach((ele)=> {
        tempData.push([
          { value: ele.transaction.hash, key : 'has' },
          { value: ele.transaction.block.timestamp, key: 'timeStamp' },
          {value: '', key:'addres'},
          { value: ele.transaction.gasUsed, key: 'gasUsed' },
          { value: this.fo(ele.transaction.value), key: 'value' },
        ])
        this.tableData2 = tempData
      })
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