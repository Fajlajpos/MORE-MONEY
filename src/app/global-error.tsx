'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex h-screen flex-col items-center justify-center gap-4">
                    <h2>Něco se kriticky pokazilo!</h2>
                    <button onClick={() => reset()}>Zkusit znovu</button>
                </div>
            </body>
        </html>
    )
}
