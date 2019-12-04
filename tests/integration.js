const test = require('ava');

const request = require('request-promise-native');


test.before(t => {
  t.context.rawPayment = { 
    "type":"Payment",
    "version":0,
    "organisation_id":"743d5b63-8e6f-432e-a8fa-c5d8d2ee5fcb",
    "attributes":{ 
       "amount":100.21,
       "beneficiary_party":{ 
          "account_name":"W Owens",
          "account_number":"31926819",
          "account_number_code":"BBAN",
          "account_type":0,
          "address":"1 The Beneficiary Localtown SE2",
          "bank_id":"403000",
          "bank_id_code":"GBDSC",
          "name":"Wilfred Jeremiah Owens"
       },
       "charges_information":{ 
          "bearer_code":"SHAR",
          "sender_charges":[ 
             { 
                "amount":5.00,
                "currency":"GBP"
             },
             { 
                "amount":10.00,
                "currency":"USD"
             }
          ],
          "receiver_charges_amount":1.00,
          "receiver_charges_currency":"USD"
       },
       "currency":"GBP",
       "debtor_party":{ 
          "account_name":"EJ Brown Black",
          "account_number":"GB29XABC10161234567801",
          "account_number_code":"IBAN",
          "address":"10 Debtor Crescent Sourcetown NE1",
          "bank_id":"203301",
          "bank_id_code":"GBDSC",
          "name":"Emelia Jane Brown"
       },
       "end_to_end_reference":"Wil piano Jan",
       "fx":{ 
          "contract_reference":"FX123",
          "exchange_rate":2.00000,
          "original_amount":200.42,
          "original_currency":"USD"
       },
       "numeric_reference":1002001,
       "payment_id":"123456789012345678",
       "payment_purpose":"Paying for goods/services",
       "payment_scheme":"FPS",
       "payment_type":"Credit",
       "processing_date":"2017-01-18",
       "reference":"Payment for Ems piano lessons",
       "scheme_payment_sub_type":"InternetBanking",
       "scheme_payment_type":"ImmediatePayment",
       "sponsor_party":{ 
          "account_number":"56781234",
          "bank_id":"123123",
          "bank_id_code":"GBDSC"
       }
    }
  };
})

test.todo('assert empty list');

let TEST_PAYMENT_URL;
test.serial('assert POST -- serial', async t => {
  await request
    .post({
      url: `${process.env.DEV_SERVER}/payments`,
      body: t.context.rawPayment,
      json: true,
      resolveWithFullResponse: true
    })
    .then(response => {
      t.truthy(response.headers.location);
      TEST_PAYMENT_URL = `${process.env.DEV_SERVER}${response.headers.location}`;
    })
    .catch(err => {
      console.error(err);
      t.fail();
    });
});

test.serial('assert GET -- serial', t => request
  .get(TEST_PAYMENT_URL)
  .then(payment => {
    const paymentObj = JSON.parse(payment);
    t.truthy(paymentObj._id);
    // __v and _id are generated by mongo
    const expected = { _id: paymentObj._id, __v: paymentObj.__v, ...t.context.rawPayment };
    // processing_date is sent as date string but it is stored as datetime
    expected.attributes.processing_date = new Date(expected.attributes.processing_date).toISOString();
    t.deepEqual(paymentObj, expected)
  })
  .catch(err => {
    console.error(err);
    t.fail();
  })
);

test.todo('assert PATCH -- serial');
test.todo('assert GET UPDATED -- serial');
test.todo('assert DELETE -- serial');
test.todo('assert GET not found -- serial');

test.todo('assert POST -- rand doc x 3');
test.todo('assert existing list -- serial');
test.todo('assert existing list paginated -- serial');
