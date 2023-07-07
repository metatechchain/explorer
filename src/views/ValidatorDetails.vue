<template>
  <div class="validator-details">
    <div class="content-box pt-[40px] pb-[30px] px-[48px]">
      <block-header>
        <template v-slot:title>
          <h2>Validator Details</h2>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            <span class="cursor-pointer" @click="$router.push({name: 'home'})">Home</span> <img src="../assets/icons/chevron-right.svg" alt="" /> <span class="cursor-pointer" @click="$router.push({name: 'staking'})">Stacking</span>
            <img src="../assets/icons/chevron-right.svg" alt="" /> Validator
            Details
          </div>
        </template>
      </block-header>

      <ul class="strip-list mt-20">
        <li>
          <div>Name</div>
          <div class="imp flex items-center">
            <div class="validator-img">
              <div class="validator-img">
                <img v-if="cStakerLogoUrl" :src="cStakerLogoUrl" :alt="cStakerName" class="not-fluid" />
                <img v-else src="../assets/img/metatech-token-with-bevel.png" alt="metatech logo" class="not-fluid" />
              </div>

              {{ cStakerName }}
            </div>
          </div>
        </li>
        <li>
          <div>Validator</div>
          <div v-show="'id' in cStaker">
            {{ cStaker.id | formatHexToInt }}
          </div>
        </li>
        <li>
          <div>Delegate Address</div>
          <div class="cursor-pointer" @click="$router.push({ name: 'wallet', query: {id: id} })">{{ id }}</div>
        </li>
        <li>
          <div>Staking start epoch</div>
          <div>{{ cStaker?.createdEpoch | formatHexToInt }}</div>
        </li>
        <li>
          <div>Staking start time</div>
          <div>
            {{
              formatDate(timestampToDate(formatHexToInt(cStaker.createdTime)))
            }}
          </div>
        </li>
        <li>
          <div>Amount staked</div>
          <div>
            {{
              formatNumberByLocale(numToFixed(WEIToMTC(cStaker.stake), 0))
            }}
            MTC
          </div>
        </li>
        <li>
          <div>Amount delegated</div>
          <div>
            {{
              formatNumberByLocale(numToFixed(WEIToMTC(cStaker.delegatedMe), 0))
            }}
            MTC
          </div>
        </li>
        <li>
          <div>Staking total</div>
          <div>
            {{
              formatNumberByLocale(numToFixed(WEIToMTC(cStaker.totalStake), 0))
            }}
            MTC
          </div>
        </li>
        <li>
          <div>Active</div>
          <div>{{ cStaker.isActive ? "Yes" : "No" }}</div>
        </li>
        <li>
          <div>Online</div>
          <div>{{ cStaker.isOffline ? "No" : "Yes" }}</div>
        </li>
        <li>
          <div>Downtime</div>
          <div>
            {{
              clampDowntime(
                Math.round(formatHexToInt(cStaker.downtime) / 10000000) / 100
              )
            }}
            s
          </div>
        </li>
        <li>
          <div>Locked Until</div>
          <div>
            {{ formatDate(timestampToDate(cStaker.lockedUntil)) }} transactions
            in block
          </div>
        </li>
        <li>
          <div>Lock (Days)</div>
          <div>{{ cLockDays ? cLockDays : "-" }}</div>
        </li>
      </ul>
    </div>

    <div class="content-box pt-[30px] pb-[30px] px-[48px] mt-8">
      <block-header>
        <template v-slot:title>
          <h2>Delegations <span class="data-count">1</span></h2>
        </template>
      </block-header>

      <table class="block-details-table with-header">
        <tr>
          <td class="thead" :data-th="th.value" v-for="(th, idx) in theadData2" :key="'th-' + idx">
            {{ th.value }}
          </td>
        </tr>
        <tr v-for="(item, idx) in tableData2" :key="idx">
          <td :data-th="theadData2[idx2].value" v-for="(i, idx2) in item" :key="'td-' + idx2">
            <template v-if="i.key == 'address'">
              <div class="cursor-pointer" @click="$router.push({ name: 'wallet', query: {id: i.value} })">
                {{ i.value | formatHash}}
              </div>
            </template>
            <template v-else-if="i.key == 'amount'">
              {{formatNumberByLocale(numToFixed(WEIToMTC(i.value), 2), 2)}}
            </template>
            <template v-else-if="i.key == 'createdTime'">
              {{ (formatDate(timestampToDate(i.value)))  }}
            </template>
            <template v-else>
              {{  i.value }}
            </template>
          </td>
        </tr>
        <tr v-if="tableData2.length < 1" class="mlg:hidden">
          <td :data-th="th.value" v-for="(th, idx) in theadData2" :key="'noItem-' + idx" class="!text-[#1E1E1E]">
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
const dayS = 60 * 60 * 24;
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
  prepareTimestamp,
  formatDate,
  clampDowntime
} from "@/filters";
import { WEIToMTC } from "@/utils/transactions";
export default {
  components: { BlockHeader },
  name: "validator-details",
  data() {
    return {
      bold: true,
      theadData2: [
        { value: "Address" },
        { value: "Created On" },
        { value: "Amount (MTC)" },
      ],
      tableData2: [
        [
          // { value: "0x1836d1 ... 4ec43e" },
          // { value: "Jan 19, 2022, 06:35 PM GMT+6" },
          // { value: "10,000,000.00" },
        ],
      ],
      stakerData: {},
    };
  },
  apollo: {
    staker: {
      query: gql`
        query StakerByAddress($address: Address!) {
          staker(address: $address) {
            id
            stakerAddress
            totalStake
            stake
            delegatedMe
            createdEpoch
            createdTime
            downtime
            lockedUntil
            isActive
            isOffline
            stakerInfo {
              name
              website
              contact
              logoUrl
            }
          }
        }
      `,
      variables() {
        return {
          address: this.id,
        };
      },
      result({ data }) {
        this.stakerData = data.staker;
      },
    },
    delegationsOf: {
      query: gql`
                    query DelegationList($staker: BigInt!, $cursor: Cursor, $count: Int!) {
                        delegationsOf(staker: $staker, cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                cursor
                                delegation {
                                    address
                                    amount
                                    createdTime
                                }
                            }
                        }
                    }
                `,
      skip() {
        return !this.cStaker.id;
      },
      variables() {
        return {
          staker: this.cStaker.id,
          cursor: null,
          count: 10
        }
      },
      result({ data }) {
        const tempData = []
        data.delegationsOf.edges.forEach((ele) => {
          console.log(ele, 'testele')
          tempData.push([
            { value: ele.delegation.address, key: 'address' },
            { value: ele.delegation.amount, key: 'amount' },
            { value: ele.delegation.createdTime, key: 'createdTime' },
          ])
        })
        this.tableData2 = tempData
      }
    },
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    cStaker() {
      return this.staker || {};
    },

    cStakerName() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo && stakerData.stakerInfo.name
        ? stakerData.stakerInfo.name
        : 'Unknown';
    },

    cStakerWebsite() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo
        ? stakerData.stakerInfo.website || stakerData.stakerInfo.contact
        : "";
    },

    cStakerLogoUrl() {
      const { stakerData } = this;

      return stakerData && stakerData.stakerInfo && stakerData.stakerInfo.logoUrl
        ? stakerData.stakerInfo.logoUrl
        : "";
    },

    cDelegationItems() {
      const { cStaker } = this;
      let items = [];

      if (cStaker && cStaker.delegations) {
        items = cStaker.delegations;
      }

      return items;
    },

    cLoading() {
      return this.$apollo.queries.staker.loading;
    },

    cLockDays() {
      const { cStaker } = this;
      const ts =
        cStaker && cStaker.lockedUntil
          ? prepareTimestamp(cStaker.lockedUntil)
          : 0;

      return ts > 0 ? parseInt((ts - Date.now()) / (dayS * 1000), 10) : "-";
    },
  },
  methods: {
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC,
    prepareTimestamp,
    formatDate,
    clampDowntime
  },
};
</script>
