<template>
  <div
    class="transaction content-box xl:pt-[45px] pt-[30px] pb-[20px] xl:px-[48px] px-[32px]"
    ref="tableContainer" @scroll="handleScroll"
    style="height: 80vh; overflow-y: auto;"

    >
    <block-header>
      <template v-slot:title>
        <h2>Transactions <span class="data-count">{{ totalTransactions | formatHexToInt }}</span></h2>
      </template>
      <template v-slot:actions>
        <div class="instruction">Scroll down to see more</div>
      </template>
    </block-header>

    <div class="mt-8">
      <table class="transaction-table with-header" >
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
        <tr
          v-for="(item, idx) in tableData"
          :key="idx"
        >
          <td
            :data-th="theadData[idx2].value"
            v-for="(i, idx2) in item"
            :key="'td-' + idx2"
            @click="$router.push({ name: 'transactionDetails', query: {id: item[0].value} })"
          >
          <template v-if="i.key == 'has' || i.key == 'from' || i.key == 'to'">
            {{ i.value | formatHash}}
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
        <tr v-if="tableData?.length < 1" class="mlg:hidden">
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
      <div class="no-items" v-if="tableData?.length < 1">No items</div>
    </div>
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import gql from 'graphql-tag';


const GET_TRANSACTION_LIST = gql`
  query TransactionList($cursor: Cursor, $count: Int!) {
    transactions(cursor: $cursor, count: $count) {
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      totalCount
      edges {
        cursor
        transaction {
          hash
          from
          to
          value
          gasUsed
          block {
            number
            timestamp
          }
          tokenTransactions {
            trxIndex
            tokenAddress
            tokenName
            tokenSymbol
            tokenType
            tokenId
            tokenDecimals
            type
            sender
            recipient
            amount
          }
        }
      }
    }
  }
`;
import {  timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToMTC } from '@/utils/transactions'
export default {
  components: { BlockHeader },
  name: "transaction-page",
  computed: {
    currentTableData() {
      // Calculate the start and end indices based on the current page
      const itemsPerPage = 10; // Set the desired number of items per page
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Return the data for the current page
      return this.tableData.slice(startIndex, endIndex);
    },
  },
  data() {
    return {
      theadData: [
        { value: "TX Hash" },
        { value: "Time" },
        { value: "Form" },
        { value: "To" },
        { value: "Gas Used" },
        { value: "Amount (MTC)" },
      ],
      transactionsData: [],
      tableData: [],
      totalTransactions: 0,
      bold: true,
      currentPage: 1,
      totalPages: 0,
    };
  },
  apollo: {
    transactions: {
      query: GET_TRANSACTION_LIST,
      variables() {
        return {
          cursor: null,
          count: 40,
        };
      },
      result({ data }) {
        // const vueApp = this
        if (data && data.transactions && data.transactions.edges) {
          // this.transactionsData = data.transactions.edges;
          this.totalTransactions =  data.transactions.totalCount
          this.totalPages = this.formatHexToInt(data.transactions.totalCount) / 40
          const tempTransactionData = []
          data.transactions.edges.forEach(element => {
            tempTransactionData.push([
              { value: element.transaction.hash, key : 'has' },
              { value: element.transaction.block.timestamp, key: 'timeStamp' },
              { value: element.transaction.from, key: 'from' },
              { value: element.transaction.to, key: 'to'},
              { value: element.transaction.gasUsed, key: 'gasUsed' },
              { value: element.transaction.value, key: 'value' },
            ])
          });
          this.tableData = tempTransactionData
        }
      },
    },
  },
  methods : {
    formatHex(hexString){
      const firstDigits = hexString.slice(0, 8); // Extract the first 5 digits
      const lastDigits = hexString.slice(-6); // Extract the last 4 digits
      const middleDots = " ... "; // Dots to represent omitted middle digits
      // Construct the formatted string
      const formattedHex =  firstDigits + middleDots + lastDigits;

      return formattedHex;
    },
    fetchData() {
      // Implement your data fetching logic here
      // Assign the fetched data to the tableData property
      // Calculate the totalPages based on the available data and itemsPerPage
    },
    handleScroll() {
      const container = this.$refs.tableContainer;
      const scrollPosition = container.scrollTop + container.clientHeight;
      const totalHeight = container.scrollHeight;

      // Check if the user has scrolled to the bottom of the table
      if (scrollPosition >= totalHeight && this.currentPage < this.totalPages) {
        console.log('herteonthis')
        // this.tableData = [...this.tableData, ...this.tableData]
        // this.currentPage++;
        // this.fetchData();
      }
    },
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC

  },
};
</script>