import {Blog} from './[[...blogId]].page'
import {Anchor, createStyles, Stack, Text} from '@mantine/core'
import Link from 'next/link'
import {IconChevronLeft} from '@tabler/icons'
import PageTitle from '../components/PageTItle'
import TimeAgo from 'timeago-react'
import {RichText} from '../components/RichText'
import {m} from 'framer-motion'

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.gray[0],
    zIndex: 10,
    overflowY: 'auto',
  },
}))

export default function BlogArticle({blog}: { blog: Blog }) {
  const {classes} = useStyles()

  return <m.div
    className={classes.wrapper}
    initial={{
      opacity: 0,
      translateX: '50px',
    }}
    animate={{
      opacity: 1,
      translateX: '0px',
    }}
    exit={{
      opacity: 0,
      translateX: '50px',
    }}
    transition={{type: 'spring', bounce: 0, duration: 0.5}}
  >
    <Stack p={64} pt={24} spacing={0} sx={{
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
        marginTop: 16,
        marginBottom: 0,
        lineHeight: 1.2,
      }}>
        {blog.title}
      </PageTitle>
      <Text color={'dimmed'}>
        <TimeAgo datetime={blog.createdAt}/>
      </Text>
      <RichText data={blog.content} mt={16}/>
    </Stack>
  </m.div>
}