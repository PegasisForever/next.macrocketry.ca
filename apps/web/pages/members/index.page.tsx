import RightPanelContainer from '../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'
import {Fragment, PropsWithChildren} from 'react'
import {Box, createStyles, Group, Text, Title} from '@mantine/core'
import {gql, request} from 'graphql-request'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage} from '../ssrUtils'
import Image from 'next/image'
import defaultProfilePhoto from './defaultProfilePhoto.svg'
import Link from 'next/link'

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
  return <RightPanelContainer hrefIndex={3} sx={{
    padding: 64,
    paddingTop: 32,
  }}>
    {props.memberGroups.map(({name, members}, i) => <Fragment key={i}>
      <MemberGroupTitle>
        {name}
      </MemberGroupTitle>
      <Group align={'stretch'} spacing={24}>
        {members.map(member => <MemberComponent key={member.id} member={member}/>)}
      </Group>
    </Fragment>)}

  </RightPanelContainer>
}

function MemberGroupTitle(props: PropsWithChildren<{}>) {
  return <Title sx={{
    fontWeight: 500,
    fontSize: 48,
    lineHeight: 1,
    marginTop: 32,
    marginBottom: 16,
  }}>
    {props.children}
  </Title>
}

const useStyles = createStyles(() => ({
  container: {},
}))

function MemberComponent({member}: { member: Member }) {
  const {classes} = useStyles()
  return <Link href={'#'} passHref>
    <Box
      component={'a'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 120,
        borderRadius: 8,

        [`&:hover > .${classes.container}`]: {
          transform: 'scale(1.1)',
          borderRadius: 18,
        },
      }}>
      <Box
        className={classes.container}
        sx={{
        overflow: 'hidden',
        borderRadius: 8,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',


      }}>
        <Image
          layout={'responsive'}
          sizes={'120px'}
          width={member.profilePhoto?.width ?? 125}
          height={member.profilePhoto?.height ?? 200}
          src={member.profilePhoto?.url ?? defaultProfilePhoto}
          placeholder={member.profilePhoto ? 'blur' : undefined}
          blurDataURL={member.profilePhoto?.blurURL}
          alt={member.profilePhoto ? `Profile picture of ${member.name}` : ''}
        />
      </Box>
      <Text size={'lg'} sx={{
        fontWeight: 600,
      }}>
        {member.name}
      </Text>
      <Text sx={{
        lineHeight: 1,
      }}>
        {member.title}
      </Text>
    </Box>
  </Link>
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