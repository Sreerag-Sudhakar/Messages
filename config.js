module.exports = {
    db: {
        host: 'localhost',
        user: 'postgres',
        password: 'docker',
        database: 'Messages',
        port: '5433',
        ssl: false,
        schema: 'public'
    },
    recipients: [
        {
            name: 'A',
            noOfMessagesAccepted: 0,
            actualPercentage: 30,
            currentPercentage: 0
        },
        {
            name: 'B',
            noOfMessagesAccepted: 0,
            actualPercentage: 15,
            currentPercentage: 0
        },
        {
            name: 'C',
            noOfMessagesAccepted: 0,
            actualPercentage: 5,
            currentPercentage: 0
        },
        {
            name: 'D',
            noOfMessagesAccepted: 0,
            actualPercentage: 40,
            currentPercentage: 0
        },
        {
            name: 'E',
            noOfMessagesAccepted: 0,
            actualPercentage: 10,
            currentPercentage: 0
        }
    ]
}