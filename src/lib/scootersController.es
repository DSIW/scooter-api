import ScootersRepository from './scootersRepository'

const scootersRepository = new ScootersRepository()

export async function all(req) {
  const scooters = await scootersRepository.all()
  return { scooters }
}

export async function findById(req, _id) {
  const scooter = await scootersRepository.findById(_id)
  return { _id, scooter }
}

export async function count(req) {
  const count = await scootersRepository.count()
  return { count }
}

export async function licensePlates(req) {
  const licensePlates = await scootersRepository.licensePlates()
  return { licensePlates }
}

export async function countPositions(req) {
  const count = await scootersRepository.countPositions()
  return { count }
}

export async function currentPositions(req) {
  const lastRequestTime = await scootersRepository.lastRequestTime()
  const positions = await scootersRepository.positionsAt(lastRequestTime)
  const count = positions.length
  return { lastRequestTime, count, positions }
}

export async function positionsByLicensePlate(req, license_plate) {
  const positions = await scootersRepository.positionsByLicensePlate(license_plate)
  return { license_plate, positions }
}

export async function countPositionsByLicensePlate(req, license_plate) {
  const count = (await scootersRepository.positionsByLicensePlate(license_plate)).length
  return { license_plate, count }
}

export async function batterySwapsByLicensePlate(req, license_plate) {
  const swaps = await scootersRepository.batterySwapsByLicensePlate(license_plate)
  return { license_plate, swaps }
}

export async function batterySwaps(req) {
  const swaps = await scootersRepository.batterySwaps()
  return { swaps }
}

export async function energyLevelDistribution(req) {
  const distribution = await scootersRepository.energyLevelDistribution()
  return { distribution }
}

export async function energyLevelDistributionPerHour(req) {
  const distributionPerHour = await scootersRepository.energyLevelDistributionPerHour()
  return { distributionPerHour }
}

export async function energyLevelStats(req) {
  const distribution = await scootersRepository.energyLevelDistribution()
  const per_hour = await scootersRepository.energyLevelDistributionPerHour()

  return { energy_level: { distribution, per_hour } }
}

export async function mostUsed(req) {
  const mostUsed = await scootersRepository.locationsByLicensePlate()
  return { mostUsed }
}

export async function nextAvailableScootersByLocation(req, lat, lng, distance) {
  const lastRequestTime = await scootersRepository.lastRequestTime()

  const positions = await scootersRepository.nextAvailableScootersByLocation(lastRequestTime, lat, lng, distance)
  const count = positions.length

  return { lastRequestTime, count, positions }
}
