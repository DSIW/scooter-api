import route from 'spirit-router'
import spirit from 'spirit'
const response = spirit.node.response

import * as scootersController from './lib/scootersController'

const not_found = () => {
  return {
    status: 404,
    headers: {"Content-Type": "text/plain"},
    body: "Resource not found"
  }
}

export default route.define([
  route.get("/scooters", ['req'], scootersController.all),
  route.get("/scooters/count", ['req'], scootersController.count),
  route.get("/scooters/license_plates", ['req'], scootersController.licensePlates),

  route.get("/scooters/positions/current", ['req'], scootersController.currentPositions),
  route.get("/scooters/positions/current/near_by/:lat/:lng/:distance", ['req', 'lat', 'lng', 'distance'], scootersController.nextAvailableScootersByLocation),
  route.get("/scooters/positions/count", ['req'], scootersController.countPositions),
  route.get("/scooters/positions/count/history/days/:days", ['req', 'days'], scootersController.countPositionsByTime),
  route.get("/scooters/positions/count/per_time_unit/:unit", ['req', 'unit'], scootersController.countPositionsByTimeUnit),

  route.get("/scooters/battery_swaps", ['req'], scootersController.batterySwaps),

  route.get("/scooters/:license_plate/positions", ['req', 'license_plate'], scootersController.positionsByLicensePlate),
  route.get("/scooters/:license_plate/positions/count", ['req', 'license_plate'], scootersController.countPositionsByLicensePlate),
  route.get("/scooters/:license_plate/positions/battery_swaps", ['req', 'license_plate'], scootersController.batterySwapsByLicensePlate),
  route.get("/scooters/:license_plate/energy_level/distribution", ['req', 'license_plate'], scootersController.energyLevelDistributionPerLicensePlate),
  route.get("/scooters/:license_plate/drives", ['req', 'license_plate'], scootersController.drivesByLicensePlate),
  route.get("/scooters/:license_plate/usage", ['req', 'license_plate'], scootersController.usageByLicensePlate),

  route.get("/scooters/most_used", ['req'], scootersController.mostUsed),

  route.get("/scooters/energy_level/stats", ['req'], scootersController.energyLevelStats),
  route.get("/scooters/energy_level/distribution", ['req'], scootersController.energyLevelDistribution),
  route.get("/scooters/energy_level/per_hour", ['req'], scootersController.energyLevelDistributionPerHour),

  route.any(/.*/, not_found),
])
