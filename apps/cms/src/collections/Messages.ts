import {CollectionConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: 'Contact Message',
    plural: 'Contact Messages',
  },
  admin: {
    disableDuplicate: true,
    hideAPIURL: true,
  },
  access: {
    create: accessOnlyAdmin,
    delete: accessOnlyAdmin,
    read: accessOnlyAdmin,
    update: accessOnlyAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'recaptchaScore',
      label: 'reCAPTCHA Score',
      type: 'number',
      required: true,
      admin: {
        description: 'Measures how likely this message is sent by a human, from 0: definitely a bot to 1: definitely a human.',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      required: true,
    },
  ],
}

export default Messages