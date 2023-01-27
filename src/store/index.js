import Vue from "vue";
import Vuex from "vuex";

import {
  ADD_FLOOR_TO_ELEVATOR_QUE,
  PASS_FLOOR_TO_ELEVATOR,
  CHANGE_ELEVATOR_CURRENT_FLOOR,
  CHANGE_ELEVATOR_BUSY_STATUS
} from "@/store/mutation-types";

import data from "@/config.json";
import {
  ELEVATOR_STATUS,
  CHILL_TIME
} from "@/constants";

Vue.use(Vuex);

const initializeElevatorsData = quantity => {
  const parsedQuantity = parseInt(quantity);

  return new Array(parsedQuantity).fill(null).map((_, index) => {
    return {
      id: index,
      targetFloor: 1,
      currentFloor: 1,
      status: ELEVATOR_STATUS.VACANT,
      floorsQue: []
    };
  });
};

const getLessBusyElevatorId = (elevatorsData, floorNumber) => {
  const vacantElevators = elevatorsData.filter(it => it.status === ELEVATOR_STATUS.VACANT);

  if (vacantElevators.length !== 0) {
    let id;
    let oldVal = data.FLOORS_QUANTITY;

    vacantElevators.forEach(it => {
      const newVal = Math.abs(it.targetFloor - floorNumber);

      if (newVal < oldVal) {
        oldVal = newVal;
        id = it.id;
      }
    });

    return id;
  }

  let id;
  const targetFloorDistances = elevatorsData.map(it => {
    return it.floorsQue.reduce((prev, curr) => {
      return prev + Math.abs(it.targetFloor - curr) + 3;
    }, 0);
  });

  id = targetFloorDistances.indexOf(Math.min(...targetFloorDistances));

  return id;
};

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
    return state.elevatorsData.findIndex(it => it.currentFloor === floor && it.status === ELEVATOR_STATUS.VACANT);
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
      let i = currentFloor;
      const timeout = Math.abs(targetFloor - currentFloor) * 1000;

      commit(CHANGE_ELEVATOR_CURRENT_FLOOR, { elevatorId: lessBusyElevatorId, floorNumber: i });
      i < targetFloor ? i++ : i--;

      const interval = setInterval(() => {
        commit(CHANGE_ELEVATOR_CURRENT_FLOOR, { elevatorId: lessBusyElevatorId, floorNumber: i });
        i < targetFloor ? i++ : i--;
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        commit(CHANGE_ELEVATOR_BUSY_STATUS, { elevatorId: lessBusyElevatorId, status: ELEVATOR_STATUS.CHILL });
      }, timeout);

      setTimeout(() => {
        commit(CHANGE_ELEVATOR_BUSY_STATUS, { elevatorId: lessBusyElevatorId, status: ELEVATOR_STATUS.VACANT });
      }, timeout + CHILL_TIME);
    }
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
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
