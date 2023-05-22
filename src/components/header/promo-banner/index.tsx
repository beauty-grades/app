export const PromoBanner = ({ children }) => (
  <div className="bg-red-600 hover:bg-rose-600">
    <div className="container flex h-10 items-center justify-end">
      <h1 className="text-sm font-bold">{children}</h1>
    </div>
  </div>
)
