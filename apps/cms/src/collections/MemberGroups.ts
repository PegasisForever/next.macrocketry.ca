import {GlobalConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const MemberGroups: GlobalConfig = {
  label: 'Member Groups',
  slug: 'member_groups',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
  },
  admin: {
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Group Name',
          type: 'text',
          required: true,
        },
        {
          name: 'desc',
          label: 'Group Description',
          type: 'text',
        },
        {
          name: 'members',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'member',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
      ],
    },

  ],
}

export default MemberGroups