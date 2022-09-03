import payload from 'payload'
import {Media, Overview, Recruitment, Sponsors, User} from './payload-types'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import {getStorage} from 'firebase-admin/storage'
import {generate} from 'generate-password'
import path from 'path'
import {TypeWithID} from 'payload/dist/collections/config/types'
import draftToHtml from 'draftjs-to-html'
import {jsx} from 'slate-hyperscript'
import {JSDOM} from 'jsdom'

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr)
    }
    // If a string
    return this.replace(new RegExp(str, 'g'), newStr)
  }
}

export async function importFromFirestore() {
  const auth = getAuth()
  const db = getFirestore()
  const bucket = getStorage().bucket()

  async function importImage(ref: string): Promise<string> {
    console.log(`importing ${ref}`)
    const fileName = path.basename(ref)

    const existingMedia = await payload.find<Media>({
      collection: 'media',
      where: {
        filename: {
          equals: fileName,
        },
      },
      overrideAccess: true,
    })

    if (existingMedia.docs.length > 0) {
      return existingMedia.docs[0].id
    }

    await bucket.file(ref).download({
      destination: `/tmp/${fileName}`,
    })
    const newMedia = await payload.create<Media>({
      collection: 'media',
      data: {
        filename: fileName,
      },
      overrideAccess: true,
      filePath: `/tmp/${fileName}`,
    })
    return newMedia.id
  }

  async function createIfNotExist<T extends TypeWithID = any>(options: {
    collection: string,
    data: Record<string, unknown>,
    createData?: Record<string, unknown>,
    id: string,
  }) {
    const existing = await payload.find<T>({
      collection: options.collection,
      where: {
        [options.id]: {
          equals: options.data[options.id],
        },
      },
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      await payload.create<T>({
        collection: options.collection,
        data: {
          ...options.data,
          ...options.createData,
        },
        overrideAccess: true,
      })
    } else {
      await payload.update<T>({
        id: existing.docs[0].id,
        collection: options.collection,
        data: options.data as any,
        overrideAccess: true,
      })
    }
  }

  // import users
  for (const authUser of (await auth.listUsers()).users) {
    console.log(`importing user ${authUser.uid}`)
    const dbUser = (await db.collection('users').doc(authUser.uid).get()).data()
    let imageID = undefined
    if (dbUser.profileImageRef) {
      imageID = await importImage(dbUser.profileImageRef)
    }

    let bio = undefined
    try {
      let html = dbUser.bio ? draftToHtml(JSON.parse(dbUser.bio)) : undefined
      html = html?.replaceAll('\n', '')?.replaceAll('<p></p>', '')
      console.log(html)
      bio = htmlToSlate(html)
      bio = bio?.filter(block => block.text !== '\n' && block.text !== '')
      if (bio?.length === 0) bio = undefined
      console.log(bio)
    } catch (e) {
      console.warn(`Failed to convert bio for ${dbUser.name}`, e)
    }

    await createIfNotExist<User>({
      collection: 'users',
      data: {
        name: dbUser.name,
        email: authUser.email,
        admin: dbUser.admin,
        linkedIn: dbUser.links.linkedIn,
        profilePhoto: imageID,
        bio,
      },
      createData: {
        password: generate({
          length: 20,
          numbers: true,
        }),
      },
      id: 'email',
    })
  }

  // import member groups from teams
  {
    const memberGroups = []
    for (const teamRef of await db.collection('teams').listDocuments()) {
      const teamDoc = await teamRef.get()
      const dbTeam = teamDoc.data()
      console.log(`importing ${dbTeam.name}`)

      let members = []
      for (const [fbUserId, {title, order, allowEdit}] of Object.entries(dbTeam.members) as [string, any]) {
        const fbUser = await auth.getUser(fbUserId)
        const {docs: [{id: userId}]} = await payload.find<User>({
          collection: 'users',
          where: {
            email: {
              equals: fbUser.email,
            },
          },
        })

        members.push({
          title,
          member: userId,
          order,
        })
      }
      members.sort((a, b) => a.order - b.order)

      if (members.length === 0) {
        console.warn(`${dbTeam.name} has 0 member`)
      } else {
        memberGroups.push({
          name: dbTeam.name,
          desc: dbTeam.shortDescription ?? undefined,
          members,
        })
      }
    }

    await payload.updateGlobal({
      slug: 'member_groups',
      data: {
        groups: memberGroups,
      },
      overrideAccess: true,
    })
  }

  // import sponsors
  {
    const sponsorsDoc = await db.collection('sponsors').doc('sponsors').get()
    const oldSponsorGroups = sponsorsDoc.data()['sponsorGroups']

    const sponsorGroups = []
    for (const oldSponsorTier of oldSponsorGroups) {
      const sponsors = []
      for (const oldSponsor of oldSponsorTier.sponsors) {
        const imageID = await importImage(oldSponsor.logoRef)
        sponsors.push({
          url: oldSponsor.url,
          logo: imageID,
          order: oldSponsor.order,
        })
      }
      sponsors.sort((a, b) => a.order - b.order)

      sponsorGroups.push({
        name: oldSponsorTier.name,
        logoHeight: oldSponsorTier.logoHeight,
        sponsors,
        order: oldSponsorTier.order,
      })
    }
    sponsorGroups.sort((a, b) => a.order - b.order)

    await payload.updateGlobal<Sponsors>({
      slug: 'sponsors',
      data: {
        tiers: sponsorGroups,
      },
      overrideAccess: true,
    })
  }

  await payload.updateGlobal<Overview>({
    slug: 'overview',
    data: {
      launches: 14,
      successes: 14,
      rocketModels: 4,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal<Recruitment>({
    slug: 'recruitment',
    data: {
      positions: [],
    },
    overrideAccess: true,
  })
}

const {window} = new JSDOM(``, {runScripts: 'outside-only'})
window.eval('TEXT_NODE = Node.TEXT_NODE')
window.eval('ELEMENT_NODE = Node.ELEMENT_NODE')

const htmlToSlate = (el, markAttributes = {}) => {
  if (typeof el === 'string') {
    el = new JSDOM(el).window.document.body
  } else if (typeof el === 'undefined') {
    return null
  }

  if (el.nodeType === window.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent)
  } else if (el.nodeType !== window.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes = {...markAttributes}

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'strong':
      // @ts-ignore
      nodeAttributes.bold = true
  }

  const children = Array.from(el.childNodes)
    .map(node => htmlToSlate(node, nodeAttributes))
    .flat()

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', {type: 'quote'}, children)
    case 'P':
      return jsx('element', {type: 'paragraph'}, children)
    case 'A':
      return jsx(
        'element',
        {type: 'link', url: el.getAttribute('href')},
        children,
      )
    default:
      return children
  }
}