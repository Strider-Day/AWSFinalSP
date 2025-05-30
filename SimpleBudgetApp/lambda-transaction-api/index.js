const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION 
});

exports.handler = async (event) => {
  try {
    console.log('Lambda region:', process.env.AWS_REGION);
    console.log('Event body:', event.body);
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    // Handle different input formats
    let body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }

    const { amount, note, type } = body;
    
    // Add validation
    if (!amount || isNaN(amount)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: "Type must be 'income' or 'expense'" }),
      };
    }

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const params = new PutItemCommand({
      TableName: "Transactions",
      Item: {
        id: { S: id },
        amount: { N: amount.toString() },
        note: { S: note || "" },
        type: { S: type || "expense" }, // Default to expense if not provided
        timestamp: { S: timestamp },
      },
    });

    console.log('Attempting to save to DynamoDB...');
    await client.send(params);
    console.log('Successfully saved to DynamoDB');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        message: "Transaction saved", 
        id,
        type: type || "expense"
      }),
    };
  } catch (error) {
    console.error('Full error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: "Failed to save transaction",
        details: error.message 
      }),
    };
  }
};