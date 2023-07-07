<template>
  <div class="staking">
    <div class="summary-details content-box pt-[20px] pb-[30px] px-[48px]">
      <block-header>
        <template v-slot:title>
          <h2>Staking</h2>
        </template>
      </block-header>

      <div
        class="md:grid md:grid-cols-[repeat(14,minmax(0,1fr))] stacking-summery gap-7"
      >
        <div class="xl:col-span-10 md:col-span-8">
          <h3 class="flex items-center font-bold text-2xl text-[#1C1F37]">
            <img class="mr-4" src="../assets/icons/pie_icon.svg" />
            Staking Summary
          </h3>

          <div class="grid xl:grid-cols-2 grid-cols-1">
            <div class="xl:mb-0 mb-6">
              <apex-chart
                class="stacking-chart my-auto"
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apex-chart>
            </div>
            <div class="flex items-end">
              <div class="stacking-summary-details">
                <h4>Summary Details</h4>
                <div class="progress-bar">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <ul>
                  <li>
                    <div>
                      <i class="self-staked"></i>
                      <div>Total Self-Staked</div>
                    </div>
                    <div>
                      {{ dTotals?.fSelfStaked}} MTC
                      <div>0%</div>
                    </div>
                  </li>

                  <li>
                    <div>
                      <i class="delegated"></i>
                      <div>Total Delegated</div>
                    </div>
                    <div>
                      {{dTotals?.fTotalDelegated}} MTC
                      <div>-</div>
                    </div>
                  </li>

                  <li>
                    <div>
                      <i class="total-staked"></i>
                      <div>Total Staked</div>
                    </div>
                    <div>
                      {{dTotals?.fTotalStaked}} MTC
                      <div>0%</div>
                    </div>
                  </li>

                  <li>
                    <div>
                      <i class="daily-reward"></i>
                      <div>Daily Rewards</div>
                    </div>
                    <div>
                      {{formatNumberByLocale(numToFixed(WEIToMTC(epoch?.baseRewardPerSecond) * 86400), 0)}} MTC
                      <div>-</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-4 md:col-span-6 flex flex-col justify-between">
          <h3 class="font-bold text-2xl text-[#1C1F37]">Last Epoch</h3>

          <div>
            <ul class="strip-list-small">
              <li>
                <div>Epoch Number</div>
                <div>{{epoch?.id | formatHexToInt}}</div>
              </li>
              <li>
                <div>End Time</div>
                <div><timeago :datetime="timestampToDate(epoch?.endTime)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></div>
              </li>
              <li>
                <div>Duration</div>
                <div>{{formatHexToInt(epoch?.duration) | formatDuration}}</div>
              </li>
              <li>
                <div>Fee</div>
                <div>{{epoch?.epochFee | formatHexToInt}} MTC</div>
              </li>
              <li>
                <div>Total Supply</div>
                <div>{{WEIToMTC(epoch?.totalSupply)}} MTC</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="content-box pt-[30px] pb-[30px] xl:px-[48px] px-[32px] mt-8">
      <block-header :borderBottom="true">
        <template v-slot:title>
          <h2>Validators <span class="data-count">{{totalstakesCount}}</span></h2>
        </template>
      </block-header>

      <table class="validator-table with-header">
        <tr>
          <template v-for="(th, idx) in theadData2">
            <td class="thead" :key="'th-' + idx" v-if="idx < 5">
              {{ th.value }}
            </td>
          </template>

          <td class="thead" data-th="">
            Self-Staked <br />
            (MTC)
          </td>
          <td class="thead">
            Delegated <br />
            (MTC)
          </td>
          <td class="thead">
            Total Staked <br />
            (MTC)
          </td>
        </tr>
        <tr
          v-for="(item, idx) in tableData2"
          :key="idx"
        >
          <td
            :data-th="theadData2[idx2].value"
            v-for="(i, idx2) in item"
            :key="'td-' + idx2"
            @click="$router.push({ name: 'validatorDetails', query: {id: item[3].value} })"
          >
            <!-- <img
              v-if="idx2 === 0"
              :src="i.value"
              class="xl:max-w-full max-w-[40px]"
            /> -->
            <!-- <template v-else>
              {{ i.value }}
            </template> -->
            <template v-if="i.key == 'image'">
              <img
                :src="i.value"
                class="xl:max-w-full max-w-[40px]"
              />
            </template>
            <template v-else-if="i.key == 'stakerInfo'">
              {{ i.value ? i.value:  'Unknown' }}
              <!-- <timeago :datetime="timestampToDate(i.value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago> -->
            </template>
            <template v-else-if="i.key == 'id'">
              {{ i.value | formatHexToInt }}
              <!-- {{ formatNumberByLocale(numToFixed(WEIToMTC(i.value), 2), 2) }} -->
            </template>
            <template v-else-if="i.key == 'stakerAddress'">
              {{i.value | formatHash}}
            </template>
            <template v-else-if="i.key == 'downtime'">
              {{i.value | formatHexToInt}} s
            </template>
            <template v-else-if="i.key == 'delegatedMe'">
              {{i.value | formatHexToInt}}
            </template>
            <template v-else-if="i.key == 'totalStake' || i.key == 'stake'">
              {{ formatNumberByLocale(numToFixed(WEIToMTC(i.value), 2), 2) }}
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
import {
  timestampToDate,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
  formatDuration,
} from "@/filters";
import gql from "graphql-tag";
import { WEIToMTC } from "@/utils/transactions";
import web3utils from "web3-utils";
    // import {shuffle} from "@/utils/array";
    // import { cloneObject } from "@/utils";
export default {
  components: { BlockHeader },
  name: "staking-page",
  data() {
    return {
      bold: true,
      dItems: [],
      dOfflineItems: [],
      dFlaggedItems: [],
      dInactiveItems: [],
      dValidatorsInfoError: '',
      dTotals: {},
      dTotalSupply: 0,
      dRecordsCount: 0,
      totalstakesCount: 0,
      epochData: {},
      theadData2: [
        { value: "" },
        { value: "Name" },
        { value: "ID" },
        { value: "Address" },
        { value: "Downtime" },
        { value: "Self-Staked (MTC)" },
        { value: "Delegated (MTC)" },
        { value: "Total Staked (MTC)" },
      ],
      tableData2: [
      ],
      series: [10, 45, 35, 10],
      chartOptions: {
        chart: {
          type: "donut",
        },
        labels: ["Self-Staked", "Delegated", "Rewards", "Staked"],
        colors: ["#017EFA", "#31BC3C", "#30D887", "#6342FF"],
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: false,
        },

        // responsive: [
        //   {
        //     breakpoint: 1280,
        //     options: {
        //       chart: {
        //         width: 400,
        //       },
        //     },
        //   },
        //   {
        //     breakpoint: 768,
        //     options: {
        //       chart: {
        //         width: 400,
        //       },
        //     },
        //   },
        // ],
      },
    };
  },
  computed: {
    cSelfStaked() {
      if (this.dTotals.selfStaked && this.dTotalSupply) {
        return numToFixed(
          (this.dTotals.selfStaked / this.dTotalSupply) * 100,
          0
        );
      }

      return 0;
    },

    cDelegated() {
      if (this.dTotals.totalDelegated && this.dTotalSupply) {
        return numToFixed(
          (this.dTotals.totalDelegated / this.dTotalSupply) * 100,
          0
        );
      }

      return 0;
    },

    cStaked() {
      if (this.dTotals.totalStaked && this.dTotalSupply) {
        return numToFixed(
          (this.dTotals.totalStaked / this.dTotalSupply) * 100,
          0
        );
      }

      return 0;
    },

    cDailyRewards() {
      const { epoch } = this;

      if (epoch && epoch?.baseRewardPerSecond) {
        return WEIToMTC(epoch?.baseRewardPerSecond) * 86400;
      }

      return 0;
    },

    cCurrentRewardRate() {
      const { cDailyRewards } = this;
      const { dTotals } = this;
      let rate = 0;

      if (cDailyRewards && dTotals && dTotals.totalStaked) {
        return ((cDailyRewards * 365) / dTotals.totalStaked) * 100;
      }

      return rate;
    },
  },

  apollo: {
    currentEpoch: {
      query: gql`
        query Epoch {
          currentEpoch
        }
      `,
      result(_data) {
        this.$apollo.queries.epoch.refetch({
          id: web3utils.numberToHex(
            formatHexToInt(_data.data.currentEpoch) - 1
          ),
        });
        this.$apollo.queries.epoch.skip = false;
      },
    },  
    epoch: {
      query: gql`
        query LastEpoch($id: Long!) {
          epoch(id: $id) {
            id
            endTime
            duration
            epochFee
            totalSupply
            baseRewardPerSecond
          }
        }
      `,
      // skip() {
      //   return true;
      // },
      variables() {
        return {
          id: "",
        };
      },
      result({data}) {
        this.epochData = data.epoch
        this.dTotalSupply = WEIToMTC(data.epoch.totalSupply);
      },
    },
    stakers: {
      query: gql`
        query Stakers {
          stakers {
            id
            stakerAddress
            isOffline
            isCheater
            isActive
            createdTime
            stake
            totalStake
            delegatedMe
            downtime
            stakerInfo {
              name
              website
              contact
              logoUrl
            }
          }
        }
      `,
      result({data}) {
        
        if(data && data.stakers) {
          this.totalstakesCount =  data.stakers?.length
          const tempStackData = []
          const totals = {
              selfStaked: 0,
              totalDelegated: 0,
              totalStaked: 0
          };
          data.stakers.forEach(element => {
            totals.selfStaked += parseFloat(numToFixed(WEIToMTC(element.stake), 0));
            totals.totalDelegated += parseFloat(numToFixed(WEIToMTC(element.delegatedMe), 0));
            totals.totalStaked += parseFloat(numToFixed(WEIToMTC(element.totalStake), 0));
            tempStackData.push([
              {
                value: require("../assets/img/metatech-token-with-bevel.png"),
                key : 'image'
              },
              { value: element.stakerInfo, key : 'stakerInfo' },
              { value: element.id, key: 'id' },
              { value: element.stakerAddress, key: 'stakerAddress' },
              { value: element.downtime, key: 'downtime'},
              { value: element.stake, key: 'stake' },
              { value: element.delegatedMe, key: 'delegatedMe' },
              { value: element.totalStake, key: 'totalStake' },
            ])
          });
          this.onValidatorListTotals(totals)
          this.tableData2 = tempStackData
        }
      },
    },
  },

  methods: {
    /**
     * @param {int} _num
     */
    onRecordsCount(_num) {
      this.dRecordsCount = _num;
    },

    onValidatorListTotals(_totals) {
      this.dTotals = {
        ..._totals,
        fSelfStaked: formatNumberByLocale(numToFixed(_totals.selfStaked, 2)),
        fTotalDelegated: formatNumberByLocale(
          numToFixed(_totals.totalDelegated, 2)
          ),
          fTotalStaked: formatNumberByLocale(numToFixed(_totals.totalStaked, 2)),
        };
        setTimeout(() => {
          this.series = [parseInt(this.dTotals.selfStaked), parseInt(this.dTotals.totalDelegated), parseInt(this.WEIToMTC(this.epochData?.baseRewardPerSecond || 0) * 86400), parseFloat(this.dTotals.totalStaked)]
        }, 500);
    },

    onValidatorListOffline(_offline) {
      this.dOfflineItems = _offline;
    },

    onValidatorListFlagged(_flagged) {
      this.dFlaggedItems = _flagged;
    },

    onValidatorListInactive(_inactive) {
      this.dInactiveItems = _inactive;
    },

    WEIToMTC,
    timestampToDate,
    formatHexToInt,
    formatNumberByLocale,
    numToFixed,
    formatDuration
  },
};
</script>
