// components/ui/FormField.tsx
import { InputHTMLAttributes, SelectHTMLAttributes } from "react"

type BaseProps = {
  label:    string
  hint?:    string
  error?:   string
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input"
  }

type SelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select"
    options: { value: string; label: string }[]
  }

type FormFieldProps = InputProps | SelectProps

export function FormField(props: FormFieldProps) {
  const { label, hint, error, as = "input", ...rest } = props

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-white/60">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-white/30">{hint}</span>
        )}
      </div>

      {/* Input ou Select */}
      {as === "select" ? (
        <select
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10
                     rounded-lg text-sm text-white/70 outline-none
                     focus:border-green-400/40 focus:bg-green-400/[0.03]
                     transition-colors"
        >
          {(props as SelectProps).options.map((opt) => (
            <option key={opt.value} value={opt.value}
                    className="bg-zinc-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={`w-full px-3 py-2.5 bg-white/5 border rounded-lg
                      text-sm text-white outline-none transition-colors
                      placeholder:text-white/20
                      focus:border-green-400/40 focus:bg-green-400/[0.03]
                      ${error
                        ? "border-red-400/50 bg-red-400/[0.03]"
                        : "border-white/10"
                      }`}
        />
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span></span> {error}
        </p>
      )}
    </div>
  )
}