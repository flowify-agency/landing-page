import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let reqBody = {};
    try {
      reqBody = await request.json();
    } catch {
      reqBody = {};
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { 
          error: 'Razorpay credentials not fully configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local',
          isDemo: true 
        },
        { status: 200 } // Return 200 with demo flag so client can fall back gracefully
      );
    }

    const parsedAmount = Number(reqBody.amount) || 1000;
    const amountInPaise = Math.round(parsedAmount * 100);
    const currency = (reqBody.currency || 'INR').toUpperCase();
    const receipt = reqBody.receipt || `receipt_audit_${Date.now()}`;

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(keyId + ':' + keySecret).toString('base64'),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Razorpay API Error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
