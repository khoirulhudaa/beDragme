const midtransClient = require('midtrans-client');
const User = require('../models/User');
const moment = require('moment');


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
    const paymentType = requestBody.payment_type;
  
    // Update the database based on the transaction status
    if(transactionStatus === 'settlement') {
      const date = moment().toDate();

      updateDatabase(orderId, transactionStatus, paymentType, date)
        .then(() => {
          const data = {
            order_id: orderID,
            transactionStatus,
            paymentType,
            date
          }
          // Send a response to Midtrans indicating that the callback has been processed successfully
          return res.json({ message: data, status: 201 })
        })
        .catch((error) => {
          console.log('Error updating database:', error);
          // Send an error response to Midtrans
          return res.json({ messae:error, status: 500 });
        });
      }else {
        updateDatabase(orderId, transactionStatus)
          .then(() => {
            const data = {
              order_id: orderID,
              transactionStatus
            }
            // Send a response to Midtrans indicating that the callback has been processed successfully
            return res.json({ message: data, status: 201 })
          })
          .catch((error) => {
            console.log('Error updating database:', error);
            // Send an error response to Midtrans
            return res.json({ messae:error, status: 500 });
          });
    }
};

// Update the database based on the transaction status
const updateDatabase = (orderId, transactionStatus, paymentType, date) => {
  return new Promise((resolve, reject) => {
    // Perform the database update here
    // Update a document matching a specific condition
    const filter = { idAccount: orderId }; // Replace with your filter condition
    const update = { status: transactionStatus, date, paymentType }; // Replace with the fields you want to update

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

  const { email, order_id, gross_amount } = req.body;

  const transactionDetails = {
    order_id: order_id, // Ganti dengan ID pesanan Anda
    gross_amount: gross_amount ,// Ganti dengan jumlah pembayaran yang ingin Anda lakukan,
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
      const transactionRedirectUrl = transaction.redirect_url;
      return res.json({ message: transactionRedirectUrl, status: 201 })
  })
  .catch((e)=>{
      return res.json({ message: e.message, status: 403 })
  });
};

const cancelOrder = async (req, res) => {
  try {
    const order_id = req.body.order_id; // Ganti dengan orderId yang ingin Anda batalkan
    const serverKey = 'Mid-server-aA8TKwQsCHObr0kYP8yBZJ0S'; // Ganti dengan Server Key Midtrans Anda
    const endpoint = `https://api.midtrans.com/v2/${order_id}/cancel`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
      },
    });

    const data = await response.json()
    // Update the database based on the transaction status
    // Update database user
    const filter = { email: req.body.email }; // Replace with your filter condition
    const update = { status: 'cancel' }; // Replace with the fields you want to update
    
    User.updateOne(filter, update)
    .then((result) => {
      console.log('Document updated successfully');
      return res.json({message: data, status: 200});
    })
    .catch((error) => {
      console.error('Error updating document:', error);
    });

    return res.json({message: data, status: 200});

  } catch (error) {
    return res.json({ message: error, status: 500 });
  }
}


  module.exports = {
    callback,
    pay,
    cancelOrder
  }