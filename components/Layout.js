function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-pink-600">Diary2U</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-gray-100 text-center py-4">
        <p className="text-gray-500">© 2024 Diary2U</p>
      </footer>
    </div>
  )
}

export default Layout
