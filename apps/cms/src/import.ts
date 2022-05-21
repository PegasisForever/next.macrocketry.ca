import payload from 'payload'
import {Media, Team, User} from './payload-types'
import {initializeApp} from 'firebase-admin/app'
import {credential} from 'firebase-admin'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import {getStorage} from 'firebase-admin/storage'
import {generate} from 'generate-password'
import path from 'path'
import {TypeWithID} from 'payload/dist/collections/config/types'
import applicationDefault = credential.applicationDefault

export async function importFromFirestore() {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: 'macrocketry.appspot.com',
  })
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
        linkedin: dbUser.links.linkedin,
        password: generate({
          length: 20,
          numbers: true,
        }),
        profilePhoto: imageID,
      },
      id: 'email',
    })
  }

  // import teams
  for (const teamRef of await db.collection('teams').listDocuments()) {
    const teamDoc = await teamRef.get()
    const dbTeam = teamDoc.data()
    console.log(`importing ${dbTeam.name}`)

    let imageID = undefined
    if (dbTeam.coverImage?.ref) {
      imageID = await importImage(dbTeam.coverImage?.ref)
    }

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
        user: userId,
        allowEdit,
        order,
        title,
      })
    }
    members.sort((a, b) => a.order - b.order)

    await createIfNotExist<Team>({
      collection: 'teams',
      data: {
        urlName: teamDoc.id,
        name: dbTeam.name,
        shortDescription: dbTeam.shortDescription ?? '',
        coverImage: imageID,
        members,
        projects: dbTeam.currentProjects.map(p => ({
          name: p.name,
          start: new Date(p.startTimestamp).toISOString(),
          end: new Date(p.endTimestamp).toISOString(),
        })),
      },
      id: 'name',
    })
  }

  // import team groups
  {
    const teamGroups = []

    for (const teamGroupRef of await db.collection('teamGroups').listDocuments()) {
      const teamGroupDoc = await teamGroupRef.get()
      const dbTeamGroup = teamGroupDoc.data()
      console.log(`importing ${dbTeamGroup.name} team group`)

      const teams = []
      for (const teamUrlName of Object.keys(dbTeamGroup.teams)) {
        const {docs: [{id: teamId}]} = await payload.find<Team>({
          collection: 'teams',
          where: {
            urlName: {
              equals: teamUrlName,
            },
          },
        })

        teams.push({
          team: teamId,
        })
      }

      teamGroups.push({
        name: dbTeamGroup.name,
        urlName: teamGroupDoc.id,
        order: dbTeamGroup.order,
        teams,
      })
    }

    teamGroups.sort((a, b) => a.order - b.order)

    await payload.updateGlobal({
      slug: 'team_groups',
      data: {
        groups: teamGroups,
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

    await payload.updateGlobal({
      slug: 'sponsors',
      data: {
        tiers: sponsorGroups,
      },
      overrideAccess: true,
    })
  }
}