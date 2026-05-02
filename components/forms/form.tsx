'use client';

import * as React from 'react';
import {
    useForm,
    UseFormReturn,
    SubmitHandler,
    UseFormProps,
    FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema, TypeOf } from 'zod';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues>
    extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
    schema: ZodSchema<T>;
    onSubmit: SubmitHandler<T>;
    children: (methods: UseFormReturn<T>) => React.ReactNode;
    options?: UseFormProps<T>;
    className?: string;
}

export function Form<T extends FieldValues>({
    schema,
    onSubmit,
    children,
    options,
    className,
    ...props
}: FormProps<T>) {
    const methods = useForm<T>({
        ...options,
        resolver: zodResolver(schema as any),
    });

    return (
        <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className={cn('space-y-6', className)}
            {...props}
        >
            {children(methods)}
        </form>
    );
}