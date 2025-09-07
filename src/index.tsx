import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  HTMLAttributes,
  ForwardedRef,
  KeyboardEvent,
} from "react";

// Props for the Select component
interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  children: ReactNode;
  arrowOpen?: ReactNode;
  arrowClosed?: ReactNode;
}

// Props for the Option component
interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// CSS styles
const STYLE_ID = "cs-select-styles";
const STYLES = `
.cs-select { position: relative; width: 200px; font-family: system-ui, sans-serif; }
.cs-control { border: 1px solid #ccc; padding: 8px 12px; border-radius: 4px; background: #fff; cursor: pointer; display:flex; justify-content:space-between; align-items:center; }
.cs-arrow { margin-left: 8px; }
.cs-dropdown { position: absolute; top: 100%; left: 0; right: 0; border: 1px solid #ccc; border-radius: 4px; margin-top: 4px; background: #fff; z-index: 1000; max-height: 200px; overflow-y: auto; }
.cs-option { padding: 8px 12px; cursor: pointer; display:flex; align-items:center; gap:8px; border-bottom: 1px solid #eee; }
.cs-option:last-child { border-bottom: none; }
.cs-option--selected { background: #f0f0f0; }
.cs-option input[type="checkbox"] { pointer-events: none; }
.cs-option--disabled { opacity: 0.5; cursor: not-allowed; }
.cs-option--highlight { background: #e6f7ff; }
`;

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

// Option Component
export const Option: React.FC<OptionProps> = ({
  value,
  children,
  className,
  disabled,
  ...rest
}) => (
  <div
    data-value={value}
    aria-disabled={disabled}
    className={`cs-option ${disabled ? "cs-option--disabled" : ""} ${className || ""}`}
    {...rest}
  >
    {children}
  </div>
);

// Select Component with keyboard navigation
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    { className, value, onChange, multiple, children, arrowOpen, arrowClosed, ...rest },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(
      Array.isArray(value) ? value : value ? [value] : []
    );
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    const innerRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
      ensureStyles();
    }, []);

    useEffect(() => {
      if (value !== undefined) {
        setSelected(Array.isArray(value) ? value : [value]);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(event.target as Node)) {
          setOpen(false);
          setHighlightIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (val: string, disabled?: boolean) => {
      if (disabled) return;

      let newValues: string[];
      if (multiple) {
        if (selected.includes(val)) {
          newValues = selected.filter((v) => v !== val);
        } else {
          newValues = [...selected, val];
        }
      } else {
        newValues = [val];
        setOpen(false);
        setHighlightIndex(-1);
      }

      if (value === undefined) setSelected(newValues);
      onChange?.(multiple ? newValues : newValues[0]);
    };

    const renderOptions = () =>
      React.Children.map(children, (child: any, index) => {
        if (!child) return null;
        const { value, disabled, className, children, ...otherProps } = child.props;
        const isSelected = selected.includes(value);

        return (
          <div
            ref={(el) => (optionsRef.current[index] = el!)}
            onClick={() => toggleOption(value, disabled)}
            className={`cs-option ${
              isSelected ? "cs-option--selected" : ""
            } ${disabled ? "cs-option--disabled" : ""} ${
              index === highlightIndex ? "cs-option--highlight" : ""
            } ${className || ""}`}
            {...otherProps}
          >
            {multiple && <input type="checkbox" checked={isSelected} readOnly />}
            {children}
          </div>
        );
      });

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const optionsCount = React.Children.count(children);
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
        return;
      }
      if (!open) return;

      if (e.key === "ArrowDown") {
        let next = highlightIndex + 1;
        while (
          next < optionsCount &&
          (React.Children.toArray(children)[next] as any).props.disabled
        ) {
          next++;
        }
        if (next < optionsCount) setHighlightIndex(next);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        let prev = highlightIndex - 1;
        while (
          prev >= 0 &&
          (React.Children.toArray(children)[prev] as any).props.disabled
        ) {
          prev--;
        }
        if (prev >= 0) setHighlightIndex(prev);
        e.preventDefault();
      } else if (e.key === "Enter" && highlightIndex >= 0) {
        const child = React.Children.toArray(children)[highlightIndex] as any;
        toggleOption(child.props.value, child.props.disabled);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setOpen(false);
        setHighlightIndex(-1);
        e.preventDefault();
      }
    };

    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (ref) {
            if (typeof ref === "function") ref(node);
            else ref.current = node;
          }
        }}
        className={`cs-select ${className || ""}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...rest}
      >
        <div onClick={() => setOpen((o) => !o)} className="cs-control">
          <span>
            {selected.length > 0 ? selected.join(", ") : "Select an option"}
          </span>
          <span className="cs-arrow">{open ? arrowOpen || "▲" : arrowClosed || "▼"}</span>
        </div>

        {open && <div className="cs-dropdown">{renderOptions()}</div>}
      </div>
    );
  }
);

Select.displayName = "Select";
