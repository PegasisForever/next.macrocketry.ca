import RightPanelContainer from '../RightPanelContainer'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'

type PageQuery = { team: string[] | undefined }
type PageProp = {}

export default function Teams(props: PageProp) {
  return <RightPanelContainer hrefIndex={1}>
    teams
  </RightPanelContainer>
}

export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  return {
    paths: [
      {
        params: {
          team: undefined,
        },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}