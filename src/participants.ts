import { db, eq, NBAPlayer, NBATeam, Participant } from 'astro:db'

interface ParticipantWithPlayers {
  name: string
  favoriteTeam?: string
  players: string[]
  draftOrder: number
}

// Hardcoded list of participants (for seeding participants and player selections)
const participants: ParticipantWithPlayers[] = [
  {
    name: 'Malatesta',
    draftOrder: 1,
    players: [
      'Shai Gilgeous-Alexander',
      'Tyrese Haliburton',
      'Pascal Siakam',
      'Myles Turner',
      'Cason Wallace',
      'Michael Beasley',
      'Desmond Bane',
      // TODO:
    ],
  },
  {
    name: 'Tomlinson',
    draftOrder: 2,
    players: [
      'Jayson Tatum',
      'Payton Pritchard',
      'Aaron Wiggins',
      'Rui Hachimura',
      'Al Horford',
      'Sam Hauser',
      'Jaxson Hayes',
      // TODO:
    ],
  },
  {
    name: 'Moore',
    draftOrder: 3,
    players: [
      'Donovan Mitchell',
      'Austin Reaves',
      'DeAndre Hunter',
      'Benedict Mathurin',
      'Josh Hart',
      'Obi Toppin',
      'Russell Westbrook',
      // TODO:
    ],
  },
  {
    name: 'Mikey',
    draftOrder: 4,
    players: [
      'Luka Doncic',
      'Chet Holmgren',
      'Jimmy Butler',
      'Isaiah Hartenstein',
      'Paolo Banchero',
      'Alex Caruso',
      'Trae Young',
      // TODO:
    ],
  },
  {
    name: 'Victors',
    draftOrder: 5,
    players: [
      'Jalen Williams',
      'Giannis Antetokounmpo',
      'James Harden',
      'Amen Thompson',
      'Julius Randle',
      'Jabari Smith Jr.',
      'Bobby Portis',
      // TODO:
    ],
  },
  {
    name: 'Robbie',
    draftOrder: 6,
    players: [
      'Lebron James',
      'Kawhi Leonard',
      'Norman Powell',
      'Ty Jerome',
      'Fred Vanvleet',
      'Dorian Finney-Smith',
      'Derrick Jones Jr.',
      // TODO:
    ],
  },
  {
    name: 'David',
    draftOrder: 7,
    players: [
      'Nikola Jokic',
      'Karl-Anthony Towns',
      'Jalen Green',
      'Christian Braun',
      'Aaron Gordon',
      'Rudy Gobert',
      'Donte DiVincenzo',
      'Jaden McDaniels',
    ],
  },
  {
    name: 'Nick',
    draftOrder: 8,
    players: [
      'Darius Garland',
      'Evan Mobley',
      'OG Anunoby',
      'Isaiah Joe',
      'Max Strus',
      'Damian Lillard',
      'Buddy Hield',
      'Dalton Knecht',
    ],
  },
  {
    name: 'Senac/Whitaker',
    draftOrder: 9,
    players: [
      'Jaylen Brown',
      'Jalen Brunson',
      'Jrue Holiday',
      'Jarrett Allen',
      'Jaren Jackson Jr.',
      'Bogdan Bogdanovic',
      'Tobias Harris',
      'Andrew Nembhard',
    ],
  },
  {
    name: 'Ethan',
    draftOrder: 10,
    players: [
      'Kristaps Porzingis',
      'Alperen Sengun',
      'Mikal Bridges',
      'Ivica Zubac',
      'Naz Reid',
      'Franz Wagner',
      'Brook Lopez',
      'Kevin Porter Jr.',
    ],
  },
  {
    name: 'Winston',
    draftOrder: 11,
    players: [
      'Derrick White',
      'Jamal Murray',
      'Michael Porter Jr.',
      'Ja Morant',
      'Kyle Kuzma',
      'Dillon Brooks',
      'Miles McBride',
      'Dyson Daniels',
    ],
  },
  {
    name: 'Daniel',
    draftOrder: 12,
    players: [
      'Anthony Edwards',
      'Stephen Curry',
      'Cade Cunningham',
      'Luguentz Dort',
      'Brandin Podziemski',
      'Aaron Nesmith',
      'Luke Kornet',
      'Draymond Green',
    ],
  },
]

// Function to get participants as per the db (dynamic)
export async function getParticipants(): Promise<ParticipantWithPlayers[]> {
  const rows = await db
    .select()
    .from(Participant)
    .innerJoin(NBAPlayer, eq(NBAPlayer.participantId, Participant.id))
    .leftJoin(NBATeam, eq(NBATeam.id, Participant.favoriteTeamId))

  // Create a map from participant id to participant (as we accumulate the players)
  const participantMap = rows.reduce<Record<number, ParticipantWithPlayers>>(
    (acc, row) => {
      const participant: ParticipantWithPlayers = acc[row.Participant.id] || {
        name: row.Participant.name,
        favoriteTeam: row.NBATeam?.shortName || undefined,
        draftOrder: row.Participant.draftOrder || 0,
        players: [],
      }

      participant.players.push(row.NBAPlayer.name)

      acc[row.Participant.id] = participant

      return acc
    },
    {},
  )

  // Sort each participant's players according to the hardcoded list above
  // This sort order reflects the order in which the players were drafted
  for (const { name, players } of Object.values(participantMap)) {
    players.sort(
      (a, b) =>
        participants.find((p) => p.name === name)?.players.indexOf(a)! -
        participants.find((p) => p.name === name)?.players.indexOf(b)!,
    )
  }

  // Turn the rows into a list of participants
  return Object.values(participantMap).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export default participants
