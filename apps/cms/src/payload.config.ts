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

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Teams,
    Blogs,
    Media,
    Users,
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
