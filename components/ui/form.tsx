"use client"

import * as React from "react"
import {
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  Controller,
} from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>")
  }

  return {
    id: itemContext?.id ?? fieldContext.name,
    name: fieldContext.name,
    formItemId: `${itemContext?.id ?? fieldContext.name}-form-item`,
    formDescriptionId: `${itemContext?.id ?? fieldContext.name}-form-item-description`,
    formMessageId: `${itemContext?.id ?? fieldContext.name}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = { id: string }

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <label
      ref={ref}
      data-slot="form-label"
      data-error={Boolean(error)}
      className={cn("text-sm font-medium leading-none", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={Boolean(error)}
      data-slot="form-control"
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
