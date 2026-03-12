import Link from 'next/link';
import { Menu, Info, HelpCircle, Mail, X } from "lucide-react";
import { logout } from "@/app/actions/auth";

export async function Header() {
    return (
        <header className="flex items-center justify-between h-[50px] bg-[#3c8dbc] text-white shadow-sm w-full">
            {/* Left side actions */}
            <div className="flex items-center h-full">
                <button className="flex items-center justify-center h-full px-4 hover:bg-[#367fa9] transition-colors">
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Right side navigation & actions */}
            <div className="flex items-center h-full">
                <a href="#" className="flex items-center gap-1 h-full px-3 text-[14px] hover:bg-[#367fa9] transition-colors">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Central de Atendimento</span>
                </a>

                {/* Notifications */}
                <button className="relative flex items-center justify-center h-full px-3 hover:bg-[#367fa9] transition-colors">
                    <HelpCircle className="h-[18px] w-[18px]" />
                    <span className="absolute top-[8px] right-[4px] bg-[#f39c12] text-white text-[10px] font-bold px-[4px] py-[1px] rounded-sm leading-none">
                        12
                    </span>
                </button>
                <button className="relative flex items-center justify-center h-full px-3 hover:bg-[#367fa9] transition-colors">
                    <Mail className="h-[18px] w-[18px]" />
                    <span className="absolute top-[8px] right-[4px] bg-[#f39c12] text-white text-[10px] font-bold px-[4px] py-[1px] rounded-sm leading-none">
                        20
                    </span>
                </button>
                <button className="relative flex items-center justify-center h-full px-3 hover:bg-[#367fa9] transition-colors">
                    <X className="h-[18px] w-[18px]" />
                    <span className="absolute top-[8px] right-[4px] bg-[#f39c12] text-white text-[10px] font-bold px-[4px] py-[1px] rounded-sm leading-none">
                        6
                    </span>
                </button>

                {/* User Dropdown Profile area */}
                <form action={logout}>
                    <button type="submit" className="flex items-center h-full px-4 hover:bg-[#c9302c] transition-colors cursor-pointer border-l border-[#367fa9]">
                        <div className="h-6 w-6 rounded-full bg-white text-[#3c8dbc] flex items-center justify-center overflow-hidden mr-2">
                            {/* Dummy Avatar Placeholder */}
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                        <span className="text-[13px] font-medium mr-2">admin</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase transition-colors group-hover:bg-white/40">Sair</span>
                    </button>
                </form>
            </div>
        </header>
    );
}
