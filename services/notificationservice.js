import { bankevents } from '../utils/eventemiiter.js'

bankevents.on('transactionSuccess', (data) => {
    console.log(`[AUDIT] : Transfer of ${data.amount} complete. TransactionID:: ${data.txnID}`);
})