import Navbar from '@/components/ui/landing/nav'
import Hero from '@/components/ui/landing/hero'
import Features from '@/components/ui/landing/features'
import Integrations from '@/components/ui/landing/Integration'
import Footer from '@/components/ui/landing/footer'

const Page = () => {
  return (
    <main className='w-full flex flex-col relative z-10'>
        <Navbar />
        <Hero />
        <Features />
        <Integrations />
        <Footer />
    </main>
  )
}

export default Page