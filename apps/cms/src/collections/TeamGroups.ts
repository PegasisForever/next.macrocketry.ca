import {GlobalConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const TeamGroups: GlobalConfig = {
  label: 'Team Groups',
  slug: 'team_groups',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
  },
  admin:{
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
          name: 'urlName',
          label: 'Url Name',
          type: 'text',
          required: true,
        },
        {
          name: 'teams',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'team',
              type: 'relationship',
              relationTo: 'teams',
              required: true,
            },
          ],
        },
      ],
    },

  ],
}

export default TeamGroups