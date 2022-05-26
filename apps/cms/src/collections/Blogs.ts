import {CollectionConfig} from 'payload/types'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    disableDuplicate: true,
    hideAPIURL: true,
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'richText',
      admin: {
        hideGutter: true,
      },
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        hideGutter: true,
      },
      required: true,
    },
    {
      name: 'authors',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
  ],
}

export default Blogs