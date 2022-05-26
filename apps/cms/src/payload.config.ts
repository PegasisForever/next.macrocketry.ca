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
import {BigLogo, Logo} from './CustomComponents'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          [path.resolve(__dirname, 'collections/storageHooks.ts')]: path.resolve(__dirname, 'mock.ts'),
        },
      },
    }),
    components: {
      graphics: {
        Icon: Logo,
        Logo: BigLogo,
      },
    },
    indexHTML: path.resolve(__dirname, 'index.html'),
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
