'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuestionSchema, CreateQuestionInput } from '@/lib/validations/question'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RichTextEditor } from './ui/rich-text-editor'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export function QuestionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState('<p></p>') // initialize with valid HTML

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
  })

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()

      if (tag && !tags.includes(tag) && tags.length < 5) {
        const newTags = [...tags, tag]
        setTags(newTags)
        setValue('tags', newTags)
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    setValue('tags', newTags)
  }

  const onSubmit = async (data: CreateQuestionInput) => {
    // Client-side validation before sending to backend
    if (!data.title || data.title.length < 10) {
      toast.error('Title must be at least 10 characters.')
      return;
    }
    const plainDesc = description.replace(/<[^>]+>/g, '').trim();
    if (!plainDesc || plainDesc.length < 20) {
      toast.error('Description must be at least 20 characters.')
      return;
    }
    if (!tags.length) {
      toast.error('At least one tag is required.')
      return;
    }
    if (tags.some(tag => tag.length < 2 || tag.length > 20)) {
      toast.error('Each tag must be between 2 and 20 characters.')
      return;
    }
    setLoading(true)
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          description,
          tags,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData?.error || 'Failed to create question')
        return;
      }
      const question = await response.json()
      toast.success('Question created successfully!')
      router.push(`/questions/${question.id}`)
    } catch (error) {
      toast.error('Failed to create question')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="What's your programming question? Be specific."
          className="mt-1"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <div className="mt-1">
          <RichTextEditor
            content={description}
            onChange={(content: string) => {
              setDescription(content)
              setValue('description', content)
            }}
            placeholder="Include all the information someone would need to answer your question"
          />
        </div>
        {errors.description && typeof errors.description.message === 'string' && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
        {errors.description && Array.isArray(errors.description.message) && (
          <ul className="text-red-600 text-sm mt-1 list-disc ml-4">
            {errors.description.message.map((msg: string, idx: number) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add up to 5 tags (press Enter or comma to add)"
          className="mt-1"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-4 w-4 p-0 hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        {errors.tags && <p className="text-red-600 text-sm mt-1">{errors.tags.message}</p>}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Question'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
