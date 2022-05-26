import React from 'react'
import logo from './logo.png'

export function Logo() {
  return <img src={logo} width={125} alt={''}/>
}

export function BigLogo() {
  return <img src={logo} width={180} alt={''}/>
}

export function BeforeNavLinks() {
  return <a href={'/'} className={'back-to-main'}>
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
    </svg>
    Back to main site
  </a>
}