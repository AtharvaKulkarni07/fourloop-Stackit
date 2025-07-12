import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(150, 'Title must be less than 150 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Maximum 5 tags allowed')
    .refine(
      (tags) => tags.every(tag => tag.length >= 2 && tag.length <= 20),
      'Each tag must be between 2 and 20 characters'
    )
});

export const createAnswerSchema = z.object({
  content: z.string()
    .min(20, 'Answer must be at least 20 characters')
    .max(5000, 'Answer must be less than 5000 characters'),
  questionId: z.string().min(1, 'Question ID is required')
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;