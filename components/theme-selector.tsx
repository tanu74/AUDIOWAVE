const themes = {
  ocean: "from-blue-500 to-cyan-400",
  sunset: "from-pink-500 to-orange-400",
  forest: "from-green-600 to-lime-400",
}

export default function ThemeSelector({ setTheme }: { setTheme: (theme: string) => void }) {
  return (
    <div className="flex gap-2 mt-4 justify-center">
      {Object.entries(themes).map(([name, gradient]) => (
        <button
          key={name}
          onClick={() => setTheme(gradient)}
          className={`h-10 w-10 rounded-full bg-gradient-to-r ${gradient} border-2 border-white`}
          title={name}
        />
      ))}
    </div>
  )
}
