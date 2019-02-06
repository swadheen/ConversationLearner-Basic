const { BotStateSet, BotFrameworkAdapter, MemoryStorage, ConversationState, UserState, AutoSaveStateMiddleware, MessageFactory, CardFactory } = require('botbuilder');
const express = require('express');
const path = require("path");
const { ConversationLearner, ClientMemoryManager, ReadOnlyClientMemoryManager, FileStorage, uiRouter } = require('@conversationlearner/sdk');
const config_1 = require("./config");
const dol_1 = require("./dol");

const { bfAppId, bfAppPassword, modelId, botPort } = config_1.default;

// Create server
let server = express();

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: bfAppId,
    appPassword: bfAppPassword
});

// Add state middleware
const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);
const saveStateMiddleware = new AutoSaveStateMiddleware(convoState, userState);
adapter.use(saveStateMiddleware);

const fileStorage = new FileStorage(path.join(__dirname, 'storage'));

const sdkRouter = ConversationLearner.Init(config_1.default, fileStorage);
const cl = new ConversationLearner(modelId);

//Entity Detection
cl.EntityDetectionCallback((text, memoryManager) => __awaiter(this, void 0, void 0, function* () {

}));

//Language Generation
cl.AddCallback({
    name: "DoNothing", logic: (memoryManager) => {
        //API Logic
        // Do Nothing

    }, render: (result, memoryManager) => {

    }
});



//=================================
// Handle Incoming Messages
//=================================
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        console.log(context.activity.type);
        const result = yield cl.recognize(context);
        if (result) {
            yield cl.SendResult(result);
        }
    }));
});

if (process.env.NODE_ENV === 'development') {
    server.use('/sdk', sdkRouter);
    server.use(dol_1.default(botPort));
    server.use(uiRouter);
}

server.listen(botPort, () => {
    console.log(`Server listening to port: ${botPort}`);
});