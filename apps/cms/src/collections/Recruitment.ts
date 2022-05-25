import {GlobalConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const Recruitment: GlobalConfig = {
  slug: 'recruitment',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
  },
  fields: [
    {
      name: 'positions',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'Apply Link',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          admin: {
            hideGutter: true,
            elements: [
              'link',
              'ol',
              'ul',
            ],
            leaves: [
              'bold',
              'italic',
              'underline',
            ],
          },
        },
      ],
    },
  ],
}

export default Recruitment