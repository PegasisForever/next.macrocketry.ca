import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'
// @ts-ignore
import sgMail from '@sendgrid/mail'
import {validateRecaptcha} from './recaptcha'
import {gql, request} from 'graphql-request'

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const ZodReqType = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  recaptchaToken: z.string().optional(),
})

export type ReqType = z.infer<typeof ZodReqType>

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST' && ZodReqType.safeParse(req.body).success) {
    const data = req.body as ReqType
    const recaptchaScore = await validateRecaptcha(data.recaptchaToken, 'send_message')
    console.log('score:', recaptchaScore)

    let emailSent = false
    if (recaptchaScore > 0.5 && process.env.NODE_ENV !== 'development') {
      try {
        console.log('Sending email.....')
        await sgMail.send({
          to: 'mcmaster.rocketry@gmail.com',
          from: 'noreply@macrocketry.ca',
          subject: 'McMaster Rocketry Contact',
          html: `<p>
<strong>Name:</strong> ${escape(data.name)}
</p>
<p>
<strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a>
</p>
<p>
<strong>Message:</strong> ${escape(data.message)}
</p>`,
        })
        emailSent = true
        console.log('Email sent')
      } catch (e) {
        console.error(e)
      }

    }

    console.log(process.env.PAYLOAD_KEY)
    await request(process.env.PAYLOAD_CONFIG_PATH!, gql`
mutation {
  createContactMessage (data: {
    recaptchaScore: ${JSON.stringify(recaptchaScore)},
    name: ${JSON.stringify(data.name)},
    email: ${JSON.stringify(data.email)},
    message: ${JSON.stringify(data.message)},
    emailSent: ${JSON.stringify(emailSent)}}) {
    recaptchaScore
    email
    message
    emailSent
    name
  }
}
`, undefined, {
      Authorization: `User API-Key ${process.env.PAYLOAD_KEY}`,
    })

    console.log({
      recaptchaScore,
      name: data.name,
      email: data.email,
      message: data.message,
      emailSent,
    })
    res.status(200).send('')
  } else {
    res.status(400).send('')
  }
}