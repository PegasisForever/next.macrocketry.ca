import type {GetStaticProps, NextPage} from 'next'
import {SideBarData} from './nav/common'
import {getSideBarData} from './nav/sideBarDataHelper'

const Home: NextPage = () => {
  return <div>
    hello!
  </div>
}

export default Home

export const getStaticProps: GetStaticProps<{ sideBarData: SideBarData, numberCardData: Array<{ number: number, title: string }> }> = async () => {
  return {
    props: {
      sideBarData: await getSideBarData(),
      numberCardData: [
        {
          number: 14,
          title: 'LAUNCHES',
        },
        {
          number: 14,
          title: 'SUCCESSES',
        },
        {
          number: 4,
          title: 'ROCKET MODELS',
        },
        {
          number: 0,
          title: 'MEMBERS',
        },
      ],
    },
  }
}