<template>
  <div class="wallet">
    <div class="content-box pt-[18px] pb-[18px] xl:px-[41px] px-[31px]">
      <block-header>
        <template v-slot:title>
          <div class="flex items-center">
            <h2>Address</h2>
            <div class="copy-address lg:!flex !hidden">
              <div class="mr-6 overflow-wrap">
                {{ walletData.address }}
              </div>
              <div @click="copyToClipboard(walletData.address)">
                <img src="../assets/icons/copy.svg" alt="" />
                Copy
              </div>
            </div>
          </div>
        </template>
        <template v-slot:actions>
          <div class="breadcrumb">
            Dashboard
            <img src="../assets/icons/chevron-right.svg" alt="" /> Address
          </div>
        </template>
      </block-header>
      <div class="copy-address lg:!hidden flex justify-between mt-2 !mx-0">
        <div class="overflow-wrap gap-2">
          {{id}}
        </div>
        <div>
          <img src="../assets/icons/copy.svg" alt="" />
          Copy
        </div>
      </div>
    </div>

    <div class="grid mlg:grid-cols-11 :grid-cols-2 mt-10 gap-3">
      <div class="mlg:col-span-4 md:col-span-1 col-span-2">
        <div class="content-box pt-[30px] pb-[30px] px-7 2xl:px-[40px]">
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img
              src="../assets/icons/balance_icon.svg"
              alt=""
              class="block-icon"
            />
            Total Balance
          </h4>

          <div
            class="sm:flex items-center justify-center md:flex-nowrap flex-wrap mlg:justify-start gap-9"
          >
            <radial-progress-bar class="mx-auto" id="GradientColor" />
            <div>
              <h2
                class="text-[#000] font-bold text-3xl 2xl:text-4xl mb-2 text-nunito"
              >
                {{ walletData.totalValue | formatHexToInt }}
              </h2>
              <h5 class="text-[#B9B9B9] text-lg 2xl:text-xl text-roboto">
                MTC
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="mlg:col-span-4 md:col-span-1 col-span-2">
        <div class="content-box pt-[30px] pb-[30px] px-7 2xl:px-[40px]">
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img src="../assets/icons/avalible.svg" class="block-icon" />
            Available
          </h4>
          <div
            class="sm:flex items-center justify-center md:flex-nowrap flex-wrap mlg:justify-start gap-9"
          >
            <radial-progress-bar
              class="mx-auto"
              id="GradientColor2"
              :colors="{ start: '#30E330', end: '#85ee85' }"
            />
            <div>
              <h2
                class="text-[#000] font-bold text-3xl 2xl:text-4xl mb-2 text-nunito"
              >
                {{ walletData.totalValue | formatHexToInt }}
              </h2>
              <h5 class="text-[#B9B9B9] text-lg 2xl:text-xl text-roboto">
                MTC
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div class="mlg:col-span-3 col-span-2">
        <div
          class="content-box pt-[30px] pb-[12px] px-7 2xl:px-[40px] h-full flex flex-col justify-between"
        >
          <h4
            class="flex items-center text-[#1C1F37] font-bold text-lg 2xl:text-2xl gap-4 mb-9"
          >
            <img src="../assets/icons/stacking.svg" class="block-icon" />
            Staking
          </h4>

          <ul>
            <li
              class="flex justify-between items-center text-[#313131] text-sm 2xl:text-base mb-4"
              v-for="(i, idx) in stacking"
              :key="idx"
            >
              <div class="font-medium">
                {{ i.name }}
              </div>
              <div class="font-bold">{{ i.value }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="content-box pt-[36px] pb-[30px] px-[23px] mt-10">
      <div class="tabs mlg:!flex !hidden">
        <div
          class="tab"
          @click="currentTab = i.slug"
          v-for="(i, idx) in tabs"
          :key="idx"
          :class="{ active: currentTab === i.slug }"
        >
          {{ i.name }}
        </div>
      </div>

      <div class="drop-down mlg:!hidden">
        <div class="selected" @click="dropDown = !dropDown">
          {{ selected }}
          <img src="../assets/icons/chevronDown.svg" alt="" />
        </div>

        <ul class="options" :class="{ '!block': dropDown }">
          <li
            :class="{ selected: i.slug === currentTab }"
            @click="select(i)"
            v-for="(i, idx) in tabs"
            :key="idx"
          >
            {{ i.name }}
          </li>
        </ul>
      </div>

      <transaction-table v-if="currentTab === 'transaction'" :transactions="walletData.txList" :key="transactionKey"/>
      <erc-20-txn-table v-if="currentTab === 'erc20'" />
      <erc-21-txns-table
        v-if="currentTab === 'erc721' || currentTab === 'erc722'"
      />
      <erc-1155-txns-table v-if="currentTab === 'erc1155'" />
      <assets-table v-if="currentTab === 'assets'" />
      <delegations-table v-if="currentTab === 'delegations'" />
    </div>
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import RadialProgressBar from "@/components/common/RadialProgressBar.vue";
import TransactionTable from "@/components/wallet/TransactionTable.vue";
import Erc20TxnTable from "@/components/wallet/Erc20TxnTable.vue";
import Erc21TxnsTable from "@/components/wallet/Erc21TxnsTable.vue";
import Erc1155TxnsTable from "@/components/wallet/Erc1155TxnsTable.vue";
import AssetsTable from "@/components/wallet/AssetsTable.vue";
import DelegationsTable from "@/components/wallet/DelegationsTable.vue";
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
  components: {
    BlockHeader,
    RadialProgressBar,
    TransactionTable,
    Erc20TxnTable,
    Erc21TxnsTable,
    Erc1155TxnsTable,
    AssetsTable,
    DelegationsTable,
  },
  name: "wallet-page",
  data() {
    return {
      currentTab: "transaction",
      selected: "Transactions",
      dropDown: false,
      walletData: {},
      tabs: [
        {
          name: "Transactions",
          slug: "transaction",
        },
        {
          name: "ERC20 Txns",
          slug: "erc20",
        },
        {
          name: "ERC721 Txns",
          slug: "erc721",
        },
        {
          name: "ERC721 Txns",
          slug: "erc722",
        },
        {
          name: "ERC1155 Txns",
          slug: "erc1155",
        },
        {
          name: "Assets",
          slug: "assets",
        },
        {
          name: "Delegations",
          slug: "delegations",
        },
      ],
      stacking: [
        {
          name: "Delegated",
          value: "0 MTC",
        },
        {
          name: "Pending Rewards",
          value: "0 MTC",
        },
        {
          name: "Stashed Rewards",
          value: "-",
        },
        {
          name: "Claimed Rewards",
          value: "-",
        },
        {
          name: "Validators",
          value: "-",
        },
      ],
      transactionKey: 0
    };
  },

  created() {},
  computed: {
    id() {
      return this.$route.query.id;
    },
    cAssets() {
      const { walletData } = this;
      const assets = {};
      const validatorIds = [];

      if (walletData) {
        const { delegations } = walletData;

        assets.available = walletData.balance;
        // assets.stashed = cAccount.stashed || 0;

        assets.delegated = 0;
        assets.pending_rewards = 0;
        assets.claimed_rewards = 0;

        if (delegations && delegations.edges) {
          delegations.edges.forEach((_edge) => {
            const { delegation } = _edge;

            validatorIds.push(delegation.toStakerId);

            assets.delegated += delegation ? WEIToMTC(delegation.amount) : 0;
            assets.pending_rewards +=
              delegation && delegation.pendingRewards
                ? WEIToMTC(delegation.pendingRewards.amount)
                : 0;
            assets.claimed_rewards += delegation
              ? WEIToMTC(delegation.claimedReward)
              : 0;
          });

          this.setValidators(validatorIds);
        }
      }
      return assets;
    },
  },
  watch: {
    cAssets(newData) {
      this.stacking.map((ele)=> {
        const name = ele.name
        if(ele.name == 'Delegated') {
          ele.name = name
          ele.value = newData.delegated
        }
        if(ele.name == 'Pending Rewards') {
          ele.name =name
          ele.value = newData.pending_rewards
        }
        if(ele.name == 'Stashed Rewards') {
          ele.name = name
          ele.value = newData.stashed
        }
        if(ele.name == 'Claimed Rewards') {
          ele.name = name
          ele.value = this.WEIToMTC(newData.claimed_rewards)
        }
        if(ele.name == 'Validators') {
          ele.name = name
          ele.value = ''
        }
      })
      this.transactionKey++
    }
  },
  methods: {
    select(e) {
      this.currentTab = e.slug;
      this.selected = e.name;
      this.dropDown = false;
    },
    async setValidators(_validatorIds) {
      let data;

      if (this.validators === null) {
        data = await this.fetchValidators();

        this.validators = data.filter((_validator) => {
          if (_validatorIds.indexOf(_validator.id) > -1) {
            _validator.name = `${
              _validator.stakerInfo
                ? _validator.stakerInfo.name
                : this.$t("unknown")
            }, ${parseInt(_validator.id, 16)}`;
            return true;
          }

          return false;
        });
      }
    },
    copyToClipboard(value) {
      const textArea = document.createElement('textarea');
      textArea.value = value; // Replace with the actual text you want to copy
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // alert('Text copied to clipboard!');
    },

    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToMTC,
  },
  apollo: {
    account: {
      query: gql`
        query AccountByAddress(
          $address: Address!
          $cursor: Cursor
          $count: Int!
        ) {
          account(address: $address) {
            address
            contract {
              address
              deployedBy {
                hash
                contractAddress
              }
              name
              version
              compiler
              sourceCode
              abi
              validated
              supportContact
              timestamp
            }
            balance
            totalValue
            txCount
            txList(cursor: $cursor, count: $count) {
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
            staker {
              id
              createdTime
              isActive
            }
            delegations {
              totalCount
              edges {
                delegation {
                  toStakerId
                  createdTime
                  amount
                  claimedReward
                  pendingRewards {
                    amount
                  }
                }
                cursor
              }
            }
          }
        }
      `,
      variables() {
        return {
          address: this.id,
          count: 20,
          cursor: null,
        };
      },
      result({ data }) {
        this.walletData = data?.account || {};
      },
      // error(_error) {
      //   this.dAccountByAddressError = _error.message;
      // },
    },
  },
};
</script>

<style lang="scss" scoped></style>
