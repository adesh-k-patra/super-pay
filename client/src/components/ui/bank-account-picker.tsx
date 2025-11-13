import { useState, useEffect, useRef } from "react";
import { CreditCard, ChevronDown, Check, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
}

interface BankAccountPickerProps {
  accounts: BankAccount[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
}

export function BankAccountPicker({
  accounts,
  value,
  onValueChange,
  placeholder = "Select a bank account",
  testId
}: BankAccountPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedAccount = accounts.find(acc => acc.id === value);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (accountId: string) => {
    onValueChange(accountId);
    setIsOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={selectedAccount ? `Selected: ${selectedAccount.bankName}` : placeholder}
        className="w-full bg-black/40 border border-white/30 text-white rounded-none font-light h-14 px-4 flex items-center justify-between hover:border-white/40 hover:bg-black/60 transition-all duration-200 group"
        data-testid={testId}
      >
        {selectedAccount ? (
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="bg-white/10 border border-white/20 p-2 rounded-none">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-white">{selectedAccount.bankName}</span>
                <span className="text-white/50 text-sm">
                  ****{selectedAccount.accountNumber?.slice(-4) || selectedAccount.accountNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {selectedAccount.accountType}
                </span>
                <span className="text-xs text-white/30">•</span>
                <span className="text-xs text-white/40 font-mono">{selectedAccount.ifscCode}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-white/50">
            <CreditCard className="h-5 w-5" />
            <span className="font-light">{placeholder}</span>
          </div>
        )}
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-white/40 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="listbox" 
          aria-label="Bank accounts"
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-black border border-white/20 backdrop-blur-xl shadow-2xl max-h-80 overflow-y-auto"
        >
            <div className="p-2 space-y-1">
              {accounts.length === 0 ? (
                <div className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50 font-light">No bank accounts available</p>
                </div>
              ) : (
                accounts.map((account) => {
                  const isSelected = account.id === value;
                  
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => handleSelect(account.id)}
                      className={cn(
                        "w-full text-left p-4 border transition-all duration-200 group",
                        isSelected 
                          ? "bg-white/10 border-white/40" 
                          : "bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/30"
                      )}
                      data-testid={`select-bank-${account.id}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Bank Icon */}
                        <div className={cn(
                          "bg-white/10 border p-2.5 rounded-none transition-colors",
                          isSelected ? "border-white/40" : "border-white/20 group-hover:border-white/30"
                        )}>
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        
                        {/* Account Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium text-white text-base">{account.bankName}</h4>
                            {isSelected && (
                              <div className="bg-white text-black p-1 rounded-none">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white/60 font-mono">
                                ****{account.accountNumber?.slice(-4) || account.accountNumber}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-xs px-2 py-0.5 border uppercase tracking-wider font-medium",
                                isSelected 
                                  ? "bg-white/10 border-white/30 text-white" 
                                  : "bg-black/40 border-white/20 text-white/60"
                              )}>
                                {account.accountType}
                              </span>
                              <span className="text-xs text-white/40 font-mono">{account.ifscCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
        </div>
      )}
    </div>
  );
}
