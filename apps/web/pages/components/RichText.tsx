import {Anchor, Box, BoxProps, List, Text, Title, TitleOrder} from '@mantine/core'
import {ProcessedImage} from '../ssrUtils'
import {ResponsiveImageWrapper} from './ResponsiveImageWrapper'
import {StaticImageData} from 'next/dist/client/image'
import {useMeasure, useWindowSize} from 'react-use'

type Leaf = {
  text: string,
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
}

type Node = {
  type?: string,
  url?: string,
  image?: ProcessedImage,
  value?: {
    id: string,
  },
  relationTo?: string,
  children: Array<Node | Leaf>
}

export type RichTextData = Array<Node | Leaf>

const titleTypeRegex = /^h([1-6])$/

function RichTextNode(props: { data: RichTextData, first?: boolean }) {
  let first = props.first
  return <>
    {props.data.map((node, i) => {
      if ('text' in node) {
        if (node.bold) {
          return <strong key={i}>
            {node.text}
          </strong>
        }
        if (node.italic) {
          return <em key={i}>
            {node.text}
          </em>
        }
        if (node.underline) {
          return <u key={i}>
            {node.text}
          </u>
        }
        return <span key={i}>
          {node.text}
        </span>
      }

      const titleMatchResult = node.type?.match(titleTypeRegex)
      const mt = first ? 0 : 'sm'
      first = false
      if (titleMatchResult?.[1]) {
        const titleOrder = parseInt(titleMatchResult?.[1]) as TitleOrder
        return <Title order={titleOrder} mt={mt} key={i}>
          <RichTextNode data={node.children}/>
        </Title>
      } else if (node.type === 'ol') {
        return <List type={'ordered'} mt={mt} key={i}>
          {node.children.map((child: any, i: number) => <List.Item key={i}>
            <RichTextNode data={child.children}/>
          </List.Item>)}
        </List>
      } else if (node.type === 'ul') {
        return <List type={'unordered'} mt={mt} key={i}>
          {node.children.map((child: any, i: number) => <List.Item key={i}>
            <RichTextNode data={child.children}/>
          </List.Item>)}
        </List>
      } else if (node.type === 'link') {
        return <Anchor target={'_blank'} rel={'noreferrer'} href={node.url} key={i}>
          <RichTextNode data={node.children}/>
        </Anchor>
      } else if (node.image) {
        return <ImageWrapper src={node.image}/>
      } else {
        return <Text mt={mt} key={i} size={'lg'}>
          <RichTextNode data={node.children}/>
        </Text>
      }
    })}
  </>
}

function ImageWrapper(props: { src: StaticImageData }) {
  const {height} = useWindowSize()
  const [ref, {width}] = useMeasure<HTMLDivElement>()

  return <Box ref={ref} sx={{
    width: '100%',
  }}>
    <ResponsiveImageWrapper src={props.src} maxHeight={height * 0.8} maxWidth={width}/>
  </Box>
}

export function RichText({data, ...wrapperProps}: { data: RichTextData } & BoxProps) {
  return <Box {...wrapperProps}>
    <RichTextNode data={data} first/>
  </Box>
}