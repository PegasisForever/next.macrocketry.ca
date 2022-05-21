import {GlobalConfig} from 'payload/types'
import {accessOnlyAdmin} from '../accessOnlyAdmin'

const Overview: GlobalConfig = {
  slug: 'overview',
  access: {
    read: () => true,
    update: accessOnlyAdmin,
  },
  fields: [
    {
      name:'launches',
      type:'number',
      required:true,
    },
    {
      name:'successes',
      type:'number',
      required:true,
    },
    {
      name:'rocketModels',
      label:'Rocket Models',
      type:'number',
      required:true,
    },
  ],
}

export default Overview