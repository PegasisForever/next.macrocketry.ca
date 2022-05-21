import {CollectionConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'
import payload from 'payload'
import {Team} from '../payload-types'

const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: accessOnlyAdmin,
    delete: accessOnlyAdmin,
    read: () => true,
    update: async ({req: {user}, id}) => {
      if (!user) return false
      if (!id) return true

      const updatingTeam = await payload.findByID<Team>({
        collection: 'teams',
        id,
        overrideAccess: true,
      })

      return updatingTeam.members.find(member => (member.user as any).id === user.id)?.allowEdit
    },
  },
  fields: [
    {
      name: 'name',
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
      name: 'shortDescription',
      label: 'Short Description',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        hideGutter: true,
      },
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'members',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'user',
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
        {
          type: 'checkbox',
          name: 'allowEdit',
          label: 'Allow Edit',
        },
      ],
    },
    {
      name: 'projects',
      label: 'Current Projects',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'start',
              label: 'Start Date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
            {
              name: 'end',
              label: 'End Date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}

export default Teams