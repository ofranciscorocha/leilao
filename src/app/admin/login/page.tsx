'use client'

import { useActionState } from "react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define initial state type explicitly to match useActionState expectations
const initialState = {
    success: false,
    message: '',
    errors: undefined as Record<string, string[]> | undefined,
}

export default function AdminLogin() {
    // Use React 19 useActionState
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#080c17] p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary blur-[100px] rounded-full opacity-50" />
            
            <Card className="w-full max-w-md border-none bg-white shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-700">
                <CardHeader className="space-y-4 pt-12 pb-8 px-10 text-center bg-gradient-to-b from-gray-50/50 to-transparent">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 transition-transform hover:rotate-6">
                        <Gavel className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-black text-primary tracking-tighter uppercase italic">
                            Acesso <span className="text-secondary">Restrito</span>
                        </CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">
                            Pátio Rocha Leilões • Gestão
                        </CardDescription>
                    </div>
                </CardHeader>
                
                <CardContent className="px-10 pb-10">
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Usuário / E-mail</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="admin"
                                    required
                                    defaultValue="admin"
                                    className="h-14 pl-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-secondary/50 rounded-2xl font-medium transition-all"
                                />
                            </div>
                            {state?.errors?.email && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">{state.errors.email[0]}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-1">Senha de Acesso</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    defaultValue="Rf1593577$"
                                    className="h-14 pl-12 bg-gray-50 border-gray-100 focus:bg-white focus:ring-secondary/50 rounded-2xl font-medium transition-all"
                                />
                            </div>
                            {state?.errors?.password && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-1">{state.errors.password[0]}</p>
                            )}
                        </div>

                        {state?.message && (
                            <div className="p-4 text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 rounded-2xl animate-in shake-in duration-300">
                                {state.message}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-14 bg-primary hover:bg-[#0c1322] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0" 
                            disabled={isPending}
                        >
                            {isPending ? 'Validando...' : 'Entrar no Sistema'}
                        </Button>
                    </form>
                </CardContent>
                
                <CardFooter className="bg-gray-50/50 py-6 border-t border-gray-100 flex flex-col gap-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Segurança Criptografada Arremate Club
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

import { Gavel, Lock, User } from "lucide-react"
