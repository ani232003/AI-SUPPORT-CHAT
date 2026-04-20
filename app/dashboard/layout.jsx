import Sidebar from '@/components/ui/dashboard/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export const metadata = {
  title: "ReplyAI Support Chat",
  description: "ReplyAI lets any business deploy a smart AI chatbot on their website in minutes.",
}

export default async function DashboardLayout({ children }) {
    const cookieStore = await cookies()
    const session = cookieStore.get('session_user')
    
    if (!session) {
        redirect('/')
    }

    return (
        <div className='bg-[#050509] min-h-screen font-sans antialiased text-white'>
            {session?.value ? ( 
                <>
                    <Sidebar />
                    <div className='flex-1 flex flex-col md:ml-64 relative min-h-screen transition-all duration-300'>
                     {/* <Header /> */}
                      <main className="flex-1 ">{children}</main>
                    </div>
                </>
            ) : (
                children
            )}
        </div>
    )
}