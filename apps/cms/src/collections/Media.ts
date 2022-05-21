import {CollectionConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
    delete: accessOnlyAdmin,
  },
  upload: {
    staticURL: '/media',
    staticDir: '../media',
    mimeTypes: ['image/*'],
  },
  fields: [],
}

export default Media