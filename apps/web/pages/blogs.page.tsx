import {GetStaticProps} from 'next'
import {TopLevelPageProps} from './TopLevelPageProps'
import RightPanelContainer from './RightPanelContainer'
import {getSideBarData} from './nav/sideBarDataHelper'
import {Box, Button, Divider, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {RichText, RichTextData} from './components/RichText'
import PageTitle from './components/PageTItle'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage} from './ssrUtils'
import {gql, request} from 'graphql-request'
import TimeAgo from 'timeago-react'
import Image from 'next/image'
import {IconArrowRight} from '@tabler/icons'

type BlogMeta = {
  id: string,
  createdAt: number,
  title: string,
  summary: RichTextData,
  coverImage: ProcessedImage | null,
}

type Blog = BlogMeta & {
  content: RichTextData,
  updatedAt: number,
  author: {
    name: string,
  }
}

type PageProp = TopLevelPageProps & { blogMetas: BlogMeta[] }

function BlogMetaComponent({meta}: { meta: BlogMeta }) {
  const theme = useMantineTheme()

  return <Group noWrap align={'start'} spacing={32}>
    <Stack spacing={0} align={'start'} sx={{
      flexGrow: 1,
    }}>
      <Text color={'dimmed'} sx={{lineHeight: 1.2}}>
        <TimeAgo datetime={meta.createdAt}/>
      </Text>
      <Title order={3} sx={{
        fontWeight: 500,
        fontSize: 30,
      }}>
        {meta.title}
      </Title>
      <RichText data={meta.summary}/>
      <Button variant={'outline'} mt={16} rightIcon={<IconArrowRight size={22}/>} pr={14}>
        Read More
      </Button>
    </Stack>
    {meta.coverImage ? <Box sx={{
      width: 200 / meta.coverImage.height * meta.coverImage.width,
      flexShrink: 0,
      paddingTop: 20,
    }}>
      <Image
        style={{
          borderRadius: theme.radius.sm,
        }}
        layout={'responsive'}
        src={meta.coverImage.url}
        blurDataURL={meta.coverImage.blurURL}
        width={meta.coverImage.width}
        height={meta.coverImage.height}
        alt={''}/>
    </Box> : null}
  </Group>
}

export default function BlogsPage(props: PageProp) {
  return <RightPanelContainer hrefIndex={3} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    <Stack p={64} pt={24} spacing={32} sx={{
      maxWidth: 1200,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <PageTitle sx={{
        marginBottom: 16,
      }}>
        Blogs
      </PageTitle>
      {props.blogMetas.map((meta, i) => <>
        <BlogMetaComponent key={i} meta={meta}/>
        {i !== props.blogMetas.length - 1 ? <Divider/> : null}
      </>)}
    </Stack>
  </RightPanelContainer>
}


export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>> = async () => {
  const res = await request(getGraphQLUrl(), gql`
{
  Blogs (limit:10000000) {
    docs {
      id
      title
      summary
      content
      createdAt
      coverImage {
        url
      }
    }
  }
}
`)

  const blogMetas: BlogMeta[] = []

  for (const dbMeta of res.Blogs.docs) {
    blogMetas.push({
      id: dbMeta.id,
      title: dbMeta.title,
      summary: dbMeta.summary,
      coverImage: await prepareImageFromUrl(dbMeta.coverImage?.url),
      createdAt: Date.parse(dbMeta.createdAt),
    })
  }

  return {
    props: {
      sideBarData: await getSideBarData(),
      blogMetas: blogMetas,
    },
  }
}