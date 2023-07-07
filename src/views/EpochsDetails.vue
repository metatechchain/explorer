<template>
  <div class="epoch-details">
    <div
      class="content-box xl:pt-[45px] pt-[32px] pb-[30px] xl:px-[48px] px-[32px]"
    >
      <block-header>
        <template v-slot:title>
          <h2>Epochs Details</h2>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            <span class="cursor-pointer" @click="$router.push({name: 'home'})">Home</span> <img src="../assets/icons/chevron-right.svg" alt="" /> <span class="cursor-pointer" @click="$router.push({name: 'epochs'})">Epochs</span>
            <img src="../assets/icons/chevron-right.svg" alt="" /> Details
          </div>
        </template>
      </block-header>

      <ul class="strip-list mt-20">
        <li>
          <div>Epoch</div>
          <div class="imp">{{epochData?.id | formatHexToInt}}</div>
        </li>
        <li>
          <div>End Time</div>
          <div>{{timestampToDate(epochData?.endTime)}}</div>
        </li>
        <li>
          <div>Total Base Reward</div>
          <div>{{formatNumberByLocale(parseFloat((WEIToMTC(epochData?.totalBaseRewardWeight))).toFixed(2), 2,)}} MTC</div>
        </li>
        <li>
          <div>Total Fee</div>
          <div>{{WEIToMTC(epochData?.epochFee)}} MTC</div>
        </li>
        <li>
          <div>Total Tx Reward</div>
          <div>{{WEIToMTC(epochData?.totalTxRewardWeight)}} MTC</div>
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
  name: "epochs-details",
  data() {
    return {
      epochData: {}
    };
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  apollo: {
    epoch: {
      query: gql`
        query EpochById($id: Long) {
          epoch(id: $id) {
            id
            endTime
            epochFee
            totalTxRewardWeight
            totalBaseRewardWeight
          }
        }
      `,
      variables() {
        return {
          id: `0x${parseInt(this.id).toString(16)}`,
        };
      },
      result({data}) {
        this.epochData = data.epoch
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
  },
};
</script>
