import { Scalekit } from "@scalekit-sdk/node";

let _scalekit = null;

export const getScalekit = () => {
    if (!_scalekit) {
        _scalekit = new Scalekit(
            process.env.SCALEKIT_ENVIRONMENT_URL,
            process.env.SCALEKIT_CLIENT_ID,
            process.env.SCALEKIT_CLIENT_SECRET,
        );
    }
    return _scalekit;
}

export const scalekit = new Proxy({}, {
    get: (_, prop) => getScalekit()[prop]
});