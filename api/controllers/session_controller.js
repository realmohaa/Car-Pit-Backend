const sessions = {};

const createSession = (username, isAdmin, accountType) => {
    const sessionId = String(Object.keys(sessions).length + 1);
    const session = { sessionId, username, valid: true, accountType, isAdmin };
    sessions[sessionId] = session;
    return session;
}

const getSession = (sessionId) => {
    const session = sessions[sessionId];
    return session && session.isValid ? session : null
}

const invalidateSession = (sessionId) => {
    const session = session[sessionId];

    if (session) {
        sessions[sessionId].isValid = false;
    }

    return sessions[sessionId];
}

module.exports = {createSession, getSession, invalidateSession}