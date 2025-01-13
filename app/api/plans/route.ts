import { NextRequest, NextResponse } from "next/server";

const plans = [
  {
    "plan_id": "basic_plan",
    "name": "Basic Starter Plan",
    "description": "Affordable plan for beginners",
    "price": 7.77,
    "duration": 30,
    "credits": 10,
    "features": "Unlocks Discovering URLs of Content; Access to Basic Search Functions"
  },
  {
    "plan_id": "premium_plan",
    "name": "Premium Plan",
    "description": "Perfect for individual professionals",
    "price": 19.99,
    "duration": 30,
    "credits": 50,
    "features": "Everything in Basic Plan; Advanced Search Features; Priority Support"
  },
  {
    "plan_id": "professional_plan",
    "name": "Professional Plan",
    "description": "For power users and small teams",
    "price": 39.99,
    "duration": 30,
    "credits": 150,
    "features": "Everything in Premium Plan; API Access; 24/7 Priority Support"
  },
  {
    "plan_id": "business_plan",
    "name": "Business Plan",
    "description": "For growing businesses",
    "price": 99.99,
    "duration": 30,
    "credits": 500,
    "features": "Everything in Professional Plan; Advanced Analytics; Custom Integration Support"
  },
  {
    "plan_id": "enterprise_plan",
    "name": "Enterprise Plan",
    "description": "For large organizations",
    "price": 0.0,
    "duration": 30,
    "credits": null,
    "features": "Everything in Business Plan; Unlimited Credits; Custom Features; Dedicated Account Manager"
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
} 