import RightPanelContainer from '../RightPanelContainer'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'
import {PropsWithChildren, useEffect, useState} from 'react'
import {ActionIcon, Anchor, Box, Group, Modal, Stack, Text, Title} from '@mantine/core'
import {gql, request} from 'graphql-request'
import {getGraphQLUrl, prepareImageFromUrl, ProcessedImage, withFileCache} from '../ssrUtils'
import Image from 'next/image'
import defaultProfilePhoto from './defaultProfilePhoto.svg'
import {RichText, RichTextData} from '../components/RichText'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {IconBrandLinkedin, IconMail, IconX} from '@tabler/icons'

type PageQuery = { userId: string[] | undefined }

type Member = {
  id: string,
  name: string,
  title: string,
  profilePhoto: ProcessedImage | null,
}

type OpenedUser = null | {
  name: string,
  profilePhoto: ProcessedImage | null,
  email: string,
  bio: RichTextData | null,
  linkedIn: string | null,
}

type PageProp = {
  memberGroups: Array<{
    name: string,
    desc: string | null,
    members: Member[]
  }>
  openedUser: OpenedUser
}

export default function Members(props: PageProp) {
  const router = useRouter()
  const [openedUser, setOpenedUser] = useState<OpenedUser>(null)

  useEffect(() => {
    if (props.openedUser) setOpenedUser(props.openedUser)
  }, [openedUser, props.openedUser])

  return <RightPanelContainer hrefIndex={3} sx={{
    padding: 64,
  }}>
    <Stack spacing={32}>
      {props.memberGroups.map(({name, desc, members}, i) => <Box key={i}>
        <MemberGroupTitle>
          {name}
        </MemberGroupTitle>
        {desc && <Text mt={8} size={'xl'}>
          {desc}
        </Text>}
        <Group mt={16} align={'stretch'} spacing={24}>
          {members.map(member => <MemberComponent key={member.id} member={member}/>)}
        </Group>
      </Box>)}
    </Stack>
    <Modal
      opened={!!props.openedUser}
      withCloseButton={false}
      centered
      overlayBlur={4}
      overflow={'inside'}
      padding={0}
      size={'lg'}
      onClose={() => router.push('/members')}>
      {openedUser ? <Stack spacing={0} p={32} pt={27} sx={{
        position: 'relative',
      }}>
        <Link href={'/members'} passHref>
          <ActionIcon component={'a'} sx={{
            position: 'absolute',
            right: 32,
            top: 32,
          }}>
            <IconX size={32}/>
          </ActionIcon>
        </Link>
        <Title sx={{
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1,
        }}>
          {openedUser.name}
        </Title>
        <Box mt={24}>
          <Box sx={{
            float: 'left',
            paddingRight: 16,
            paddingBottom: 16,
          }}>
            <MemberProfilePicture image={openedUser.profilePhoto} alt={''}/>
            <Stack spacing={4} mt={8}>
              {openedUser.linkedIn ? <Anchor
                size={'lg'}
                href={openedUser.linkedIn}
                sx={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <IconBrandLinkedin/>
                LinkedIn
              </Anchor> : null}
              <Anchor
                size={'lg'}
                href={`mailto:${openedUser.email}`}
                sx={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <IconMail/>
                Email
              </Anchor>
            </Stack>
          </Box>
          {openedUser.bio ? <RichText data={openedUser.bio!}/> : null}
        </Box>
      </Stack> : null}
    </Modal>
  </RightPanelContainer>
}

function MemberGroupTitle(props: PropsWithChildren<{}>) {
  return <Title sx={{
    fontWeight: 500,
    fontSize: 48,
    lineHeight: 1,
  }}>
    {props.children}
  </Title>
}


function MemberProfilePicture({image, alt}: { image: ProcessedImage | null, alt?: string }) {
  return <Box
    sx={{
      overflow: 'hidden',
      borderRadius: 8,
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      width: 120,
    }}>
    <Image
      layout={'responsive'}
      sizes={'120px'}
      width={image?.width ?? 125}
      height={image?.height ?? 200}
      src={image?.url ?? defaultProfilePhoto}
      placeholder={image ? 'blur' : undefined}
      blurDataURL={image?.blurURL}
      alt={alt}
    />
  </Box>
}

function MemberComponent({member}: { member: Member }) {
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: 120,
      borderRadius: 8,
    }}>
    <MemberProfilePicture image={member.profilePhoto} alt={member.profilePhoto ? `Profile picture of ${member.name}` : ''}/>
    <Text size={'lg'} mt={4} sx={{
      fontWeight: 600,
      lineHeight: 1,
    }}>
      {member.name}
    </Text>
    <Text mt={4} sx={{
      lineHeight: 1,
    }}>
      {member.title}
    </Text>
    <Link href={`/members/${member.id}`} passHref>
      <Anchor color={'blue.7'} mt={4} sx={{
        lineHeight: 1,
      }}>
        + View Profile
      </Anchor>
    </Link>
  </Box>
}

export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const paths: Array<string[] | undefined> = [undefined]
  const res = await request(getGraphQLUrl(), gql`
{
  Users (limit: 999999) {
    docs {
      id
    }
  }
}
`)

  for (const {id} of res.Users.docs) {
    paths.push([id])
  }

  return {
    paths: paths.map(userId => ({
      params: {
        userId,
      },
    })),
    fallback: false,
  }
}

const getMemberGroups = withFileCache('.memberGroupsCache.json', async () => {
  const res = await request(getGraphQLUrl(), gql`
{
  MemberGroups {
    groups {
      name
      desc
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
      desc: memberGroup.desc ?? null,
      members,
    })
  }

  return memberGroups
})

export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>, PageQuery> = async context => {
  let openedUser: OpenedUser = null
  const userId = context.params?.userId?.[0] ?? null
  if (userId) {
    const userRes = await request(getGraphQLUrl(), gql`
query gerUser($id: String) {
  User(id: $id) {
    name
    profilePhoto {
      url
    }
    bio
    email
    linkedIn
  }
}
`, {
      id: userId,
    })
    openedUser = {
      name: userRes.User.name,
      email: userRes.User.email,
      profilePhoto: await prepareImageFromUrl(userRes.User.profilePhoto?.url),
      bio: userRes.User.bio ?? null,
      linkedIn: userRes.User.linkedIn ?? null,
    }
  }

  return {
    props: {
      memberGroups: await getMemberGroups(),
      openedUser,
      sideBarData: await getSideBarData(),
    },
  }
}