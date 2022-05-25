import type {ReCaptchaInstance} from 'recaptcha-v3'

const recaptchaSiteKey = '6LenCXMeAAAAAAPmfqAz8CEXvF2nJdvLHkUKkCd7'

let recaptchaInstance: ReCaptchaInstance | null = null

export function initRecaptcha() {
  if (typeof window !== 'undefined') {
    import('recaptcha-v3')
      .then(r => r.load(recaptchaSiteKey))
      .then(i => recaptchaInstance = i)
  }
}

export function getRecaptcha(): ReCaptchaInstance | null {
  return recaptchaInstance
}