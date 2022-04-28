export class WereWolfGame {
    // TEMPLATE {uuid: "someCharacterCombination",
    // name: "MyName",
    // role: {name: "Warden", order: 0, friendly: true}
    // roleAfterTheRound: {name: "Werewolf", order: 2, friendly: false}
    // vote: "otherPlayersUuid",
    // protectedByWarden: false,
    // actionPerfomed: true
    // uncoveredMiddleCards: [1],
    // uncoveredPlayerRoles: ["uuidOfUnconveredRoles"]}
    playerList = [];
    roles;
    middleRoles = [];
    currentRoleOrder = null;
    waitTime = 10000;

    addPlayer = (playerInfo) => this.playerList.push(playerInfo)
    deletePlayer = (uuid) => this.playerList.splice(this.playerList.indexOf(this.getPlayerWithUUID(uuid)), 1)

    getPlayerWithUUID(uuid, playerList = this.playerList) {
        return playerList.find(player => player.uuid === uuid)
    }

    setRoles = (roles) => this.roles = roles

    shuffleRoles() {
        let unusedRoles = [...this.roles]
        for (let chosenPlayer of this.playerList) {
            const chosenRoleIndex = Math.floor(Math.random() * unusedRoles.length)
            const chosenRole = unusedRoles[chosenRoleIndex]

            chosenPlayer.role = chosenRole

            unusedRoles.splice(unusedRoles.indexOf(chosenRole), 1)
        }

        this.middleRoles = unusedRoles;
    }

    startGame() {
        this.resetGame()
        this.shuffleRoles()
    }

    resetGame() {
        // Clear player info
        this.playerList.forEach(player => {
            // Reset the roles
            delete player.role

            // Reset the given votes
            delete player.vote

            // Reset the warden protection
            player.protectedByWarden = false

            // Reset uncovered middle cards
            delete player.uncoveredMiddleCards

            // Reset uncoveredPlayerRoles
            delete player.uncoveredPlayerRoles

            // Reset roleAfterTheRound
            delete player.roleAfterTheRound

            // Reset actionPerfomed
            player.actionPerfomed = false
        })

        this.currentRoleOrder = null;
    }

    nextPlayers() {
        if (this.currentRoleOrder === null) this.currentRoleOrder = -1

        const mappedPlayers = this.playerList
            .map(player => ({ uuid: player.uuid, order: typeof player.role.order === "number" ? player.role.order : 99 }))

        this.currentRoleOrder = mappedPlayers
            .filter(player => player.order > this.currentRoleOrder)
            .sort((a, b) => a.order - b.order)
        [0]?.order

        if (this.currentRoleOrder === undefined) {
            this.currentRoleOrder = null
            return null
        }

        return mappedPlayers
            .filter(player => player.order === this.currentRoleOrder)
            .map(player => player.uuid)
    }

    vote(uuid, voteFor) {
        console.log("VOTE", uuid, voteFor, this.playerList)
        this.getPlayerWithUUID(uuid).vote = voteFor
    }

    allPlayersVoted() {
        return this.playerList.every(({ vote }) => Boolean(vote))
    }

    getWinner() {
        let votesAgainstUUID = {}
        this.playerList.forEach(({ vote }) => {
            if (!votesAgainstUUID[vote]) votesAgainstUUID[vote] = 1
            else votesAgainstUUID[vote]++
        })
        let outvotedPlayer;
        Object.entries(votesAgainstUUID).forEach(([uuid, numberOfVotes]) => {
            if (!outvotedPlayer) outvotedPlayer = { uuid, numberOfVotes }
            else if (outvotedPlayer.numberOfVotes < numberOfVotes) outvotedPlayer = { uuid, numberOfVotes }
        })

        const outvotedPlayerInfo = this.getPlayerWithUUID(outvotedPlayer.uuid)

        // If the outvoted player is the Prince, the werewolves win
        if (outvotedPlayerInfo.roleAfterTheRound?.name ? outvotedPlayerInfo.roleAfterTheRound?.name === "Prince" : outvotedPlayerInfo.role.name === "Prince") return this.atLeastOneWerewolfExists()

        // Checks for bodyguard vote
        const bodyguardPlayer = this.playerList.find(player => (player.roleAfterTheRound?.name ? player.roleAfterTheRound?.name === "Bodyguard" : player.role.name === "Bodyguard"))
        if (bodyguardPlayer && bodyguardPlayer.vote === outvotedPlayer.uuid) return this.atLeastOneWerewolfExists()

        const outvotedPlayerRole = outvotedPlayerInfo.roleAfterTheRound || outvotedPlayerInfo.role
        return !outvotedPlayerRole.friendly;
    }

    atLeastOneWerewolfExists() {
        return this.playerList.some(player => !player.role.friendly).length > 0
    }

    getPublicInfo() {
        let result = { roles: this.roles, playerList: [], numberofMiddleRoles: this.middleRoles.length }
        let players = [...this.playerList]
        players.forEach(player => {
            let { uuid, name, vote, protectedByWarden } = player
            result.playerList.push({ uuid, name, vote, protectedByWarden })
        })
        return result
    }

    getPrivateInfo(uuid_given) {
        let result = this.getPublicInfo()

        // Add visible player info
        this.playerList.forEach(player => {
            let { uuid } = player
            if (uuid === uuid_given) {
                result.playerList[result.playerList.indexOf(result.playerList.find(p => p.uuid === uuid))] = player
            } else if (
                (!this.playerList.find(p => p.uuid === uuid_given).role?.friendly
                    && this.playerList.find(p => p.uuid === uuid_given).role?.name !== "Sleeping wolf"
                    && !player.role?.friendly)
                || this.getPlayerWithUUID(uuid_given).uncoveredPlayerRoles?.includes(uuid)) {
                this.getPlayerWithUUID(uuid, result.playerList).role = this.getPlayerWithUUID(uuid).role
            }

        })

        // Add uncovered middle roles
        result.middleRoles = []
        if (this.getPlayerWithUUID(uuid_given).uncoveredMiddleCards) {
            this.getPlayerWithUUID(uuid_given).uncoveredMiddleCards.forEach(index => {
                result.middleRoles.push(this.middleRoles[index])
            })
        }

        return result
    }

    wardenMove(uuid, selectedPlayerUUID) {
        if (this.getPlayerWithUUID(uuid).role.name === "Warden") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true
            this.getPlayerWithUUID(selectedPlayerUUID).protectedByWarden = true
        }
    }

    uncoverMiddleRole(uuid, index) {
        if (["Werewolf", "Alpha wolf", "Seeing wolf", "Young seer", "Witch"].includes(this.getPlayerWithUUID(uuid).role.name)) {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            if (!this.getPlayerWithUUID(uuid).uncoveredMiddleCards) this.getPlayerWithUUID(uuid).uncoveredMiddleCards = []
            this.getPlayerWithUUID(uuid).uncoveredMiddleCards.push(index)
            return this.middleRoles[index]
        }
    }

    alphaWolfMove(uuid, selectedPlayerUUID) {
        if (this.getPlayerWithUUID(uuid).role.name === "Alpha wolf") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            this.getPlayerWithUUID(selectedPlayerUUID).roleAfterTheRound = { order: 2, name: "Werewolf", friendly: false }
        }
    }

    seeingWolfMove(uuid, selectedPlayerUUID) {
        if (this.getPlayerWithUUID(uuid).role.name === "Seeing wolf") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            if (!this.getPlayerWithUUID(selectedPlayerUUID).protectedByWarden) {
                if (!this.getPlayerWithUUID(uuid).uncoveredPlayerRoles) this.getPlayerWithUUID(uuid).uncoveredPlayerRoles = []
                this.getPlayerWithUUID(uuid).uncoveredPlayerRoles.push(selectedPlayerUUID)
                return this.getPlayerWithUUID(selectedPlayerUUID).role
            }
        }
    }

    ghostBusterMove(uuid, selectedPlayerUUID) {
        if (this.getPlayerWithUUID(uuid).role.name === "Ghost buster") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            if (!this.getPlayerWithUUID(selectedPlayerUUID).protectedByWarden) {
                if (!this.getPlayerWithUUID(uuid).uncoveredPlayerRoles) this.getPlayerWithUUID(uuid).uncoveredPlayerRoles = []
                if (!this.getPlayerWithUUID(selectedPlayerUUID).role.friendly) {
                    this.getPlayerWithUUID(uuid).roleAfterTheRound = this.getPlayerWithUUID(selectedPlayerUUID).role
                } else {
                    this.getPlayerWithUUID(uuid).uncoveredPlayerRoles.push(selectedPlayerUUID)
                }
                return this.getPlayerWithUUID(selectedPlayerUUID).role
            }
        }
    }

    witchMove(uuid, selectedIndex, selectedPlayerUUID) {
        if (this.getPlayerWithUUID(uuid).role.name === "Witch") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            this.getPlayerWithUUID(selectedPlayerUUID).roleAfterTheRound = this.middleRoles[selectedIndex]
            // this.middleRoles does not have be altered because no player after the witch can lookup a middle card
        }
    }

    idiotMove(uuid, left) {
        if (this.getPlayerWithUUID(uuid).role.name === "Idiot") {
            this.getPlayerWithUUID(uuid).actionPerfomed = true

            let playerListReplacement = []
            const playerNum = this.playerList.length
            console.log(this.playerList.map(player => ({ name: player.name, role: player.role.name, roleAfterTheRound: player.roleAfterTheRound?.name })))

            const indexOffset = left ? 1 : -1
            this.playerList.forEach(player => {
                // Filter out the protected player (by warden)
                if (!player.protectedByWarden) {
                    // Copy the player info
                    let newPlayerInfo = Object.assign({}, player)

                    // Search the player with the replacement role
                    let replacementPlayer = this.playerList[(this.playerList.indexOf(player) + indexOffset + playerNum) % playerNum]

                    // Skip protected player (by warden)
                    if (replacementPlayer.protectedByWarden) replacementPlayer = this.playerList[(this.playerList.indexOf(player) + indexOffset * 2 + playerNum) % playerNum]

                    // Set the roleAfterTheRound to the role of the replacement player
                    newPlayerInfo.roleAfterTheRound = this.getRoleAfterTheRound(replacementPlayer.uuid)

                    // Push the newPlayerInfo to the playerListReplacement
                    playerListReplacement.push(newPlayerInfo)

                    console.log(`IDIOT turned ${player.name} (${player.role.name}) into ${newPlayerInfo.roleAfterTheRound.name} (${replacementPlayer.name})`)
                }
            })

            this.playerList = playerListReplacement

            console.log("playerList after Idiot move:", this.playerList.map(player => ({ name: player.name, role: player.role.name, roleAfterTheRound: player.roleAfterTheRound?.name })))
        }
    }

    getPlayersWithActions(uuid) {
        console.log("getPlayerWithActions called", uuid)
        if (this.getPlayerWithUUID(uuid).role.name === "Fortune teller") {
            return this.playerList
                .filter(player => player.actionPerfomed)
                .map(player => ({ uuid: player.uuid, name: player.name }))
        }
    }

    scoutMove(uuid, selectedIndex) {
        if (this.getPlayerWithUUID(uuid).role.name === "Scout") {
            this.playerList.forEach(player => {
                if (!player.uncoveredMiddleCards) player.uncoveredMiddleCards = []
                player.uncoveredMiddleCards.push(selectedIndex)
            })
        }
    }

    getRoleAfterTheRound(uuid) {
        // console.log("UUID", uuid)
        const playerInfo = this.getPlayerWithUUID(uuid)
        // console.log("playerInfo after the round", playerInfo)
        return playerInfo.roleAfterTheRound || playerInfo.role
    }
}