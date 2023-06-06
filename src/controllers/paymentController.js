const midtransClient = require('midtrans-client');
const User = require('../models/User');

// Initialize the Midtrans client
const client = new midtransClient.Snap({
    isProduction: true,
    serverKey: 'Mid-server-aA8TKwQsCHObr0kYP8yBZJ0S',
    clientKey: 'Mid-client-cZ27QYXLEKK7gd1r',
  });

const callback = (req, res) => {
    const requestBody = req.body;
    const transactionStatus = requestBody.transaction_status;
    const orderId = requestBody.order_id;
  
    // Update the database based on the transaction status
    updateDatabase(orderId, transactionStatus)
      .then(() => {
        // Send a response to Midtrans indicating that the callback has been processed successfully
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error updating database:', error);
        // Send an error response to Midtrans
        res.sendStatus(500);
      });
};

// Update the database based on the transaction status
const updateDatabase = (orderId, transactionStatus) => {
  return new Promise((resolve, reject) => {
    // Perform the database update here
    // Update a document matching a specific condition
    const filter = { idAccount: orderId }; // Replace with your filter condition
    const update = { status: transactionStatus }; // Replace with the fields you want to update

    User.updateOne(filter, update)
      .then((result) => {
        console.log('Document updated successfully');
        console.log(result);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });

    // Simulating a delay for the database update
    setTimeout(() => {
      if (Math.random() < 0.8) {
        // Database update is successful
        resolve();
      } else {
        // Database update failed
        reject(new Error('Failed to update database.'));
      }
    }, 1000);
  });
};

// Handle the payment request
const pay = (req, res) => {

  const { email, order_id } = req.body;

  const transactionDetails = {
    order_id: order_id, // Ganti dengan ID pesanan Anda
    gross_amount: 100000 ,// Ganti dengan jumlah pembayaran yang ingin Anda lakukan,
  };

  const enabledPayments = ['gopay', 'bank_transfer'];

  client.createTransaction({
    transaction_details: transactionDetails,
    enabled_payments: enabledPayments
  })
  .then((transaction)=>{
      // transaction token
      let transactionToken = transaction.token;
      console.log('transactionToken:',transactionToken);
      
      // Update database user
      const filter = { email: email }; // Replace with your filter condition
      const update = { idAccount: order_id, status: 'pending' }; // Replace with the fields you want to update
      
      User.updateOne(filter, update)
      .then((result) => {
        console.log('Document updated successfully');
        console.log(result);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
      
      // transaction redirect url
      let transactionRedirectUrl = transaction.redirect_url;
      res.redirect(transaction.redirect_url)
      console.log('transactionRedirectUrl:',transactionRedirectUrl);
  })
  .catch((e)=>{
      console.log('Error occured:',e.message);
  });
};

//   client.charge(parameter)
//     .then((chargeResponse)=>{
//         console.log('chargeResponse:',JSON.stringify(chargeResponse));
//     })
//     .catch((e)=>{
//       console.log('Error occured:',e.message);
//   });;  



  module.exports = {
    callback,
    pay
  }