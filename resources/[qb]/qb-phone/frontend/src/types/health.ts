export type HealthActivityDay = {
  activeSeconds: number
  date: string
  distanceMeters: number
  energyKcal: number
  steps: number
}

export type HealthMedicalId = {
  allergies: string
  bloodType: string
  conditions: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  medication: string
  playerName: string
}

export type HealthOverview = {
  dailyStepGoal: number
  days: HealthActivityDay[]
  emergencyNumber: string
  medicalId: HealthMedicalId
  previousWeekSteps: number
}

export type HealthMedicalIdInput = Omit<HealthMedicalId, 'playerName'>
