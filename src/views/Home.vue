<template>
  <div class="dashboard">
    <div class="summery-block mlg:grid mlg:grid-cols-12 lg:!pl-0">
      <div class="xl:col-span-12 mlg:col-span-12 flex flex-col justify-between">
        <div class="stats grid xl:grid-cols-4 mlg:grid-cols-2 sm:grid-cols-4 grid-cols-2 xl:mt-10">
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'blocks' })">
            <h4>Blocks</h4>
            <h2>
              {{ this.stateData.blocks | formatHexToInt }}
            </h2>
            <!-- <span class="positive">+13.6%</span> -->
          </div>
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'staking' })">
            <h4>Validators</h4>
            <h2>{{ this.stateData.validators | formatHexToInt }}</h2>
            <!-- <span class="negative">-10.6%</span> -->
          </div>
          <div class="stats__block">
            <h4>Accounts</h4>
            <h2>{{ this.stateData.accounts | formatHexToInt }}</h2>
            <!-- <span class="positive">+13.6%</span> -->
          </div>
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'transactions' })">
            <h4>Transactions</h4>
            <h2>{{ this.stateData.transactions | formatHexToInt }}</h2>
            <!-- <span class="positive">+13.6%</span> -->
          </div>
        </div>
        <!-- <div class="txt-ad ml-[35px] lg:block hidden">
          This section will be text advertisement
        </div> -->
      </div>


    </div>

    <div class="grid mlg:grid-cols-2 gap-7 2xl:gap-10 mt-6">
      <latest-blocks :blockData="blockData" />
      <latest-transactions :transactions="transactionsData" />
    </div>

    <div class="mt-6">
      <total-mtc-burned />
    </div>
    <div class="chart xl:col-span-6 mlg:col-span-12">
      <apex-chart type="area" ref="chart" height="270" :options="chartOptions" :series="series"></apex-chart>
    </div>
    <!-- <div class="grid-cols-2 gap-7 2xl:gap-10 mt-6 lg:grid hidden">
      <div class="my_ads_block">Ads</div>
      <div class="my_ads_block">Ads</div>
    </div> -->
  </div>
</template>

<script>
import LatestBlocks from "@/components/dashboard/LatestBlocks.vue";
import LatestTransactions from "@/components/dashboard/LatestTransactions.vue";
import TotalMtcBurned from "@/components/dashboard/TotalMTCBurned.vue";
// import AnimatedNumber from "animated-number-vue";

import gql from "graphql-tag";
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
} from "@/filters";
import { WEIToMTC } from "@/utils/transactions";

const GET_MTC_LATEST_BLOCK_BURN_LIST = gql`
  query GetMtcLatestBlockBurnList($count: Int = 5) {
    mtcLatestBlockBurnList(count: $count) {
      blockNumber
      timestamp
      mtcValue
    }
  }
`;

const GET_TRANSACTIONS_LIST = gql`
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
        }
      }
    }
  }
`;

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

const GET_TX_VOLUMES = gql`
  query TxVolumes($from: String, $to: String) {
    trxVolume(from: $from, to: $to) {
      day
      amount
      volume
    }
  }
`;

const STATE_QUERY = gql`
  query State {
    state {
      blocks
      transactions
      accounts
      validators
      sfcLockingEnabled
      sealedEpoch {
        id
        totalSupply
        baseRewardPerSecond
        __typename
      }
      __typename
    }
  }
`;
import { pollingMixin } from "@/mixins/polling";
export default {
  name: "dashboard-page",
  mixins: [pollingMixin],
  components: { LatestBlocks, LatestTransactions, TotalMtcBurned },
  mounted() {
    this._polling.start(
      "update-net-state",
      () => {
        this.updateChainState();
        this.updateData();
      },
      3300
    );
  },
  computed: {
    getTodayDate() {
      const newDate = new Date(); // Create a new Date object
      newDate.setMonth(newDate.getMonth() - 1); // Set the month to June (index 5)
      return newDate.toISOString().slice(0, 10)
    }
  },
  data() {
    return {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      chartOptions: {
        legend: {
          show: false,
        },
        chart: {
          height: "270px",
          type: "area",
          toolbar: {
            show: false
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        xaxis: {
          labels: {
            show: false, // Hide x-axis labels
          },
          type: "date",
          categories: [
          ],

        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd",
          },
          // y: {
          //   formatter: (value) => {
          //     // Customize tooltip content to show x-axis data on hover
          //     // const xData = this.chartData.xaxis.categories[value.x];
          //     // return `${xData}: ${value.y}`;
          //   },
          // },
        },
      },
      transactionsData: [],
      blockData: [],
      trxVolumesData: [],
      stateData: [],
    };
  },
  apollo: {
    mtcLatestBlockBurnList: {
      query: GET_MTC_LATEST_BLOCK_BURN_LIST,
      variables() {
        return {
          count: 5,
        };
      },
    },
    transactions: {
      query: GET_TRANSACTIONS_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.transactions && data.transactions.edges) {
          this.transactionsData = data.transactions.edges;
        }
      },
    },
    blocks: {
      query: GET_BLOCK_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.blocks && data.blocks.edges) {
          this.blockData = data.blocks.edges;
        }
      },
    },
    state: {
      query: STATE_QUERY,
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.state) {
          this.stateData = data.state;
        }
      },
    },
    trxVolume: {
      query: GET_TX_VOLUMES,
      variables() {
        return {
          from: this.getTodayDate,
          to: null,
        };
      },
      result({ data }) {
        if (data && data.trxVolume) {
          this.trxVolumesData = data.trxVolume;
          const xAxisData = [];
          const yAxisData = [];
          for (let index = 0; index < data.trxVolume.length; index++) {
            const element = data.trxVolume[index];
            xAxisData.push(element.day);
            yAxisData.push(element.volume);
          }
          this.chartOptions = {
            ...this.chartOptions,
            xaxis: {
              categories: xAxisData,
              type: 'datetime',
              labels: {
                formatter: function (value) {
                  // const index = xAxisData.indexOf(value); // Retrieve the index using dataLabels
                  const date = new Date(value);
                  return date.toLocaleDateString(); // Modify the date format as desired
                  // if (index % 5 === 0) { // Display a label for every 5th record
                  // } else {
                  //   return '';
                  // }
                }
              }
            },
          };
          this.series = [{ name: "trxVolume", data: yAxisData }];

        }
      },
    },
  },
  methods: {
    async fetchState() {
      const dataRes = await this.$apollo.query({
        query: gql`
          query State {
            state {
              blocks
              transactions
              accounts
              validators
              sfcLockingEnabled
              sealedEpoch {
                id
                totalSupply
                baseRewardPerSecond
              }
            }
          }
        `,
        fetchPolicy: "network-only",
      });
      if (dataRes && dataRes.data && dataRes.data.state) {
        this.stateData = dataRes.data.state;
      }
      return dataRes.data.state || {};
    },
    async updateChainState() {
      this.stateData = { ...(await this.fetchState()) };
    },
    async updateData() {

      try {
        const transactionRes = await this.$apollo.query({
          query: gql`
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
                  }
                }
              }
            }
          `,
          variables: {
            cursor: null,
            count: 10,
          },
          fetchPolicy: "network-only",
        });
        this.transactionsData = transactionRes.data.transactions.edges;
      } catch (error) {
        console.log(error);
      }

      try {
        const blockData = await this.$apollo.query({
          query: gql`
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
          `,
          variables: {
            cursor: null,
            count: 10,
          },
          fetchPolicy: "network-only",
        });
        this.blockData = blockData.data.blocks.edges;
      } catch (error) {
        console.log(error);
      }
    },
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC,
  },
};
</script>

<style lang="scss" scoped>
.my_ads_block {
  height: 116px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 206px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 32px;
  line-height: 41px;
  color: #d7d7d7;
}

@media screen and (max-width: 1500px) {
  .my_ads_block {
    font-size: 26px;
  }
}
.stats__block {
  text-align: center;
}
</style>
