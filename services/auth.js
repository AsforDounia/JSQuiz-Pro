const jwt = require('jsonwebtoken');

const blacklistedTokens = new Map();

function getTokenExpiryMs(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return null;
        return decoded.exp * 1000; // convert seconds to ms
    } catch (_) {
        return null;
    }
}

function blacklistToken(token) {
    const expiryMs = getTokenExpiryMs(token);
    const nowMs = Date.now();
    const ttlMs = expiryMs ? Math.max(expiryMs - nowMs, 0) : 3600000; // default 1h if missing
    const storeUntil = nowMs + ttlMs;
    blacklistedTokens.set(token, storeUntil);
}

function isTokenBlacklisted(token) {
    const until = blacklistedTokens.get(token);
    if (!until) return false;
    if (Date.now() > until) {
        blacklistedTokens.delete(token);
        return false;
    }
    return true;
}

// Periodic cleanup to avoid unbounded growth
setInterval(() => {
    const now = Date.now();
    for (const [token, until] of blacklistedTokens.entries()) {
        if (now > until) {
            blacklistedTokens.delete(token);
        }
    }
}, 10 * 60 * 1000).unref();

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
};


