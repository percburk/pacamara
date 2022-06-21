import { BrewState } from '../../models/stateResource'
import { initialBrewState } from './AddEditBrew'

const decimalValidationKeys: (keyof BrewState)[] = [
  'co2',
  'coffeeDose',
  'moisture',
  'lrr',
  'tds',
]

const decimalPlaceOptions: { [K in keyof BrewState]?: number } = {
  waterDose: 0,
  coffeeDose: 1,
  grind: 0,
  moisture: 1,
  co2: 1,
  tds: 2,
  ext: 1,
  waterTemp: 0,
  lrr: 1,
}

export const validateNumberInput = (input: string, key: keyof BrewState) => {
  const decimalPlace = decimalPlaceOptions[key] ?? 0
  if (!input.includes('.') || decimalPlace === 0) {
    const inputAsNumber = Number(input)
    return !isNaN(inputAsNumber) && inputAsNumber >= 0 ? inputAsNumber : undefined
  }

  const splitByDecimal = input.split('.')
  const valid =
    splitByDecimal.length <= 2 &&
    splitByDecimal[1]?.length <= decimalPlace &&
    splitByDecimal.every((item) => !isNaN(Number(item)))

  return valid ? input : undefined
}

export const validateSubmit = (brew: BrewState) => {
  return Object.entries(brew).reduce<BrewState>((acc, [key, value]) => {
    if (decimalValidationKeys.includes(key as keyof BrewState)) {
      if ((value as string)[-1] === '.') {
        return { ...acc, [key]: Number((value as string).slice(0, -1)) }
      }
      return { ...acc, [key]: Number(value) }
    }
    return { ...acc, [key]: value }
  }, initialBrewState)
}
