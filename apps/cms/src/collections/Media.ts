import {CollectionConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'
import {storageAfterDelete, storageAfterRead, storageBeforeChange} from './storageHooks'

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
    delete: accessOnlyAdmin,
  },
  admin: {
    disableDuplicate: true,
    hideAPIURL: true,
  },
  hooks: {
    beforeChange: [
      storageBeforeChange,
    ],
    afterRead: [
      storageAfterRead,
    ],
    afterDelete: [
      storageAfterDelete,
    ],
  },
  upload: {
    staticDir: '../media',
    mimeTypes: ['image/*'],
    adminThumbnail: ({doc}) => doc.url as string,
  },
  fields: [
    {
      name: 'ref',
      type: 'text',
      access: {
        update: () => false,
      },
      admin: {
        condition: () => false,
      },
    },
  ],
}

export default Media