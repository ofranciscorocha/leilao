'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Define initial state type explicitly to match useActionState expectations
const initialState = {
    message: '',
    errors: undefined as Record<string, string[]> | undefined,
}

export default function AdminLogin() {
    // Use React 19 useActionState
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Username / Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="admin"
                                required
                                defaultValue="admin"
                            />
                            {state?.errors?.email && (
                                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                defaultValue="Rf1593577$"
                            />
                            {state?.errors?.password && (
                                <p className="text-sm text-red-500">{state.errors.password[0]}</p>
                            )}
                        </div>

                        {state?.message && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                {state.message}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 justify-center">
                    Auction Platform Admin Panel
                </CardFooter>
            </Card>
        </div>
    )
}
