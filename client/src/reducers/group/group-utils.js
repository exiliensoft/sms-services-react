
export const removeMember = (group, { email, group_id }) => {
    let newData = group.data;
    newData = newData.map(group => {
        if (group.id === group_id) {
            let members = group.members
            delete members[email]
            group.members = members;
            return group;
        }
        return group;
    })

    return {
        ...group,
        data: newData
    }
}

export const addMember = (group, { email, group_id }) => {
    let newEmialObject = {};
    newEmialObject[email] = "pending"
    let newData = group.data;
    newData = newData.map(group => {
        if (group.id === group_id) {
            let members = { ...group.members, ...newEmialObject }
            group.members = members;
            return group;
        }
        return group;
    })

    return {
        ...group,
        data: newData
    }
}