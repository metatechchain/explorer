<template>
  <div
    class="transaction content-box xl:pt-[45px] pt-[30px] pb-[20px] xl:px-[48px] px-[32px]"
  >
    <block-header>
      <template v-slot:title>
        <h2>Blocks <span class="data-count">{{totalBlocks | formatHexToInt}}</span></h2>
      </template>
      <template v-slot:actions>
        <div class="instruction">Scroll down to see more</div>
      </template>
    </block-header>

    <div class="mt-8">
      <table class="blocks-table with-header">
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
            @click="$router.push({ name: 'blocksDetails', query: {id:item[0].value } })"
          >
          <template v-if="i.key == 'number'">
            {{ i.value | formatHexToInt}}
          </template>
          <template v-else-if="i.key == 'timestamp'">
            <timeago :datetime="timestampToDate(i.value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
          </template>
          <template v-else-if="i.key == 'time'">
            {{(formatDate(timestampToDate(i.value)))}}
          </template>
          <template v-else-if="i.key == 'fee'">
            {{ WEIToMTC(i.value * (gasPrice || 1500000000)) }}
          </template>
          <template v-else>
            {{ i.value }}
          </template>
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
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
  formatDate
} from "@/filters";
import { WEIToMTC } from "@/utils/transactions";
const GET_BLOCK_LIST = gql`
  query BlockList($cursor: Cursor, $count: Int!) {
    blocks(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        block {
          hash
          number
          timestamp
          transactionCount
          gasUsed
        }
        cursor
      }
    }
  }
`;

export default {
  components: { BlockHeader },
  name: "blocks-page",
  data() {
    return {
      theadData: [
        { value: "Block" },
        { value: "Time" },
        { value: "Age" },
        { value: "Fee (MTC)" },
        { value: "Txns" },
      ],
      tableData: [
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0.000485503369491" },
          { value: "2" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0.000485503369491" },
          { value: "2" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },

          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0.000485503369491" },
          { value: "2" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },

          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },

          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },

          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },

          { value: "0" },
          { value: "0" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0.000485503369491" },
          { value: "2" },
        ],
        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },

          { value: "0" },
        ],

        [
          { value: "10165" },
          { value: "Apr 14 2023, 02:47 PM GMT +6" },
          { value: "About 7 secs ago" },
          { value: "0" },
          { value: "0" },
        ],
      ],
      bold: true,
      totalBlocks: 0
    };
  },
  computed: {
    gasPrice () {
      return this.$store.state.gasPrice
    }
  },
  apollo: {
    blockList: {
      query: GET_BLOCK_LIST,
      variables() {
        return {
          cursor: null,
          count: 20,
        };
      },
      result({data}) {
        if (data && data.blocks && data.blocks.edges) {
          this.totalBlocks =  data.blocks.totalCount
          const tempBlockData = []
          data.blocks.edges.forEach(element => {
            tempBlockData.push([
              { value: element.block.number, key : 'number' },
              { value: element.block.timestamp, key: 'time' },
              { value: element.block.timestamp, key: 'timestamp' },
              { value: element.block.gasUsed, key: 'fee'},
              { value: element.block.transactionCount, key: 'transactionCount' },
            ])
          });
          this.tableData = tempBlockData
        }
      }
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
  },
};
</script>
