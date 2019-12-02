const mongoose = require('mongoose');
const MUUID = require('uuid-mongodb');

// TODO couldn't find a way to use swagger (OAS 3.0) schemas as mongoose schemas :(
const PaymentSchema = mongoose.Schema({
  _id: { type: String, default: MUUID.v1 },
  attributes: {
    amount: Number,
    beneficiary_party: {
      account_name: String,
      account_number: String,
      account_number_code: String,
      account_type: Number,
      address: String,
      bank_id: String,
      bank_id_code: String,
      name: String,
    },
    charges_information: {
      bearer_code: String,
      sender_charges: [{
        amount: Number,
        currency: {
          type: String,
          enum: [
            "GBP",
            "BRL",
            "EUR",
            "USD"
          ],
        }
      }],
    },
    currency: {
      type: String,
      enum: [
        "GBP",
        "BRL",
        "EUR",
        "USD"
      ],
    },
    debtor_party: {
      account_name: String,
      account_number: String,
      account_number_code: String,
      account_type: Number,
      address: String,
      bank_id: String,
      bank_id_code: String,
      name: String,
    },
    end_to_end_reference: String,
    fx: {
      contract_reference: String,
      exchange_rate: Number,
      original_amount: Number,
      original_currency: {
        type: String,
        enum: [
          "GBP",
          "BRL",
          "EUR",
          "USD"
        ],
      }
    },
    numeric_reference: Number,
    payment_id: String,
    payment_purpose: String,
    payment_scheme: { type: String, enum: ["FPS"] },
    payment_type: { type: String, enum: ["Credit", "Debit"] },
    processing_date: String,
    reference: String,
    scheme_payment_sub_type: { type: String, enum: ["InternetBanking"] },
    scheme_payment_type: { type: String, enum: ["ImmediatePayment"] },
    sponsor_party: {
      account_name: String,
      account_number: String,
      account_number_code: String,
      account_type: Number,
      address: String,
      bank_id: String,
      bank_id_code: String,
      name: String,
    }
  },
  organisation_id: String,
  type: { type: String, enum: ["Payment"] },
  version: Number
});

module.exports = mongoose.model('Payment', PaymentSchema);
