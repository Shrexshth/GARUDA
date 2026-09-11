interface InputBarProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export default function InputBar({ placeholder = "Initiate a query or ask an agent to start a workflow...", onSubmit }: InputBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input?.value.trim() && onSubmit) {
      onSubmit(input.value.trim());
      input.value = "";
    }
  };

  return (
    <form
      className="w-full relative flex items-center shadow-lg rounded-full bg-surface-container-low p-1.5 transition-all focus-within:bg-surface-container-lowest focus-within:shadow-xl"
      onSubmit={handleSubmit}
    >

      <input
        className="flex-1 bg-transparent border-0 outline-none px-space-sm text-body-md text-on-surface placeholder:text-secondary focus:ring-0 min-w-0"
        placeholder={placeholder}
        type="text"
      />
      <div className="flex items-center gap-space-2xs shrink-0 pr-1">

        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-on-surface-variant transition-transform active:scale-95"
          title="Send"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
        </button>
      </div>
    </form>
  );
}
