API = {};

// To be used by every res.json() answer to user to keep consistence
API.createAPIResponse = (error, payload) => {
    return {
        success: !error,
        error: error,
        payload: payload
    }
};

module.exports = API;