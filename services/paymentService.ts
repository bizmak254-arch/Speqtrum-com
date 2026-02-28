
import { GoogleGenAI } from "@google/genai";
import { User } from "../types";

// Use process.env.API_KEY directly as per GenAI initialization guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface PaymentDetails {
  method: 'card' | 'mobile_money' | 'crypto';
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  cardName?: string;
  phoneNumber?: string;
  cryptoTxHash?: string;
}

export const getPersonalizedValuePropostion = async (user: User) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User bio: "${user.bio}". Interests: ${user.interests?.join(', ')}. 
      Explain in 1 short, punchy sentence why upgrading to 'Speqtrum Gold' (which includes global matching and incognito mode) is perfect for THIS specific user. Focus on authentic connection and community.`,
    });
    // Access .text directly as a property
    return response.text || "Unlock the full spectrum of your community.";
  } catch (e) {
    return "Experience the community without limits.";
  }
};

const luhnCheck = (val: string) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j == 1) {j = 2} else {j = 1};
    }
    return (checksum % 10) == 0;
};

export const processMockPayment = async (details: PaymentDetails): Promise<{ success: boolean; transactionId: string }> => {
  // Simulate network latency for payment processor
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  if (details.method === 'card') {
    const cleanNum = (details.cardNumber || '').replace(/\s/g, '');
    if (cleanNum.length < 13 || !luhnCheck(cleanNum)) {
      throw new Error("Card declined: Invalid card number.");
    }
    if (!details.cvc || details.cvc.length < 3) {
       throw new Error("Card declined: Invalid security code.");
    }
    if (!details.expiry || !details.expiry.includes('/')) {
        throw new Error("Invalid expiry date format (MM/YY).");
    }
  } else if (details.method === 'mobile_money') {
     if (!details.phoneNumber || details.phoneNumber.length < 9) {
        throw new Error("Invalid phone number for mobile money transfer.");
     }
  } else if (details.method === 'crypto') {
      if (!details.cryptoTxHash || details.cryptoTxHash.length < 10) {
          throw new Error("Invalid transaction hash. Please verify your transfer.");
      }
  }

  return {
    success: true,
    transactionId: `TXN-${Math.random().toString(36).toUpperCase().substring(2, 12)}`
  };
};
