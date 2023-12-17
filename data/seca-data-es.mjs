import fetch from 'node-fetch';

const ES_HOST = 'http://localhost:9200/';

async function getData(url = '') {
    const response = await fetch(url);
    return response.json();
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function putData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteData(url = '') {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    return response.json();
}

export default function () {
    return {
        insertUser,
        getUserId,
        getAllGroups,
        getGroup,
        createGroup,
        editGroup,
        deleteGroup,
        // addEventToGroup,
        // deleteEventFromGroup
    }

    async function insertUser(username) {
        const response = await postData(`${ES_HOST}users_index/_doc/`, { name: username });
        if(response.error) {
          throw new Error(response.error.reason);
        }
        return response._id;
    }

    async function getUserId(userId) {
        const response = await getData(`${ES_HOST}users_index/_doc/${userId}`);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response._id;
    }

    async function getAllGroups(userId) {
        let response = await getData(`${ES_HOST}groups/_search?q=userId:${userId}`);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response.hits.hits;
    }

    async function getGroup(groupId) {
        const response = await getData(`${ES_HOST}groups/group/${groupId}`);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response._source;
    }

    async function createGroup(group) {
        const response = await postData(`${ES_HOST}groups/group`, group);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response._id;
    }

    async function editGroup(groupId, group) {
        const response = await putData(`${ES_HOST}groups/group/${groupId}`, group);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response._id;
    }

    async function deleteGroup(groupId) {
        const response = await deleteData(`${ES_HOST}groups/group/${groupId}`);
        if (response.error) {
            throw new Error(response.error.reason);
        }
        return response.result; // indicates whether the deletion was successful
    }

    // ... addEventToGroup and deleteEventFromGroup to be implemented based on your index structure
}
