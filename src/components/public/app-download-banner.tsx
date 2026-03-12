import { Button } from "@/components/ui/button"
import { Smartphone, Apple, Play } from "lucide-react"

export async function AppDownloadBanner() {
    return (
        <section className="bg-blue-900 text-white py-16 overflow-hidden relative">
            <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Leilão na palma da mão</h2>
                    <p className="text-lg md:text-xl text-blue-100 max-w-xl">
                        Baixe nosso aplicativo oficial e participe dos leilões em tempo real, receba notificações de lances e gerencie suas compras de onde estiver.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" className="bg-black hover:bg-gray-800 text-white h-14 px-8 gap-3 rounded-xl border border-gray-700">
                            <Apple className="h-8 w-8" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase">Disponível na</div>
                                <div className="text-base font-bold leading-none">App Store</div>
                            </div>
                        </Button>
                        <Button size="lg" className="bg-black hover:bg-gray-800 text-white h-14 px-8 gap-3 rounded-xl border border-gray-700">
                            <Play className="h-8 w-8 fill-current" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase">Disponível no</div>
                                <div className="text-base font-bold leading-none">Google Play</div>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Mock Phone Image */}
                <div className="flex-1 flex justify-center md:justify-end relative">
                    <div className="relative w-64 h-[500px] bg-black border-[14px] border-black rounded-[3rem] shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                        {/* Screen Mockup */}
                        <div className="h-full w-full bg-white flex flex-col">
                            <div className="h-6 bg-blue-900 w-full text-[10px] text-white flex items-center justify-between px-4">
                                <span>9:41</span>
                                <div>Signal/Wifi/Bat</div>
                            </div>
                            <div className="bg-gray-100 flex-1 p-2">
                                <div className="bg-white rounded-lg p-2 shadow-sm mb-2">
                                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                                    <div className="h-3 bg-gray-200 w-1/2 rounded mt-1"></div>
                                </div>
                                <div className="bg-white rounded-lg p-2 shadow-sm mb-2">
                                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                                </div>
                                <div className="bg-blue-600 rounded-full h-12 w-12 absolute bottom-4 right-4 shadow-lg flex items-center justify-center text-white font-bold">+</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </section>
    )
}
