'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Sparkles } from 'lucide-react';
import { GlassCard } from '@repo/ui/glass-card';
import { GlassInput } from '@repo/ui/glass-input';
import { GlassButton } from '@repo/ui/glass-button';
import { verifyEmailSchema, type VerifyEmailInput } from '@/lib/validations/auth';
import { BRAND } from '@/lib/constants';
import { verifyAction } from './actions';

export default function VerifyPage() {
    const router = useRouter();
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [pending, startTransition] = useTransition();

    const [formData, setFormData] = useState<VerifyEmailInput>({
        code: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget as HTMLFormElement);
        console.log("Submitting form with code:", formData.code);

        startTransition(async () => {
            const response = await verifyAction(formdata);
            if (response.success) {
                router.push('/dashboard');
            } else {
                const errorMessage =
                    response.error ||
                    response.error?.message?.[0] ||
                    "An unexpected error occurred.";
                setErrors({ code: errorMessage });
            }
        });
    }



    const handleResendCode = async () => {
        setIsResending(true);
        setResendSuccess(false);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 3000);
        } catch (error) {
            console.error('Resend error:', error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neutral-800 dark:bg-white mb-4">
                        <Sparkles className="w-8 h-8 text-white dark:text-neutral-800" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
                        {BRAND.name}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        {BRAND.tagline}
                    </p>
                </div>

                <GlassCard>
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                            <Mail className="w-6 h-6 text-neutral-800 dark:text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-2">
                            Verify your email
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            We've sent a verification code to your email. Enter it below to verify your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Verification Code
                            </label>
                            <GlassInput
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                name='code'
                            />
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                                Enter the 6-digit code
                            </p>
                        </div>

                        <GlassButton
                            type="submit"
                            variant="primary"
                            isLoading={pending}
                            className="w-full"
                        >
                            Verify Email
                        </GlassButton>
                        {errors.code && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {errors.code}
                            </p>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="text-center">
                            {resendSuccess ? (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Code resent successfully! Check your email.
                                </p>
                            ) : (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Didn't receive the code?{' '}
                                    <button
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                        className="font-medium text-neutral-800 dark:text-white hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending ? 'Resending...' : 'Resend code'}
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
