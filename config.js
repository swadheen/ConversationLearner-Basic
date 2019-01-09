const dotenv = require("dotenv");
const convict = require("convict");
const result = dotenv.config();
if (result.error) {
    console.warn(`Warning loading .env configuration: "${result.error}"`);
}
exports.config = convict({
    LUIS_AUTHORING_KEY: {
        format: String,
        default: undefined,
        env: 'LUIS_AUTHORING_KEY'
    },
    LUIS_SUBSCRIPTION_KEY: {
        format: String,
        default: undefined,
        env: 'LUIS_SUBSCRIPTION_KEY'
    },
    CONVERSATION_LEARNER_SERVICE_URI: {
        format: 'url',
        default: "https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/",
        env: 'CONVERSATION_LEARNER_SERVICE_URI'
    },
    botPort: {
        // Must be any type because when deployed port will be named pipe path instead of number
        // E.g. \\.\pipe\959e6a63-76dd-4f11-be42-d29ec0fc585d
        format: '*',
        default: 3978,
        env: 'PORT'
    },
    modelId: {
        format: String,
        default: undefined,
        env: 'CONVERSATION_LEARNER_MODEL_ID'
    },
    bfAppId: {
        format: String,
        default: undefined,
        env: 'MICROSOFTAPPID'
    },
    bfAppPassword: {
        format: String,
        default: undefined,
        env: 'MICROSOFTAPPPASSWORD'
    }
});
exports.config.validate({ allowed: 'strict' });
const clOptions = exports.config.getProperties();
exports.default = clOptions;