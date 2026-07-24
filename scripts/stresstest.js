// stressTest.js                    
const CONCURRENT_REQUESTS = 50;
const API_URL = "http://localhost:7001/api/transfer";

const SENDER_ID = "YOUR_SENDER_ACCOUNT_ID"; 
const RECEIVER_ID = "YOUR_RECEIVER_ACCOUNT_ID";

async function runStressTest() {
    console.log(`🚀 Launching ${CONCURRENT_REQUESTS} simultaneous transfer requests...`);

    const requests = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {

        const idempotencyKey = `test-key-${Date.now()}-${i}`;

        const request = fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "idempotency-key": idempotencyKey
            },
            body: JSON.stringify({
                senderaccountid: SENDER_ID,
                receiveraccountid: RECEIVER_ID,
                amount: 10, 
                description: `Stress Test Transfer ${i}`
            })
        });

        requests.push(request);
    }

    try {
        const responses = await Promise.all(requests);
        
        let successCount = 0;
        let failCount = 0;

        for (const res of responses) {
            if (res.status === 200) successCount++;
            else failCount++;
        }

        console.log(`\nTest Results:`);
        console.log(` Successful Transfers: ${successCount}`);
        console.log(` Failed/Blocked Transfers (Expected due to locking/balance): ${failCount}`);
        
    } catch (error) {
        console.error("Test failed to execute:", error);
    }
}

runStressTest();