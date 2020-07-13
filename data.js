const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

module.exports = {
    ROLE: ROLE,
    users: [
        { id: 1, name: 'Musunga', role: ROLE.ADMIN },
        { id: 2, name: 'Tiisa', role: ROLE.BASIC },
        { id: 3, name: 'Nyankhundi', role: ROLE.BASIC }
    ],
    projects: [
        { id: 1, name: "Musunga's Project", userId: 1 },
        { id: 2, name: "Tiisa's Project", userId: 2 },
        { id: 3, name: "Nyankhundi's Project", userId: 3 }
    ]
}