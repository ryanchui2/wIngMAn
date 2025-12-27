import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Change your claude model to your preferred version
const MODEL = 'claude-sonnet-4-5-20250929';

const BASE_SYSTEM_PROMPT = `You are wingMan, a quirky and enthusiastic dating assistant. Help the user plan dates based on their request. Be concise, specific, and practical. Include venue suggestions, activities, and tips.

Keep it casual with emojis every now and then.
Use the conversation history to maintain context of past dates if available, and build on top of it if requested.
Dates never go as planned, so always includes some backup options, and plan B.
Try to keep the dates timed.
Consider the Weather, Time of Day, whether it's a weekday or weekend, and the User's preferences.
Remind the user to be themselves and have fun!`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserProfile {
  age: number | null;
  location: string | null;
  gender: string | null;
  interests: string | null;
  datingGoals: string | null;
  datingStyle: string | null;
  budget: string | null;
  outdoor: boolean | null;
  social: boolean | null;
  dietaryRestrictions: string | null;
  additionalNotes: string | null;
}

function buildSystemPrompt(profile: UserProfile | null): string {
  if (!profile) {
    return BASE_SYSTEM_PROMPT;
  }

  const profileContext: string[] = [];

  if (profile.age) profileContext.push(`Age: ${profile.age}`);
  if (profile.gender) profileContext.push(`Gender: ${profile.gender}`);
  if (profile.location) profileContext.push(`Location: ${profile.location}`);
  if (profile.interests) profileContext.push(`Interests: ${profile.interests}`);
  if (profile.datingGoals) profileContext.push(`Dating goals: ${profile.datingGoals}`);
  if (profile.datingStyle) profileContext.push(`Dating style: ${profile.datingStyle}`);
  if (profile.budget) profileContext.push(`Budget preference: ${profile.budget}`);
  if (profile.outdoor !== null) profileContext.push(`Outdoor activities: ${profile.outdoor ? 'enjoys' : 'prefers indoor'}`);
  if (profile.social !== null) profileContext.push(`Social settings: ${profile.social ? 'enjoys social settings' : 'prefers quieter settings'}`);
  if (profile.dietaryRestrictions) profileContext.push(`Dietary restrictions: ${profile.dietaryRestrictions}`);
  if (profile.additionalNotes) profileContext.push(`Additional context: ${profile.additionalNotes}`);

  if (profileContext.length === 0) {
    return BASE_SYSTEM_PROMPT;
  }

  return `${BASE_SYSTEM_PROMPT}

USER PROFILE:
${profileContext.join('\n')}

Use this profile information to personalize your advice and suggestions. Tailor date ideas to their location, interests, budget, and preferences.`;
}

export async function generateChatResponse(
  message: string,
  conversationHistory: Message[] = [],
  userProfile: UserProfile | null = null
): Promise<string> {
  // Build system prompt with user profile if available
  const systemPrompt = buildSystemPrompt(userProfile);

  // Build messages array with conversation history
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: message,
    },
  ];

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}
