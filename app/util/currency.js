'use strict';
import fetch from 'node-fetch';
import {healthcareTiers} from '../constants/healthcareTiers';


export const getAusTaxRateAUD = (salary) => {
  if (salary <= 18200) {
    return 0;
  } else if (salary <= 37000) {
    return ((salary - 18200) * 0.19);
  } else if (salary <= 87000) {
    return (((salary - 37000) * 0.325) + 3572);
  } else if (salary <= 180000) {
    return (((salary - 87000) * 0.37) + 19822);
  } else {
    return (((salary - 180000) * 0.45) + 54232);
  }
}

export const caluclateMedicareLevyAUD = (salary) => {
  if (salary <= 21335) {
    return 0;
  } else if (salary <= 26668){
    return (salary - 21335) * 0.1
  } else {
    return salary * 0.02;
  }
}

export const calculateMedicareLevySurchargeAUD = (salary) => {
  if (salary <= 90000){
    return 0;
  } else if (salary <= 105000){
    return salary * 0.01;
  } else if (salary <= 140000){
    return salary * 0.0125;
  } else {
    return salary * 0.015;
  }
}

export const calculatePrivateInsuranceAUS = (costMonthly) => 12 * costMonthly;

export const calculatePrivateInsuranceUSD = (tier) => healthcareTiers[tier]; 

// this is only for filing singly.
export const getUSTaxRateUSD = (salary) => {
  if (salary <= 9275) {
    return salary * 0.10;
  } else if (salary <= 37650) {
    return (((salary - 9275) * 0.15) + 927.5);
  } else if (salary <= 91150) {
    return (((salary - 37650) * 0.25) + 5183.75);
  } else if (salary <= 190150){
    return (((salary - 91150) * 0.28) + 18558.75);
  } else if (salary <= 413350){
    return (((salary - 190150) * 0.33) + 46278.75);
  } else if (salary <= 415050){
    return (((salary - 413350) * 0.35) + 119934.75);
  } else {
    return (((salary - 415050) * 0.396) + 120529.75);
  }
}

export const getRate = ({from, to}) => new Promise((resolve, reject) => {
  fetch(`http://api.fixer.io/latest?symbols=${from},${to}`)
      .then((res) => res.json())
      .then((json) => {
        resolve(json.rates[to] / json.rates[from]);
      })
      .catch((rej) => reject(rej));
})

// Taxation:

// Australian Taxes:

// 0 – $18,200: Nil
// $18,201 – $37,000: 19c for each $1 over $18,200
// $37,001 – $87,000: $3,572 plus 32.5c for each $1 over $37,000
// $87,001 – $180,000: $19,822 plus 37c for each $1 over $87,000
// $180,001 and over: $54,232 plus 45c for each $1 over $180,000

// American Taxes:


// Taxable Income  Tax Rate
// $0—$9,275 10%
// $9,276—$37,650  $927.50 plus 15% of the amount over $9,275
// $37,651—$91,150 $5,183.75 plus 25% of the amount over $37,650
// $91,151—$190,150  $18,558.75 plus 28% of the amount over $91,150
// $190,151—$ 413,350  $46,278.75 plus 33% of the amount over $190,150
// $413,351—$415,050 $119,934.75 plus 35% of the amount over $413,350
// $415,051 or more  $120,529.75 plus 39.6% of the amount over $415,050

// http://fixer.io/ is a free currency exchange API.
// http://api.fixer.io/latest?symbols=USD,GBP

// salary is AUD.
