import { TypingAnimation } from '@/components/ui/typing-animation';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <TypingAnimation 
          text="log(b)log(a)" 
          duration={150}
          className="text-6xl md:text-8xl font-bold text-primary"
        />
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your destination for digital products, technology insights, and productivity tools.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <div className="group relative p-6 border rounded-2xl hover:border-primary transition-all hover:shadow-lg">
            <div className="text-4xl mb-2">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">Shop</h3>
            <p className="text-sm text-muted-foreground">
              Browse our digital products
            </p>
          </div>

          <div className="group relative p-6 border rounded-2xl hover:border-primary transition-all hover:shadow-lg">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-xl font-semibold mb-2">Blog</h3>
            <p className="text-sm text-muted-foreground">
              Read our latest articles
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

