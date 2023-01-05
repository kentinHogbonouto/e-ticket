import { Schema } from "mongoose";

const PhoneNumberSchema = new Schema({
  _id: {
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  isoCode: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
});

export default PhoneNumberSchema;
