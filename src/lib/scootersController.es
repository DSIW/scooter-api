import ScootersRepository from './scootersRepository'
import spirit from 'spirit'
const response = spirit.node.response

const scootersRepository = new ScootersRepository()

function ok(json) {
  return response({
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: json
  }).type('json')
}

export async function all(req) {
  const scooters = await scootersRepository.all()
  return ok({ scooters })
}

export async function count(req) {
  const count = await scootersRepository.count()
  return ok({ count })
}

export async function licensePlates(req) {
  const licensePlates = await scootersRepository.licensePlates()
  return ok({ licensePlates })
}

export async function countPositions(req) {
  const count = await scootersRepository.countPositions()
  return ok({ count })
}

export async function countPositionsByTime(req, days) {
  days = parseInt(days)
  const history = await scootersRepository.countPositionsByTime(days)
  return ok({ history })
}

export async function countPositionsByTimeUnit(req, unit) {
  const distribution = await scootersRepository.countPositionsByTimeUnit(unit)
  return ok({ distribution })
}

export async function currentPositions(req) {
  const lastRequestTime = await scootersRepository.lastRequestTime()
  const positions = await scootersRepository.positionsAt(lastRequestTime)
  const count = positions.length
  return ok({ lastRequestTime, count, positions })
}

export async function positionsByLicensePlate(req, license_plate) {
  const positions = await scootersRepository.positionsByLicensePlate(license_plate)
  return ok({ license_plate, positions })
}

export async function countPositionsByLicensePlate(req, license_plate) {
  const count = (await scootersRepository.positionsByLicensePlate(license_plate)).length
  return ok({ license_plate, count })
}

export async function batterySwapsByLicensePlate(req, license_plate) {
  const positions = await scootersRepository.batterySwapsByLicensePlate(license_plate)
  return ok({ license_plate, positions })
}

export async function batterySwaps(req) {
  const positions = await scootersRepository.batterySwaps()
  return ok({ positions })
}

export async function energyLevelDistribution(req) {
  const distribution = await scootersRepository.energyLevelDistribution()
  return ok({ distribution })
}

export async function energyLevelDistributionPerLicensePlate(req, license_plate) {
  const distribution = await scootersRepository.energyLevelDistributionPerLicensePlate(license_plate)
  return ok({ distribution })

export async function drivesByLicensePlate(req, license_plate) {
  const drives = await scootersRepository.drivesByLicensePlate(license_plate)
  return ok({ license_plate, drives })
}

export async function energyLevelDistributionPerHour(req) {
  const distributionPerHour = await scootersRepository.energyLevelDistributionPerHour()
  return ok({ distributionPerHour })
}

export async function energyLevelStats(req) {
  const distribution = await scootersRepository.energyLevelDistribution()
  const per_hour = await scootersRepository.energyLevelDistributionPerHour()

  return ok({ energy_level: { distribution, per_hour } })
}

export async function mostUsed(req) {
  const mostUsed = await scootersRepository.locationsByLicensePlate()
  return ok({ mostUsed })
}

export async function nextAvailableScootersByLocation(req, lat, lng, distance) {
  const lastRequestTime = await scootersRepository.lastRequestTime()

  const positions = await scootersRepository.nextAvailableScootersByLocation(lastRequestTime, lat, lng, distance)
  const count = positions.length

  return ok({ lastRequestTime, count, positions })
}
