<template>
  <div class="transaction-details">
    <div class="content-box pt-[40px] pb-[30px] xl:px-[48px] px-[32px]">
      <block-header>
        <template v-slot:title>
          <h2>Transaction Details</h2>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            <span class="cursor-pointer" @click="$router.push({name: 'home'})">Home</span>
            <img class="" src="../assets/icons/chevron-right.svg" alt="" /> <span class="cursor-pointer" @click="$router.push({name: 'transactions'})">Transaction</span>
            <img src="../assets/icons/chevron-right.svg" alt="" /> Transaction
            Details
          </div>
        </template>
      </block-header>

      <ul class="strip-list mt-20">
        <li>
          <div>Hash</div>
          <div class="imp" style="  overflow-wrap: break-word; white-space: pre-wrap;">{{transactionData?.hash }}</div>
        </li>
        <li>
          <div>Status</div>
          <div><button>{{(transactionData?.status | formatHexToInt) ? 'Success' : 'Failed'}}</button></div>
        </li>
        <li>
          <div>Form</div>
          <div class="green cursor-pointer" style="  overflow-wrap: break-word; white-space: pre-wrap;" @click="$router.push({ name: 'wallet', query: {id: transactionData?.from} })">{{transactionData.from}}</div>
        </li>
        <li>
          <div>To</div>
          <div class="green cursor-pointer" style="  overflow-wrap: break-word; white-space: pre-wrap;" @click="$router.push({ name: 'wallet', query: {id: transactionData?.to} })">{{transactionData.to}}</div>
        </li>
        <li>
          <div>Time</div>
          <div style="  overflow-wrap: break-word; white-space: pre-wrap;">{{timestampToDate(transactionData?.block?.timestamp)}}</div>
        </li>
        <li>
          <div>Account</div>
          <div>{{transactionData?.value | formatHexToInt}} MTC</div>
        </li>
        <li>
          <div>Block</div>
          <div class="green cursor-pointer" @click="$router.push({path: '/blocks/details/', query: {id: transactionData?.block?.number}})">{{transactionData?.block?.number | formatHexToInt}}</div>
        </li>
        <li>
          <div>Gas Used</div>
          <div>{{transactionData?.gasUsed  | formatHexToInt}}</div>
        </li>
        <li>
          <div>Gas Limit</div>
          <div>{{transactionData?.gas | formatHexToInt}}</div>
        </li>
        <li>
          <div>Gas Price</div>
          <div>{{transactionData?.gasPrice | formatHexToInt}} WEI</div>
        </li>
        <li>
          <div>Nonce</div>
          <div>{{transactionData?.nonce | formatHexToInt}}</div>
        </li>
        <li>
          <div>Transaction Fee</div>
          <div>{{WEIToMTC(formatHexToInt(transactionData?.gasPrice) * formatHexToInt(transactionData.gasUsed))}} MTC</div>
        </li>
        <li>
          <div>Input Data</div>
          <div style="overflow-wrap: break-word;white-space: pre-wrap;"> {{ transactionData?.inputData }}</div>
        </li>
      </ul>
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
  name: "transaction-details",
  data() {
    return {
      transactionData: {}
    };
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  apollo: {
    transaction: {
      query: gql`
        query TransactionByHash($hash: Bytes32!) {
          transaction(hash: $hash) {
            hash
            index
            nonce
            from
            to
            value
            gas
            gasUsed
            gasPrice
            inputData
            status
            block {
              hash
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
      `,
      variables() {
        return {
          hash: this.id,
        };
      },
      result({data}) {
        if(data && data.transaction) {
          this.transactionData = data.transaction
        }
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
