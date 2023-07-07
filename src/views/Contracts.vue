<template>
  <div
    class="transaction content-box xl:pt-[45px] pt-[32px] pb-[20px] xl:px-[48px] px-[32px]"
  >
    <block-header>
      <template v-slot:title>
        <h2>Contracts <span class="data-count">{{totalcontracts | formatHexToInt}}</span></h2>
      </template>
      <template v-slot:actions>
        <div class="instruction">Scroll down to see more</div>
      </template>
    </block-header>

    <div class="mt-8">
      <table class="contacts-table with-header">
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
          class="cursor-pointer"
          @click="$router.push({ name: 'wallet', query: {id: item[0].value} })"
            :data-th="theadData[idx2].value"
            v-for="(i, idx2) in item"
            :key="'td-' + idx2"
          >
            <div>
              <div class="title" v-if="i.title">{{ i.title }}</div>
              <template v-if="i.key == 'timestamp' || i.key == 'validated'">
                {{formatDate(timestampToDate(i.value))}}
              </template>
              <template v-else>
                {{ i.value }}
              </template>
            </div>
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
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import gql from "graphql-tag";
import {  timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt, formatDate } from "@/filters";
import { WEIToMTC } from '@/utils/transactions'
export default {
  components: { BlockHeader },
  name: "blocks-page",
  data() {
    return {
      theadData: [
        { value: "Name/Address" },
        { value: "Validated" },
        { value: "Timestamp" },
      ],
      totalcontracts: 0,
      tableData: [
      ],
      bold: true,
    };
  },
  apollo: {
    contracts: {
      query: gql`
        query ContractList($cursor: Cursor, $count: Int!) {
          contracts(cursor: $cursor, count: $count) {
            totalCount
            pageInfo {
              first
              last
              hasNext
              hasPrevious
            }
            edges {
              contract {
                address
                deployedBy {
                  hash
                }
                transactionHash
                name
                version
                compiler
                validated
                timestamp
              }
              cursor
            }
          }
        }
      `,
      variables() {
        return {
          cursor: null,
          count: 20,
        };
      },
      result({data}) {
          if(data && data.contracts) {
            this.totalcontracts =  data.contracts.totalCount
            const tempContractsData = []
            data.contracts.edges.forEach(element => {
              tempContractsData.push([
                { value: element.contract.address, key : 'address' },
                { value: element.contract.validated, key: 'validated' },
                { value: element.contract.timestamp, key: 'timestamp' },
              ])
            });
            this.tableData = tempContractsData
          }
      },
      error(_error) {
        this.dContractListError = _error.message;
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
    formatDate
  }
};
</script>
