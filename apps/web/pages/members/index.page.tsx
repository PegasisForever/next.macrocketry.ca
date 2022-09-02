import RightPanelContainer from '../RightPanelContainer'
import {GetStaticProps} from 'next'
import {getSideBarData} from '../nav/sideBarDataHelper'
import {PropsWithSideBar} from '../contexts'

type PageProp = {}

export default function Members(props: PageProp) {
  return <RightPanelContainer hrefIndex={3}>
    members
  </RightPanelContainer>
}


export const getStaticProps: GetStaticProps<PropsWithSideBar<PageProp>> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
    },
  }
}