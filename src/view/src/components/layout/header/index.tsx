import MainHeader from './MainHeader'
import Navigation from './Navigation'
import TopBar from './TopBar'

export default function Header() {
  return (
    <>
      {/* Header */}
      <header className='bg-white border-gray-100 border-b'>
        <TopBar />
        <MainHeader />
      </header>
      {/* Navigation */}
      <Navigation />
    </>
  )
}
