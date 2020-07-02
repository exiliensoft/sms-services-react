
export const removeMember = (sms_group, { email, group_id }) => {
    let newData = sms_group.data;
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
        ...sms_group,
        data: newData
    }
}

export const addMember = (sms_group, { email, group_id }) => {
    let newEmialObject = {};
    newEmialObject[email] = "pending"
    let newData = sms_group.data;
    newData = newData.map(group => {
        if (group.id === group_id) {
            let members = { ...group.members, ...newEmialObject }
            group.members = members;
            return group;
        }
        return group;
    })

    return {
        ...sms_group,
        data: newData
    }
}