import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

import { useBankingStore } from '@/stores/banking'
import { useCallsStore } from '@/stores/calls'
import { useMusicStore } from '@/stores/music'
import { usePhoneStore } from '@/stores/phone'
import { useWeatherStore } from '@/stores/weather'

const now = ref(new Date())
let clockConsumers = 0
let clockInterval: number | undefined
let contactsRequest: Promise<void> | undefined

export function useClockService(enabled: MaybeRefOrGetter<boolean> = true) {
  const phone = usePhoneStore()
  let active = false
  let mounted = false

  function syncClock(): void {
    const shouldBeActive = mounted && toValue(enabled)
    if (shouldBeActive === active) return

    active = shouldBeActive
    if (!active) {
      clockConsumers -= 1
      if (clockConsumers === 0 && clockInterval !== undefined) {
        window.clearInterval(clockInterval)
        clockInterval = undefined
      }
      return
    }

    clockConsumers += 1
    if (clockInterval === undefined) {
      clockInterval = window.setInterval(() => {
        now.value = new Date()
      }, 1000)
    }
  }

  watch(() => toValue(enabled), syncClock)
  onMounted(() => {
    mounted = true
    syncClock()
  })
  onBeforeUnmount(() => {
    mounted = false
    syncClock()
  })
  return {
    date: computed(() =>
      new Intl.DateTimeFormat(phone.lang, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
      }).format(now.value),
    ),
    day: computed(() => now.value.getDate()),
    month: computed(() =>
      new Intl.DateTimeFormat(phone.lang, { month: 'long' }).format(now.value),
    ),
    time: computed(() =>
      new Intl.DateTimeFormat(phone.lang, {
        hour: '2-digit',
        hourCycle: 'h23',
        minute: '2-digit',
      }).format(now.value),
    ),
    weekday: computed(() =>
      new Intl.DateTimeFormat(phone.lang, { weekday: 'long' }).format(
        now.value,
      ),
    ),
  }
}

export function useWeatherService() {
  const phone = usePhoneStore()
  const weather = useWeatherStore()
  return {
    condition: computed(() =>
      weather.forecast
        ? phone.t(`Apps.weather.conditions.${weather.forecast.condition}`)
        : phone.t('Common.loading'),
    ),
    forecast: computed(() => weather.forecast),
    loading: computed(() => weather.isLoading),
    location: computed(() =>
      phone.t(
        `Apps.weather.regions.${weather.forecast?.region ?? 'los_santos'}`,
      ),
    ),
  }
}

export function useMusicService() {
  const music = useMusicStore()
  return {
    current: computed(() => music.currentTrack),
    next(): void {
      void music.next()
    },
    playing: computed(() => music.isPlaying),
    progress: computed(() =>
      music.duration > 0
        ? Math.max(0, Math.min(100, (music.currentTime / music.duration) * 100))
        : 0,
    ),
    toggle(): void {
      void music.toggle()
    },
  }
}

export function useBankService(enabled: MaybeRefOrGetter<boolean> = true) {
  const banking = useBankingStore()
  const overview = computed(
    () =>
      banking.overview ?? {
        bank: 24_580,
        cash: 1_240,
        currency: '$',
        playerId: 0,
        playerName: 'Sky Citizen',
        transactions: [
          {
            amount: 1800,
            createdAt: Date.now() - 3_600_000,
            id: -1,
            kind: 'deposit' as const,
            label: 'Salary',
            reference: 'PAYROLL',
          },
          {
            amount: 86,
            createdAt: Date.now() - 7_200_000,
            id: -2,
            kind: 'withdrawal' as const,
            label: 'Fuel',
            reference: 'CARD',
          },
          {
            amount: 340,
            createdAt: Date.now() - 18_000_000,
            id: -3,
            kind: 'transfer_out' as const,
            label: 'Transfer',
            reference: 'PHONE',
          },
        ],
      },
  )
  function loadIfNeeded(): void {
    if (toValue(enabled) && !banking.overview && !banking.isLoading) {
      void banking.load()
    }
  }

  watch(() => toValue(enabled), loadIfNeeded)
  onMounted(loadIfNeeded)
  return { overview }
}

export function useContactsService(enabled: MaybeRefOrGetter<boolean> = true) {
  const calls = useCallsStore()
  const contacts = computed(() =>
    calls.contacts.length
      ? calls.contacts
      : [
          { id: 'mock-nova', name: 'Nova', phone_number: '555-0142' },
          { id: 'mock-alex', name: 'Alex', phone_number: '555-0198' },
          { id: 'mock-mia', name: 'Mia', phone_number: '555-0121' },
          { id: 'mock-liam', name: 'Liam', phone_number: '555-0177' },
        ],
  )
  function loadIfNeeded(): void {
    if (!toValue(enabled) || calls.contacts.length || contactsRequest) return

    contactsRequest = calls.loadContacts().finally(() => {
      contactsRequest = undefined
    })
  }

  watch(() => toValue(enabled), loadIfNeeded)
  onMounted(loadIfNeeded)
  return { contacts }
}
