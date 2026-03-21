import { Card } from '@/components/ui/card'
import { Zap, Bot, Users, BarChart3, Code, Shield } from 'lucide-react'

const features = [
  {
    icon: <Bot className='w-5 h-5 text-purple-400' />,
    title: "AI Powered Responses",
    description: "Gemini AI answers customer questions instantly using your business knowledge. No more copy pasting FAQs."
  },
  {
    icon: <Zap className='w-5 h-5 text-blue-400' />,
    title: "Instant Setup",
    description: "Add one line of code to your website and your AI support agent is live in under 2 minutes."
  },
  {
    icon: <Users className='w-5 h-5 text-green-400' />,
    title: "Human Escalation",
    description: "When AI cannot answer, it instantly notifies a human agent to take over seamlessly."
  },
  {
    icon: <BarChart3 className='w-5 h-5 text-yellow-400' />,
    title: "Analytics Dashboard",
    description: "Track total sessions, response times, and escalation rates. Understand your support performance."
  },
  {
    icon: <Code className='w-5 h-5 text-pink-400' />,
    title: "Easy Embed",
    description: "One script tag. Works on any website — WordPress, Shopify, or custom HTML. No coding required."
  },
  {
    icon: <Shield className='w-5 h-5 text-orange-400' />,
    title: "Secure & Reliable",
    description: "Rate limiting, input sanitization and session management built in. Enterprise grade security."
  },
]

const Features = () => {
  return (
    <section id='features' className='py-24 px-6'>
        <div className='max-w-6xl mx-auto'>

            {/* Section Header */}
            <div className='text-center mb-16'>
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6'>
                    <span className='text-xs text-zinc-400'>Everything you need</span>
                </div>
                <h2 className='text-3xl md:text-5xl font-medium text-white tracking-tight mb-4'>
                    Built for modern
                    <br/>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'>support teams</span>
                </h2>
                <p className='text-zinc-400 font-light max-w-xl mx-auto'>
                    Everything you need to deliver instant, intelligent customer support without hiring a large team.
                </p>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {features.map((feature, index) => (
                    <Card key={index} className='bg-white/5 border-white/10 hover:bg-white/8 transition-colors group p-6'>
                        <div className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/20 transition-colors'>
                            {feature.icon}
                        </div>
                        <h3 className='text-sm font-medium text-white mb-2'>{feature.title}</h3>
                        <p className='text-sm text-zinc-500 font-light leading-relaxed'>{feature.description}</p>
                    </Card>
                ))}
            </div>

        </div>
    </section>
  )
}

export default Features