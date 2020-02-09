const dynamoose = require('dynamoose');
const dynalite = require('dynalite');

const startUp = async () => {

    const dynaliteServer = dynalite();
    await dynaliteServer.listen(8000, function (err) {
        if (err) throw err;
        console.log('DynamoDB connected');
    });
    return dynaliteServer;
    // console.log('DynamoDB connected:');
};

const createDynamooseInstance = () => {
    dynamoose.AWS.config.update({
        accessKeyId:'shared',
        secretAccessKey:'shared',
        region:'local'
    });
    dynamoose.local();
};

const connectDB = async () => {
    await startUp();
    createDynamooseInstance();
};

module.exports = connectDB;
