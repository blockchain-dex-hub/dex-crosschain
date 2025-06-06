export const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = 3600
export const DAY_IN_SECONDS = 86400
const MONTH_IN_SECONDS = 2629800
export const YEAR_IN_SECONDS = 31557600

/**
 * Format number of seconds into year, month, day, hour, minute, seconds
 *
 * @param seconds
 */
const getTimePeriods = (seconds: number, _rounding: 'floor' | 'ceil' = 'floor') => {
  const rounding = _rounding === 'floor' ? Math.floor : Math.ceil
  let delta = Math.abs(seconds)
  const timeLeft = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  }

  if (delta >= DAY_IN_SECONDS) {
    timeLeft.totalDays = rounding(delta / DAY_IN_SECONDS)
  }

  if (delta >= YEAR_IN_SECONDS) {
    timeLeft.years = rounding(delta / YEAR_IN_SECONDS)
    delta -= timeLeft.years * YEAR_IN_SECONDS
  }

  if (delta >= MONTH_IN_SECONDS) {
    timeLeft.months = rounding(delta / MONTH_IN_SECONDS)
    delta -= timeLeft.months * MONTH_IN_SECONDS
  }

  if (delta >= DAY_IN_SECONDS) {
    timeLeft.days = rounding(delta / DAY_IN_SECONDS)
    delta -= timeLeft.days * DAY_IN_SECONDS
  }

  if (delta >= HOUR_IN_SECONDS) {
    timeLeft.hours = rounding(delta / HOUR_IN_SECONDS)
    delta -= timeLeft.hours * HOUR_IN_SECONDS
  }

  if (delta >= MINUTE_IN_SECONDS) {
    timeLeft.minutes = rounding(delta / MINUTE_IN_SECONDS)
    delta -= timeLeft.minutes * MINUTE_IN_SECONDS
  }

  timeLeft.seconds = delta

  return timeLeft
}

export default getTimePeriods
