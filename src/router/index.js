import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Transactions from "../views/Transactions.vue";
import TransactionDetails from "../views/TransactionDetails.vue";
import Blocks from "../views/Blocks.vue";
import BlockDetails from "../views/BlockDetails.vue";
import Epochs from "../views/Epochs.vue";
import EpochsDetails from "../views/EpochsDetails.vue";
import Contracts from "../views/Contracts.vue";
import Staking from "../views/Staking.vue";
import ValidatorDetails from "../views/ValidatorDetails.vue";
import Assets from "../views/Assets.vue";
import Wallet from "../views/Wallet.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/transactions",
    name: "transactions",
    component: Transactions,
  },
  {
    path: "/transaction/details",
    name: "transactionDetails",
    component: TransactionDetails,
  },
  {
    path: "/blocks",
    name: "blocks",
    component: Blocks,
  },
  {
    path: "/blocks/details",
    name: "blocksDetails",
    component: BlockDetails,
  },
  {
    path: "/epochs",
    name: "epochs",
    component: Epochs,
  },
  {
    path: "/epochs/details",
    name: "epochsDetails",
    component: EpochsDetails,
  },
  {
    path: "/contracts",
    name: "contracts",
    component: Contracts,
  },
  {
    path: "/staking",
    name: "staking",
    component: Staking,
  },
  {
    path: "/validator/Details",
    name: "validatorDetails",
    component: ValidatorDetails,
  },
  {
    path: "/assets",
    name: "assets",
    component: Assets,
  },
  {
    path: "/wallet",
    name: "wallet",
    component: Wallet,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
