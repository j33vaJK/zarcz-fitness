'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    description?: string;
    methods: UseFormReturn<any>;
}

export function InputField({
    name,
    label,
    description,
    methods,
    className,
    ...props
}: InputFieldProps) {
    return (
        <FormField
            control={methods.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input {...field} {...props} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}