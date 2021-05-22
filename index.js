const db = require('./db')
const config = require('./config')
let messages = []
let recipients = config.recipients
let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

let noOfMessagesSentAtInterval = 3
let totalMessagesSent = 0
let totalMessages = 50




const generateMessages = async (count = 1) => {
    const client = db.pool.connect();
    const message = 'Hello world!!'
    try {
        let batchInsert = `INSERT INTO public.messages
        (message, sent , created_date, updated_date)
        VALUES `;
        for (let i = 0; i < count; i++) {
            batchInsert += `('${message}', false ,now(), now()) `;
            if (count > 1 && i < (count - 1))
                batchInsert += ','
        }
        const batchInsertResult = await (await client).query(batchInsert + ' returning id ')
        console.log(batchInsertResult.rows)
    } catch (error) {
        console.log('generateMessages Error : ', error)
    }
    finally {
        await (await client).release()
    }

}



const selectMessages = async (count) => {
    const client = db.pool.connect();
    try {
        let query = `SELECT * from public.messages WHERE sent is false order by id `;
        if (count)
            query += `limit ${count}`
        const result = await (await client).query(query)
        return Promise.resolve(result.rows)
    } catch (error) {
        console.log('selectMessages Error : ', error)
        return Promise.reject(error)
    }
    finally {
        await (await client).release()
    }
}


const clearMessages = async () => {
    const client = db.pool.connect();
    try {
        let query = `TRUNCATE TABLE public.messages RESTART IDENTITY RESTRICT;`;

        const result = await (await client).query(query)
        return Promise.resolve(true)
    } catch (error) {
        console.log('clearMessages Error : ', error)
        return Promise.reject(error)
    }
    finally {
        await (await client).release()
    }
}

const sendMessage = async (messageId, recipientName) => {
    const client = db.pool.connect();
    try {
        let query = `UPDATE public.messages
        SET sent=true, updated_date=now()
        WHERE id=$1`;

        const result = await (await client).query(query, [messageId])
        let recipient = recipients.find(recipient => recipient.name === recipientName)
        totalMessagesSent += 1
        recipient.noOfMessagesAccepted += 1
        recipient.currentPercentage = (recipient.noOfMessagesAccepted * 100) / totalMessagesSent;
        console.log('Recipient : ', recipientName)
        console.log('Messages sent : ', totalMessagesSent)
        console.log('Recipients : ', recipients)

        return Promise.resolve(true)
    } catch (error) {
        console.log('clearMessages Error : ', error)
        return Promise.reject(error)
    }
    finally {
        await (await client).release()
    }
}

const findRecipient = () => {
    // Apply the findRecipient Logic here
    recipients.sort((recipient1, recipient2) => {       
        let totalMessagesTobeRecieved1 = ((recipient1.actualPercentage * totalMessages)/100) 
        let ratio1 = (recipient1.noOfMessagesAccepted / totalMessagesTobeRecieved1)

        let totalMessagesTobeRecieved2 = ((recipient2.actualPercentage * totalMessages)/100) 
        let ratio2 = (recipient2.noOfMessagesAccepted / totalMessagesTobeRecieved2)
        return ratio1 - ratio2
    })

    let chosenRecipient = { ...recipients[0] }

    return chosenRecipient;
}


/***
 * 
 * Start the message processing
 * 
 */
let interval = setInterval (()=>{
    selectMessages(noOfMessagesSentAtInterval)
    .then((rows) => {
        messages = rows;
        if(messages.rows == 0){
            console.log("No messages to send")
            return clearInterval(interval)
        }
        for (let i = 0; i < messages.length; i++) {
            let recipient = findRecipient()
            sendMessage(messages[i].id, recipient.name)
        }

    })
    .catch(console.log)
}, 5000) 

/**
 * Functions for generating and clear messages in the db
 * 
 */


// Clear Messages
// clearMessages()
//     .then((success) => {
//         console.log('Messages cleared : ', success)
//     })
//     .catch(console.log)

// Generate Messages
// generateMessages(totalMessages)
//     .then((rows) => {
//         selectMessages()
//             .then((messages) => {
//                 Messages = messages
//                 console.log(Messages)
//             })
//             .catch(console.log)
//     })
//     .catch(console.log)