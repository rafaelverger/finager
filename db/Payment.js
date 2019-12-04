const mongoose = require('mongoose');
const MUUID = require('uuid-mongodb');

//TODO couldn't find a way to use swagger (OAS 3.0) schemas as mongoose schemas :(

const Currency = {
  type: String,
  enum: [
    "GBP",
    "BRL",
    "EUR",
    "USD"
  ],
};

const ChargerInformation = mongoose.Schema({ amount: Number, currency: Currency }, { _id : false });

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
      receiver_charges_amount: Number,
      receiver_charges_currency: Currency,
      sender_charges: [ChargerInformation],
    },
    currency: Currency,
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
      original_currency: Currency
    },
    numeric_reference: Number,
    payment_id: String,
    payment_purpose: String,
    payment_scheme: { type: String, enum: ["FPS"] },
    payment_type: { type: String, enum: ["Credit", "Debit"] },
    processing_date: Date,
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
