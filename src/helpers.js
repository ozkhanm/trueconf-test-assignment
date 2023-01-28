import {
  CHANGE_ELEVATOR_CURRENT_FLOOR,
  CHANGE_ELEVATOR_BUSY_STATUS
} from "@/store/mutation-types";

import {
  ELEVATOR_STATUS,
  CHILL_TIME
} from "@/constants";
import data from "@/config.json";

export const initializeElevatorsData = quantity => {
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

export const getLessBusyElevatorId = (elevatorsData, floorNumber) => {
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

export const timeoutElevatorOperationCommits = (commit, { currentFloor, targetFloor, elevatorId }) => {
  let i = currentFloor;
  const timeout = Math.abs(targetFloor - currentFloor) * 1000;

  commit(CHANGE_ELEVATOR_CURRENT_FLOOR, { elevatorId, floorNumber: i });
  i < targetFloor ? i++ : i--;

  const interval = setInterval(() => {
    commit(CHANGE_ELEVATOR_CURRENT_FLOOR, { elevatorId, floorNumber: i });
    i < targetFloor ? i++ : i--;
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    commit(CHANGE_ELEVATOR_BUSY_STATUS, { elevatorId, status: ELEVATOR_STATUS.CHILL });
  }, timeout);

  setTimeout(() => {
    commit(CHANGE_ELEVATOR_BUSY_STATUS, { elevatorId, status: ELEVATOR_STATUS.VACANT });
  }, timeout + CHILL_TIME);
};
