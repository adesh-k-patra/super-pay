import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  min?: string
  max?: string
  disabledDays?: Date[] | ((date: Date) => boolean)
  "data-testid"?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  min,
  max,
  disabledDays,
  "data-testid": testId,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      onChange(format(selectedDate, "yyyy-MM-dd"))
    }
  }

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value))
    } else {
      setDate(undefined)
    }
  }, [value])

  // Calculate disabled days based on min/max constraints
  const getDisabledDays = React.useMemo(() => {
    const disabledRules: any[] = []
    
    if (min) {
      const minDate = new Date(min)
      disabledRules.push({ before: minDate })
    }
    
    if (max) {
      const maxDate = new Date(max)
      disabledRules.push({ after: maxDate })
    }
    
    if (disabledDays) {
      disabledRules.push(disabledDays)
    }
    
    return disabledRules.length > 0 ? disabledRules : undefined
  }, [min, max, disabledDays])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 rounded-none",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          data-testid={testId}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-white/60" />
          {date ? format(date, "PPP") : <span className="text-white/60">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/20" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={getDisabledDays}
          initialFocus
          className="bg-zinc-950 text-white"
        />
      </PopoverContent>
    </Popover>
  )
}
