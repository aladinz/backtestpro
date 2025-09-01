import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize OpenAI only when API key is available
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI()
    
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { symbols } = await request.json()

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { error: 'Invalid symbols array provided' },
        { status: 400 }
      )
    }

    const symbolsString = symbols.join(', ')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Most cost-effective model
      messages: [
        {
          role: "system",
          content: `You are a financial data assistant. Return ONLY a valid JSON object with current stock prices. Do not include any explanatory text, markdown formatting, or code blocks. The response must be pure JSON that can be parsed directly.

Format: {"SYMBOL": price_as_number}

Example: {"AAPL": 224.85, "MSFT": 418.92}

Important:
- Use real-time or very recent market prices
- Prices should be realistic for the current market (August 2025)
- Return only the JSON object
- Include prices for ALL requested symbols
- Use current market hours pricing if markets are open, or last closing price if closed`
        },
        {
          role: "user",
          content: `Get current stock prices for these symbols: ${symbolsString}`
        }
      ],
      temperature: 0.1,
      max_tokens: 500, // Reduced for cost efficiency
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let prices
    try {
      prices = JSON.parse(responseText)
    } catch (parseError) {
      // Try to extract JSON from response if it's wrapped in markdown or has extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        prices = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse JSON from response')
      }
    }

    // Validate that we have prices for all symbols
    const missingSymbols = symbols.filter(symbol => !(symbol in prices))
    if (missingSymbols.length > 0) {
      return NextResponse.json(
        { error: `Missing prices for symbols: ${missingSymbols.join(', ')}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      prices,
      timestamp: new Date().toISOString(),
      source: 'openai-gpt4'
    })

  } catch (error) {
    console.error('Stock price fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock prices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
