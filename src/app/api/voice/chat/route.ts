import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AI_SYSTEM_PROMPT } from '@/lib/salon-data';
import { AI_TOOLS, executeToolCall, processOfflineConversation } from '@/lib/ai/salon-assistant';
import { ChatMessage, Appointment } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], userInput = '', callerName = 'Valued Guest' } = body;

    // 1. Fast Zero-Latency Intent Check (<10ms response for common booking & salon questions)
    const fastResult = await processOfflineConversation(messages, userInput);
    const hasFastMatch = fastResult && !fastResult.reply.includes("How may I help you today?");
    
    // If it's a common salon intent (booking, hours, pricing, location, handoff), return instantly!
    if (hasFastMatch) {
      return NextResponse.json({
        reply: fastResult.reply,
        language: fastResult.language,
        appointmentCreated: fastResult.appointmentCreated,
        isTransfer: fastResult.isTransfer,
        engine: 'fast-local-neural',
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key or in offline demo mode, return fallback
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_key')) {
      return NextResponse.json({
        reply: fastResult.reply,
        language: fastResult.language,
        appointmentCreated: fastResult.appointmentCreated,
        isTransfer: fastResult.isTransfer,
        engine: 'smart-fallback',
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Format chat history
    const openAiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...messages.map((m: ChatMessage) => ({
        role: m.role as 'assistant' | 'user' | 'system',
        content: m.content,
      })),
      { role: 'user', content: userInput },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      messages: openAiMessages,
      tools: AI_TOOLS,
      tool_choice: 'auto',
      temperature: 0.4,
      max_tokens: 80,
    });

    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage) {
      return NextResponse.json({
        reply: fastResult.reply,
        language: fastResult.language,
        appointmentCreated: fastResult.appointmentCreated,
        isTransfer: fastResult.isTransfer,
        engine: 'smart-fallback-empty-response',
      });
    }

    let appointmentCreated: Appointment | undefined;
    let isTransfer = false;

    // Handle tool/function calls if requested by the model
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      let parsedArgs: Record<string, unknown> = {};
      try {
        parsedArgs = JSON.parse(toolCall.function.arguments);
      } catch {
        parsedArgs = {};
      }

      const execution = await executeToolCall(functionName, parsedArgs);
      appointmentCreated = execution.appointmentCreated;
      if (execution.isTransfer) isTransfer = true;

      // Second turn with tool response to generate natural vocal reply
      const followUpMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...openAiMessages,
        responseMessage,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(execution.result),
        },
      ];

      const followUp = await openai.chat.completions.create({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
        messages: followUpMessages,
        temperature: 0.4,
        max_tokens: 60,
      });

      const finalReply = followUp.choices[0]?.message?.content || "Your appointment has been confirmed.";

      const isTelugu = /[\u0C00-\u0C7F]/.test(finalReply);
      const isHindi = /[\u0900-\u097F]/.test(finalReply);
      const lang = isTelugu ? 'te' : isHindi ? 'hi' : 'en';

      return NextResponse.json({
        reply: finalReply,
        language: lang,
        appointmentCreated,
        isTransfer,
        toolExecuted: functionName,
        engine: 'openai-gpt4o-mini',
      });
    }

    const reply = responseMessage.content || "How may I assist you further with Annu Beauty Salon?";
    const isTelugu = /[\u0C00-\u0C7F]/.test(reply);
    const isHindi = /[\u0900-\u097F]/.test(reply);
    const lang = isTelugu ? 'te' : isHindi ? 'hi' : 'en';

    return NextResponse.json({
      reply,
      language: lang,
      appointmentCreated,
      isTransfer,
      engine: 'openai-gpt4o-mini',
    });
  } catch (error: unknown) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      reply: "Welcome to Annu Beauty Salon! How may I help you with your appointment today?",
      language: 'en',
      engine: 'error-fallback',
    });
  }
}
