const PaginationControls = ({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-xs pt-2">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
      >
        ← Prev
      </button>

      <span className="text-[#3F4245]/60 font-medium">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
};

export default PaginationControls;
