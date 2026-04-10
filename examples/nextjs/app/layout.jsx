export const metadata = {
    title: 'Geophrase Next.js Example',
    description: 'Testing the Geophrase React SDK in Next.js App Router',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}