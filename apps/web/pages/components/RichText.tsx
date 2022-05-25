import {Anchor, Box, List, Text} from '@mantine/core'
import {BoxProps} from '@mantine/core/lib/components/Box/Box'

type Leaf = {
  text: string,
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
}

type Node = {
  type?: string,
  url?: string,
  children: Array<Node | Leaf>
}

export type RichTextData = Array<Node | Leaf>

function RichTextNode(props: { data: RichTextData }) {
  return <>
    {props.data.map((node, i) => {
      if ('text' in node) {
        if (node.bold){
          return <strong>
            {node.text}
          </strong>
        }
        if (node.italic){
          return <em>
            {node.text}
          </em>
        }
        if (node.underline){
          return <u>
            {node.text}
          </u>
        }
        return <span>
          {node.text}
        </span>
      }

      if (node.type === 'ol') {
        return <List type={'ordered'} mt={'sm'}>
          {node.children.map((child: any, i: number) => <List.Item key={i}>
            <RichTextNode data={child.children}/>
          </List.Item>)}
        </List>
      } else if (node.type === 'ul') {
        return <List type={'unordered'} mt={'sm'}>
          {node.children.map((child: any, i: number) => <List.Item key={i}>
            <RichTextNode data={child.children}/>
          </List.Item>)}
        </List>
      } else if (node.type === 'link') {
        return <Anchor target={'_blank'} rel={'noreferrer'} href={node.url}>
          <RichTextNode data={node.children}/>
        </Anchor>
      } else {
        return <Text mt={'sm'}>
          <RichTextNode data={node.children}/>
        </Text>
      }
    })}
  </>
}

export function RichText({data, ...wrapperProps}: { data: RichTextData } & BoxProps<'div'>) {
  return <Box {...wrapperProps}>
    <RichTextNode data={data}/>
  </Box>
}