import payload from 'payload'
import {Media, Overview, Recruitment, Sponsors, User} from './payload-types'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import {getStorage} from 'firebase-admin/storage'
import {generate} from 'generate-password'
import path from 'path'
import {TypeWithID} from 'payload/dist/collections/config/types'

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
        data: options.data,
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

    await createIfNotExist<User>({
      collection: 'users',
      data: {
        name: dbUser.name,
        email: authUser.email,
        admin: dbUser.admin,
        linkedIn: dbUser.links.linkedIn,
        password: generate({
          length: 20,
          numbers: true,
        }),
        profilePhoto: imageID,
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