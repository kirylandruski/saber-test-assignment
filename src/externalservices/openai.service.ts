import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../appconfig/app-config.service';

export enum OpenAIModel {
  GPT4o = 'gpt-4o',
  GPT4oMini = 'gpt-4o-mini',
}

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly config: AppConfigService) {
    this.openai = new OpenAI({ apiKey: config.openaiKey });
  }

  async getJSONResponse<T>(
    model: OpenAIModel,
    messages: ChatCompletionMessageParam[],
    schema: z.Schema<T>
  ): Promise<T> {
    const completions = await this.openai.chat.completions.create({
      n: 1,
      model: model,
      messages: [
        ...messages,
        {
          role: 'system',
          content: 'Set the result to the set_result tool',
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'set_result',
            description: 'Sets result',
            parameters: zodToJsonSchema(schema),
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'set_result',
        },
      },
    });

    const response = JSON.parse(completions.choices[0].message!.tool_calls![0].function.arguments);
    return schema.parse(response);
  }
}
