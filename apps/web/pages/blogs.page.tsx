import {GetStaticProps} from 'next'
import {TopLevelPageProps} from './TopLevelPageProps'
import RightPanelContainer from './RightPanelContainer'
import {getSideBarData} from './nav/sideBarDataHelper'
import {Stack} from '@mantine/core'
import {RichTextData} from './components/RichText'
import PageTitle from './components/PageTItle'
import {ProcessedImage} from './ssrUtils'


type BlogMeta = {
  createdAt: Date,
  title: string,
  summary: RichTextData,
  coverImage: ProcessedImage,
}

type Blog = BlogMeta & {
  content: RichTextData,
  updatedAt: Date,
  author: {
    name: string,
  }
}

type PageProp = TopLevelPageProps & { blogMetas: BlogMeta[] }


export default function BlogsPage(props: PageProp) {
  return <RightPanelContainer hrefIndex={3} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    <Stack p={64} pt={24} spacing={32}>
      <PageTitle>
        Blogs
      </PageTitle>
    </Stack>
  </RightPanelContainer>
}


export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>> = async () => {
//   const res = await request(getGraphQLUrl(), gql`
// {
//   Recruitment {
//     positions {
//       name
//       url
//       description
//     }
//   }
// }
// `)

  return {
    props: {
      sideBarData: await getSideBarData(),
      blogMetas: [],
    },
  }
}