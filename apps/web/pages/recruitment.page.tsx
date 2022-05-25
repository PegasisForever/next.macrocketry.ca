import {GetStaticProps} from 'next'
import {TopLevelPageProps} from './TopLevelPageProps'
import RightPanelContainer from './RightPanelContainer'
import {getSideBarData} from './nav/sideBarDataHelper'
import {Button, Divider, Group, Paper, Stack, Title} from '@mantine/core'
import {gql, request} from 'graphql-request'
import {RichText, RichTextData} from './components/RichText'
import PageTitle from './components/PageTItle'


type Position = {
  name: string,
  url: string,
  description: RichTextData,
}
type PageProp = TopLevelPageProps & { positions: Position[] }


export default function RecruitmentPage(props: PageProp) {
  return <RightPanelContainer hrefIndex={5} prevHrefIndex={props.prevHrefIndex} sideBarData={props.sideBarData}>
    <Stack p={64} pt={24} spacing={32}>
      <PageTitle>
        Recruitment
      </PageTitle>
      {props.positions.map(position => <Paper key={position.name} shadow={'md'} withBorder p={32} pt={24}>
        <Group align={'center'} position={'apart'}>
          <Title order={3} sx={{
            whiteSpace: 'nowrap',
            fontWeight: 500,
            fontSize: 28,
          }}>
            {position.name}
          </Title>

          <Button size={'md'}>
            Apply
          </Button>
        </Group>
        <Divider my={16}/>
        <RichText data={position.description} sx={{
          flexGrow: 1,
          flexShrink: 1,
        }}/>
      </Paper>)}
    </Stack>
  </RightPanelContainer>
}


export const getStaticProps: GetStaticProps<Omit<PageProp, 'prevHrefIndex'>> = async () => {
  const res = await request(process.env.PAYLOAD_CONFIG_PATH!, gql`
{
  Recruitment {
    positions {
      name
      url
      description
    }
  }
}
`)

  return {
    props: {
      sideBarData: await getSideBarData(),
      positions: res.Recruitment.positions as Position[],
    },
  }
}