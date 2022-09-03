import {CollectionConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'name',
    disableDuplicate: true,
    hideAPIURL: true,
  },
  access: {
    create: accessOnlyAdmin,
    delete: () => false,
    read: () => true,
    update: ({req: {user}}) => {
      if (!user) return false
      if (user.admin) {
        return true
      } else {
        return {
          id: {
            equals: user.id,
          },
        }
      }
    },
    unlock: accessOnlyAdmin,
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'admin',
      type: 'checkbox',
      access: {
        read: accessOnlyAdmin,
        update: accessOnlyAdmin,
      },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        elements: [
          'link',
        ],
        leaves: [
          'bold',
          'italic',
          'underline',
        ],
        hideGutter: true,
      },
    },
    {
      name: 'linkedIn',
      type: 'text',
    },
  ],
}

export default Users