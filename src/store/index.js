import Vue from "vue";
import Vuex from "vuex";

import {
  ADD_FLOOR_TO_ELEVATOR_QUE,
  PASS_FLOOR_TO_ELEVATOR,
  CHANGE_ELEVATOR_CURRENT_FLOOR,
  CHANGE_ELEVATOR_BUSY_STATUS,
  GET_STATE_FROM_STORAGE
} from "@/store/mutation-types";

import data from "@/config.json";
import {
  ELEVATOR_STATUS
} from "@/constants";
import {
  initializeElevatorsData,
  getLessBusyElevatorId,
  timeoutElevatorOperationCommits
} from "@/helpers";

Vue.use(Vuex);

const state = {
  elevatorsData: initializeElevatorsData(data.ELEVATORS_QUANTITY)
};

const getters = {
  overallFloorsQue: state => {
    return state.elevatorsData.map(it => it.floorsQue).flat();
  },
  overallTargetFloors: state => {
    return state.elevatorsData.map(it => it.targetFloor);
  },
  overallCurrentFloors: state => {
    return state.elevatorsData.map(it => it.currentFloor);
  },
  vacantElevatorIdByCurrentFloor: state => floor => {
    return state.elevatorsData.findIndex(it => it.currentFloor === floor && it.status !== ELEVATOR_STATUS.BUSY);
  },
  elevatorIdExecutingFloor: state => floor => {
    return state.elevatorsData.findIndex(it => it.targetFloor === floor && it.status === ELEVATOR_STATUS.BUSY);
  }
};

const actions = {
  processFloor({ commit, state, getters }, floorNumber) {
    if (getters.elevatorIdExecutingFloor(floorNumber) !== -1) {
      return;
    }

    if (getters.vacantElevatorIdByCurrentFloor(floorNumber) !== -1) {
      return;
    }

    const lessBusyElevatorId = getLessBusyElevatorId(state.elevatorsData, floorNumber);

    commit(ADD_FLOOR_TO_ELEVATOR_QUE, { floorNumber, elevatorId: lessBusyElevatorId });

    if (state.elevatorsData[lessBusyElevatorId].status === ELEVATOR_STATUS.VACANT) {
      commit(PASS_FLOOR_TO_ELEVATOR, { floorNumber, elevatorId: lessBusyElevatorId });

      let currentFloor = state.elevatorsData[lessBusyElevatorId].currentFloor;
      let targetFloor = state.elevatorsData[lessBusyElevatorId].targetFloor;

      timeoutElevatorOperationCommits(commit, {
        currentFloor,
        targetFloor,
        elevatorId: lessBusyElevatorId
      });
    }
  },
  continueOperations({ commit }, data) {
    const elevatorId = data.id;
    let currentFloor = data.currentFloor;
    let targetFloor = data.targetFloor;
    
    timeoutElevatorOperationCommits(commit, {
      currentFloor,
      targetFloor,
      elevatorId
    });
  }
};

const mutations = {
  [ADD_FLOOR_TO_ELEVATOR_QUE](state, { floorNumber, elevatorId }) {
    if (state.elevatorsData[elevatorId].floorsQue.includes(floorNumber)) {
      return;
    }

    const elevatorsData = [...state.elevatorsData];

    elevatorsData[elevatorId].floorsQue.push(floorNumber);

    state.elevatorsData = elevatorsData;
  },
  [PASS_FLOOR_TO_ELEVATOR](state, { floorNumber, elevatorId }) {
    const elevatorsData = [...state.elevatorsData];
    const elevatorData = {...state.elevatorsData[elevatorId]};
    const floorsQue = [...elevatorData.floorsQue];

    floorsQue.splice(0, 1);

    elevatorData.floorsQue = floorsQue;
    elevatorData.targetFloor = floorNumber;
    elevatorData.status = ELEVATOR_STATUS.BUSY;
    elevatorsData[elevatorId] = elevatorData;

    state.elevatorsData = elevatorsData;
  },
  [CHANGE_ELEVATOR_CURRENT_FLOOR](state, { elevatorId, floorNumber }) {
    const elevatorsData = [...state.elevatorsData];
    const elevatorData = elevatorsData[elevatorId];

    elevatorData.currentFloor = floorNumber;
    elevatorsData[elevatorId] = elevatorData;

    state.elevatorsData = elevatorsData;
  },
  [CHANGE_ELEVATOR_BUSY_STATUS](state, { elevatorId, status }) {
    const elevatorsData = [...state.elevatorsData];
    const elevatorData = elevatorsData[elevatorId];

    elevatorData.status = status;
    elevatorsData[elevatorId] = elevatorData;

    state.elevatorsData = elevatorsData;
  },
  [GET_STATE_FROM_STORAGE](state) {
    const prevState = localStorage.getItem("vuex-state");

    if (prevState) {
      const preparedPrevState = JSON.parse(prevState);
      
      this.replaceState(Object.assign(state, preparedPrevState));
    }
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    store =>{
      store.subscribe((mutation, state) => {
        localStorage.setItem("vuex-state", JSON.stringify(state));
      });
    }
  ]
});
