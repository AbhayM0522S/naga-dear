const SemSection = () => {
  const semValues = ['5 Sem', '10 Sem', '30 Sem', '50 Sem', '100 Sem'];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-x-28">
        {semValues.map((value) => (
          <button
            key={value}
            className="px-6 py-3 bg-linear-to-r from-teal-600 to-teal-700 text-white text-sm sm:text-base rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemSection;