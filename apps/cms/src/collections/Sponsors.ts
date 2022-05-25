import {GlobalConfig} from 'payload/types'
import payload from 'payload'

const Sponsors: GlobalConfig = {
  slug: 'sponsors',
  access: {
    read: () => true,
    update: async ({req: {user}}) => {
      if (!user) return false
      if (user.admin) return true

      const {docs: [businessTeam]} = await payload.find({
        collection: 'teams',
        where: {
          urlName: {
            equals: 'business_operations',
          },
        },
        overrideAccess: true,
      })

      return businessTeam.members.find(member => member.user.id === user.id)
    },
  },
  fields: [
    {
      name: 'tiers',
      label: 'Sponsor Tiers',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Tier Name',
          type: 'text',
          required: true,
        },
        {
          name: 'logoHeight',
          label: 'Logo Height',
          type: 'number',
          required: true,
        },
        {
          name: 'sponsors',
          type: 'array',
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

export default Sponsors