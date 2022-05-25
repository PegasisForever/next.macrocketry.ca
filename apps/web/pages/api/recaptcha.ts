import axios from 'axios'
import FormData from 'form-data'

require('dotenv').config()

type RecaptchaVerifyRes = {
  success: boolean,
  score: number,
  action: string,
  challenge_ts: string,
  hostname: string,
}

export async function validateRecaptcha(token: string | undefined, action: string): Promise<number> {
  if (typeof token === 'undefined') return 0
  const form = new FormData()
  form.append('secret', process.env.RECAPTCHA_SERVER_KEY)
  form.append('response', token)
  const res = await axios.post<RecaptchaVerifyRes>(
    'https://www.google.com/recaptcha/api/siteverify',
    form,
    {headers: form.getHeaders()})
  console.log(res.data)

  if (res.data.action !== action) return 0
  return res.data.score
}