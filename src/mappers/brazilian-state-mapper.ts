import { BRAZILIAN_STATES, BrazilianState } from '@/constants/brazilian-states-lookup'

export class BrazilianStateMapper {
  static toComboBox(data: BrazilianState) {
    return {
      label: `${data.name} (${data.code})`,
      value: data.code,
      name: data.name,
      region: data.region,
    }
  }

  static getAllToComboBox() {
    return BRAZILIAN_STATES.map(this.toComboBox)
  }

  static getByRegionToComboBox(region: string) {
    return BRAZILIAN_STATES
      .filter(state => state.region === region)
      .map(this.toComboBox)
  }

  static toCodeOnly(data: BrazilianState) {
    return {
      label: data.code,
      value: data.code,
    }
  }

  static getAllCodeOnly() {
    return BRAZILIAN_STATES.map(this.toCodeOnly)
  }

  static toNameOnly(data: BrazilianState) {
    return {
      label: data.name,
      value: data.code,
    }
  }

  static getAllNameOnly() {
    return BRAZILIAN_STATES.map(this.toNameOnly)
  }

  static getFormattedLabelByCode(code: string): string {
    const state = BRAZILIAN_STATES.find(s => s.code === code)
    return state ? `${state.code} - ${state.name}` : code
  }
}

export type BrazilianStateMapperToComboBoxType = ReturnType<
  (typeof BrazilianStateMapper)['toComboBox']
>

export type BrazilianStateMapperCodeOnlyType = ReturnType<
  (typeof BrazilianStateMapper)['toCodeOnly']
>

export type BrazilianStateMapperNameOnlyType = ReturnType<
  (typeof BrazilianStateMapper)['toNameOnly']
>
