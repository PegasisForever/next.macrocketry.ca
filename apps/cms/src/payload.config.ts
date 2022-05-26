import {buildConfig} from 'payload/config'
import path from 'path'
import Users from './collections/Users'
import Media from './collections/Media'
import Teams from './collections/Teams'
import TeamGroups from './collections/TeamGroups'
import Sponsors from './collections/Sponsors'
import Blogs from './collections/Blogs'
import Overview from './collections/Overview'
import Recruitment from './collections/Recruitment'
import Messages from './collections/Messages'

const storageHooksPath = path.resolve(__dirname, 'collections/storageHooks.ts')
const mockModulePath = path.resolve(__dirname, 'mock.ts')

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          [storageHooksPath]: mockModulePath,
        },
      },
    }),
  },
  collections: [
    Teams,
    Blogs,
    Media,
    Users,
    Messages,
  ],
  globals: [
    Overview,
    TeamGroups,
    Sponsors,
    Recruitment,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
