<template>
  <div
    class="transaction content-box xl:pt-[45px] pt-[32px] pb-[20px] xl:px-[48px] px-[32px]"
  >
    <block-header>
      <template v-slot:title>
        <h2>Epochs <span class="data-count">{{totalEpoachs | formatHexToInt}}</span></h2>
      </template>
      <template v-slot:actions>
        <div class="instruction">Scroll down to see more</div>
      </template>
    </block-header>

    <div class="mt-8">
      <table class="epochs-table with-header">
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
            @click="$router.push({ name: 'epochsDetails', query: {id: item[0].value | formatHexToInt} })"
          >
          <template v-if="i.key == 'id'">
            {{ i.value | formatHexToInt}}
          </template>
          <template v-else-if="i.key == 'timestamp'">
            {{formatDate(timestampToDate(i.value))}}
          </template>
          <template v-else-if="i.key == 'fee'">
            {{formatNumberByLocale(parseFloat(WEIToMTC(i.value)).toFixed(2))}}
            <!-- {{ WEIToMTC(i.value * (gasPrice || 1500000000)) }} -->
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
const GET_EPOACH_LIST = gql`
                query EpochList($cursor: Cursor, $count: Int!) {
                    epochs(cursor: $cursor, count: $count) {
                        totalCount
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        edges {
                            epoch {
                                id
                                endTime
                                epochFee
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
      theadData:[
          { value: "Epoch" },
          { value: "End Time" },
          { value: "Total Fee (MTC)" },
        ],
      tableData: [
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0.0001" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0.00003" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0.00001" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0.001" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],

        [
          { value: "423" },
          { value: "Apr 14, 2023, 11:00 AM GMT+6" },
          { value: "0" },
        ],
      ],
      bold: true,
      totalEpoachs: 0,
    };
  },
  apollo: {
    epoachList: {
      query: GET_EPOACH_LIST,
      variables() {
        return {
          cursor: null,
          count: 20,
        };
      },
      result({data}) {
        if (data && data.epochs && data.epochs.edges) {
          this.totalEpoachs =  data.epochs.totalCount
          const tempEpoachData = []
          data.epochs.edges.forEach(element => {
            tempEpoachData.push([
              { value: element.epoch.id, key : 'id' },
              { value: element.epoch.endTime, key: 'timestamp' },
              { value: element.epoch.epochFee, key: 'fee'},
            ])
          });
          this.tableData = tempEpoachData
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