"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const deleteLast = () => {
    if (waitingForOperand) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "×":
        return left * right;
      case "÷":
        return right !== 0 ? left / right : 0;
      default:
        return right;
    }
  };

  const handleOperator = (nextOperator: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operator && !waitingForOperand) {
      const result = calculate(parseFloat(previousValue), currentValue, operator);
      const resultStr = String(parseFloat(result.toFixed(10)));
      setDisplay(resultStr);
      setPreviousValue(resultStr);
    } else {
      setPreviousValue(String(currentValue));
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (previousValue === null || operator === null) return;

    const currentValue = parseFloat(display);
    const result = calculate(parseFloat(previousValue), currentValue, operator);
    const resultStr = String(parseFloat(result.toFixed(10)));

    setDisplay(resultStr);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const formatDisplay = (value: string) => {
    if (value.includes(".") && !value.endsWith(".")) {
      const [int, dec] = value.split(".");
      return parseFloat(int).toLocaleString() + "." + dec;
    }
    if (value.endsWith(".")) {
      return parseFloat(value).toLocaleString() + ".";
    }
    return parseFloat(value).toLocaleString();
  };

  const buttons = [
    { label: "C", action: clear, variant: "secondary" as const, className: "text-[#3366FF] font-semibold" },
    { label: "±", action: toggleSign, variant: "secondary" as const },
    { label: "%", action: handlePercent, variant: "secondary" as const },
    { label: "÷", action: () => handleOperator("÷"), variant: "default" as const, className: "bg-[#3366FF] hover:bg-[#2B57D9] text-white" },

    { label: "7", action: () => inputDigit("7"), variant: "outline" as const },
    { label: "8", action: () => inputDigit("8"), variant: "outline" as const },
    { label: "9", action: () => inputDigit("9"), variant: "outline" as const },
    { label: "×", action: () => handleOperator("×"), variant: "default" as const, className: "bg-[#3366FF] hover:bg-[#2B57D9] text-white" },

    { label: "4", action: () => inputDigit("4"), variant: "outline" as const },
    { label: "5", action: () => inputDigit("5"), variant: "outline" as const },
    { label: "6", action: () => inputDigit("6"), variant: "outline" as const },
    { label: "-", action: () => handleOperator("-"), variant: "default" as const, className: "bg-[#3366FF] hover:bg-[#2B57D9] text-white" },

    { label: "1", action: () => inputDigit("1"), variant: "outline" as const },
    { label: "2", action: () => inputDigit("2"), variant: "outline" as const },
    { label: "3", action: () => inputDigit("3"), variant: "outline" as const },
    { label: "+", action: () => handleOperator("+"), variant: "default" as const, className: "bg-[#3366FF] hover:bg-[#2B57D9] text-white" },

    { label: "⌫", action: deleteLast, variant: "outline" as const },
    { label: "0", action: () => inputDigit("0"), variant: "outline" as const },
    { label: ".", action: inputDecimal, variant: "outline" as const },
    { label: "=", action: handleEquals, variant: "default" as const, className: "bg-[#3366FF] hover:bg-[#2B57D9] text-white text-xl font-semibold" },
  ];

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-[0_8px_32px_-2px_rgba(0,0,0,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">계산기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Expression display */}
        <div className="text-right text-sm text-muted-foreground h-5 px-2">
          {previousValue !== null && operator
            ? `${formatDisplay(previousValue)} ${operator}`
            : ""}
        </div>

        {/* Main display */}
        <div className="bg-muted rounded-lg p-4 text-right">
          <span className="text-3xl font-bold tracking-tight">
            {formatDisplay(display)}
          </span>
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant={btn.variant}
              className={`h-14 text-lg font-medium ${btn.className ?? ""}`}
              onClick={btn.action}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
