export function Footer() {
    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">Pátio Rocha Leilões</h3>
                        <p className="text-sm text-gray-500">
                            Your trusted partner for vehicle auctions via official edicts.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>active Auctions</li>
                            <li>How it Works</li>
                            <li>Terms of Service</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>support@patiorocha.com</li>
                            <li>+55 (11) 1234-5678</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Office</h3>
                        <p className="text-sm text-gray-500">
                            Av. Brasil, 1000<br />
                            São Paulo, SP
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Pátio Rocha Leilões. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
