import RightPanelContainer from '../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'
import {Fragment, PropsWithChildren} from 'react'
import {Box, Group, Title} from '@mantine/core'
import {gql, request} from 'graphql-request'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage} from '../ssrUtils'

type Member = {
  id: string,
  name: string,
  title: string,
  profilePhoto: ProcessedImage | null,
}

type PageProp = {
  memberGroups: Array<{
    name: string,
    members: Member[]
  }>
}

export default function Members(props: PageProp) {
  return <RightPanelContainer hrefIndex={3}>
    {props.memberGroups.map(({name, members}, i) => <Fragment key={i}>
      <MemberGroupTitle>
        {name}
      </MemberGroupTitle>
      <Group>
        {members.map(member => <MemberComponent key={member.id} member={member}/>)}
      </Group>
    </Fragment>)}
  </RightPanelContainer>
}

function MemberGroupTitle(props: PropsWithChildren<{}>) {
  return <Title>
    {props.children}
  </Title>
}

function MemberComponent({member}: { member: Member }) {
  return <Box>
    {member.name}
  </Box>
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  const res = await request(getGraphQLUrl(), gql`
{
  MemberGroups {
    groups {
      name
      members {
        title
        member {
          id
          profilePhoto {
            url
          }
          name
        }
      }
    }
  }
}
`)

  const memberGroups: PageProp['memberGroups'] = []
  for (const memberGroup of res.MemberGroups.groups) {
    const members: Member[] = []
    for (const {title, member} of memberGroup.members) {
      members.push({
        title,
        id: member.id,
        name: member.name,
        profilePhoto: await prepareImageFromUrl(member.profilePhoto?.url),
      })
    }
    memberGroups.push({
      name: memberGroup.name,
      members,
    })
  }


  return {
    props: {
      memberGroups,
      sideBarData: await getSideBarData(),
    },
  }
}