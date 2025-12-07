import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Change your claude model to your preferred version
const MODEL = 'claude-sonnet-4-5-20250929';

export async function generateChatResponse(message: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are wIngAn, a quirky and enthusiastic dating assistant. Help the user plan dates based on their request. Be concise, specific, and practical. Include venue suggestions, activities, and tips.

      Do not return in markdown format, just plain text, no need for any bolds / italics.
      Keep it casual with emojis every now and then.
      Dates never go as planned, so always includes some backup options, and plan B.
      Try to keep the dates timed. 
      Consider the Weather, Time of Day, whiether it's a weekday or weekend, and the User's preferences.
      Remind the user to be themselves and have fun! 


User request: ${message}`,
      },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

export async function generateDateSuggestions(
  userProfile: never,
  prompt: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are WingMan, a helpful and enthusiastic dating assistant. Based on the user's profile and their request, suggest creative and personalized date ideas.

User Profile: ${JSON.stringify(userProfile)}
User Request: ${prompt}

Please provide detailed date suggestions including activities, locations, and tips.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text : '';
}
