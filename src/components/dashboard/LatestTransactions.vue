<template>
  <div class="latest_transactions	 content-box px-[35px] pt-[30px] pb-[15px]">
    <block-header>
      <template v-slot:title>
        <h3>Latest Transactions</h3>
      </template>
      <template v-slot:actions>
        <router-link to="/transactions" class="view-all">View All</router-link>
      </template>
    </block-header>

    <ul class="latest-transaction-list mt-6 max-h-400 overflow-y-auto">
      <li
        v-for="(item, idx) in transactions"
        class="grid grid-cols-[repeat(14,minmax(0,1fr))]"
        :key="idx"
      >
        <!-- {{ item }} -->
        <div class="col-span-5 heading">
          <div>TX Hasg</div>
          <div>Time</div>
          <div>From</div>
          <div>To</div>
          <div>Amount (MTC)</div>
        </div>
        <div class="col-span-9 body">
          <div class="cursor-pointer" @click="$router.push({name: 'transactionDetails', query: {id: item.transaction.hash}})">{{ item.transaction.hash | formatHash}}</div>
          <div>
            <timeago :datetime="timestampToDate(item.transaction.block.timestamp)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
          </div>
          <div class="cursor-pointer" @click="$router.push({ name: 'wallet', query: {id: item?.transaction?.from} })">{{ item.transaction.from | formatHash }}</div>
          <div class="cursor-pointer" @click="$router.push({ name: 'wallet', query: {id: item?.transaction.to} })">{{ item.transaction.to | formatHash }}</div>
          <div>{{ formatNumberByLocale(numToFixed(WEIToMTC(item.transaction.value), 2), 2) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BlockHeader from "../common/BlockHeader.vue";
import {  timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToMTC } from '@/utils/transactions'
export default {
  components: { BlockHeader },
  name: "latest-transactions",
  props: {
    transactions:  Array
  },
  data() {
    return {
      // transactions: [
      //   {
      //     tx_hasg: "0x1836d1 ... 4ec43e",
      //     time: "7 secs ago",
      //     from: "0x1836d1 ... 4ec43e",
      //     to: "0x1836d1 ... 4ec43e",
      //     amount: 0.0,
      //   },
      //   {
      //     tx_hasg: "0x1836d1 ... 4ec43e",
      //     time: "7 secs ago",
      //     from: "0x1836d1 ... 4ec43e",
      //     to: "0x1836d1 ... 4ec43e",
      //     amount: 0.0,
      //   },
      // ],
    };
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
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC
  },
};
</script>