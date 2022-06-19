import {GetStaticPaths, GetStaticProps} from 'next'
import {TopLevelPageProps} from '../TopLevelPageProps'
import RightPanelContainer from '../RightPanelContainer'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {Anchor, Box, Button, Divider, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {RichText, RichTextData} from '../components/RichText'
import PageTitle from '../components/PageTItle'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage} from '../ssrUtils'
import {gql, request} from 'graphql-request'
import TimeAgo from 'timeago-react'
import Image from 'next/image'
import {IconArrowRight, IconChevronLeft} from '@tabler/icons'
import Link from 'next/link'

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

type PageProp = TopLevelPageProps & { blogMetas: BlogMeta[], blog: Blog | null }
type PageQuery = { blogId: string[] | undefined }

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
      <Link href={`/blogs/${meta.id}`} passHref>
        <Button component={'a'} variant={'outline'} mt={16} rightIcon={<IconArrowRight size={22}/>} pr={14}>
          Read More
        </Button>
      </Link>
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
    {props.blog ? <Stack p={64} pt={24} spacing={0} sx={{
      maxWidth: 1200,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <Link href={'/blogs'} passHref>
        <Anchor size={'lg'} sx={{
          textUnderlineOffset: 1,
          '& > *': {
            verticalAlign: 'middle',
          },
        }}>
          <IconChevronLeft/>
          <span>Back</span>
        </Anchor>
      </Link>
      <PageTitle size={60} sx={{
        marginTop:16,
        marginBottom: 0,
        lineHeight: 1.2,
      }}>
        {props.blog.title}
      </PageTitle>
      <Text color={'dimmed'}>
        <TimeAgo datetime={props.blog.createdAt}/>
      </Text>
      <RichText data={props.blog.content} mt={16}/>
    </Stack> : <Stack p={64} pt={24} spacing={32} sx={{
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
    </Stack>}
  </RightPanelContainer>
}

export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const paths: Array<string[] | undefined> = [undefined]

    const res = await request(getGraphQLUrl(), gql`
      {
        Blogs (limit:10000000) {
          docs {
            id
          }
        }
      }
    `)


  for (const {id} of res.Blogs.docs) {
    paths.push([id])
  }

  return {
    paths: paths.map(id => ({
      params: {
        blogId: id,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>, PageQuery> = async context => {
  const blogId = context.params?.blogId?.[0]

  let res
    if (blogId) {
      res = await request(getGraphQLUrl(), gql`
        query getBlog($id: String) {
          Blogs (limit:10000000) {
            docs {
              id
              title
              summary
              createdAt
              coverImage {
                url
              }
            }
          }
          Blog (id: $id){
            id
            title
            summary
            content
            createdAt
            updatedAt
            coverImage {
              url
            }
            authors {
              user {
                id
                name
                profilePhoto {
                  url
                }
              }
            }
          }
        }
      `, {
        id: blogId,
      })
    } else {
      res = await request(getGraphQLUrl(), gql`
        query getBlog {
          Blogs (limit:10000000) {
            docs {
              id
              title
              summary
              createdAt
              coverImage {
                url
              }
            }
          }
        }
      `)
    }

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
      blog: res.Blog ?? null,
    },
  }
}