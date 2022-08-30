import axios from "axios"
import nicepayBasicAuth from "./nicepayBasicAuth"

export default axios.create({
  baseURL: 'https://sandbox-api.nicepay.co.kr/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + nicepayBasicAuth
  }
})
