import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen bg-[#0D0B09] flex items-center justify-center px-6 relative overflow-hidden'>
      <p className='absolute font-display text-[20vw] text-[#1C1916] select-none pointer-events-none leading-none'>
        404
      </p>
      <div className='relative z-10 flex flex-col items-center text-center'>
        <h1 className='font-display text-4xl text-[#F2EDE4]'>Page not found.</h1>
        <p className='font-sans text-sm text-[#B8B0A4] mt-4'>This page does not exist.</p>
        <Link href='/' className='mt-8 text-[#C9A84C] font-sans text-xs tracking-[0.2em] uppercase hover:text-[#E8C97A] transition-colors'>
          {'<-'} Back to Home
        </Link>
      </div>
    </div>
  )
}
