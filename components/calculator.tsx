"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Token = string | number;

function evaluateTokens(tokens: Token[]): number {
  if (tokens.length === 0) return 0;

  const nums: number[] = [];
  const ops: string[] = [];

  for (const t of tokens) {
    if (typeof t === "number") {
      nums.push(t);
    } else {
      ops.push(t);
    }
  }

  // 1단계: × ÷ 먼저 처리
  let i = 0;
  while (i < ops.length) {
    if (ops[i] === "×" || ops[i] === "÷") {
      const left = nums[i];
      const right = nums[i + 1];
      const result = ops[i] === "×" ? left * right : right !== 0 ? left / right : 0;
      nums.splice(i, 2, result);
      ops.splice(i, 1);
    } else {
      i++;
    }
  }

  // 2단계: + - 처리
  let result = nums[0];
  for (let j = 0; j < ops.length; j++) {
    if (ops[j] === "+") {
      result += nums[j + 1];
    } else if (ops[j] === "-") {
      result -= nums[j + 1];
    }
  }

  return result;
}

function formatNumber(value: string): string {
  if (value === "" || value === "-") return value;
  if (value.includes(".") && !value.endsWith(".")) {
    const [int, dec] = value.split(".");
    return parseFloat(int).toLocaleString() + "." + dec;
  }
  if (value.endsWith(".")) {
    return parseFloat(value).toLocaleString() + ".";
  }
  return parseFloat(value).toLocaleString();
}

function formatResult(num: number): string {
  const rounded = parseFloat(num.toFixed(10));
  return rounded.toLocaleString();
}

function buildExpressionString(tokens: Token[], currentInput?: string): string {
  const parts = tokens.map((t) =>
    typeof t === "number" ? formatNumber(String(t)) : ` ${t} `
  );
  if (currentInput !== undefined) {
    parts.push(formatNumber(currentInput));
  }
  return parts.join("");
}

export default function Calculator() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentInput, setCurrentInput] = useState("0");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [lastExpression, setLastExpression] = useState("");

  const inputDigit = (digit: string) => {
    if (showResult) {
      // = 후 새 숫자 입력 → 새 수식 시작
      setTokens([]);
      setCurrentInput(digit);
      setShowResult(false);
      setResult("");
      setLastExpression("");
      return;
    }
    setCurrentInput(currentInput === "0" ? digit : currentInput + digit);
  };

  const inputDecimal = () => {
    if (showResult) {
      setTokens([]);
      setCurrentInput("0.");
      setShowResult(false);
      setResult("");
      setLastExpression("");
      return;
    }
    if (!currentInput.includes(".")) {
      setCurrentInput(currentInput + ".");
    }
  };

  const clear = () => {
    setTokens([]);
    setCurrentInput("0");
    setShowResult(false);
    setResult("");
    setLastExpression("");
  };

  const deleteLast = () => {
    if (showResult) return;
    if (currentInput.length > 1) {
      setCurrentInput(currentInput.slice(0, -1));
    } else if (currentInput !== "0") {
      setCurrentInput("0");
    } else if (tokens.length >= 2) {
      // 현재 입력이 "0"이고 토큰이 있으면 마지막 연산자+숫자 복원
      const newTokens = [...tokens];
      newTokens.pop(); // 연산자 제거
      const lastNum = newTokens.pop(); // 이전 숫자 복원
      setTokens(newTokens);
      setCurrentInput(String(lastNum ?? "0"));
    }
  };

  const handlePercent = () => {
    const value = parseFloat(currentInput);
    if (!isNaN(value)) {
      setCurrentInput(String(value / 100));
    }
  };

  const toggleSign = () => {
    if (currentInput === "0") return;
    if (currentInput.startsWith("-")) {
      setCurrentInput(currentInput.slice(1));
    } else {
      setCurrentInput("-" + currentInput);
    }
  };

  const handleOperator = (op: string) => {
    if (showResult) {
      // = 후 연산자 입력 → 결과에 이어서 계산
      setTokens([parseFloat(result.replace(/,/g, "")), op]);
      setCurrentInput("0");
      setShowResult(false);
      setResult("");
      setLastExpression("");
      return;
    }

    const value = parseFloat(currentInput);
    if (isNaN(value) && tokens.length === 0) return;

    // 현재 입력이 "0"이고 방금 연산자를 눌렀다면 마지막 연산자만 교체
    if (currentInput === "0" && tokens.length >= 2 && typeof tokens[tokens.length - 1] === "string") {
      const newTokens = [...tokens];
      newTokens[newTokens.length - 1] = op;
      setTokens(newTokens);
      return;
    }

    setTokens([...tokens, value, op]);
    setCurrentInput("0");
  };

  const handleEquals = () => {
    if (showResult) return;

    const value = parseFloat(currentInput);
    const allTokens = [...tokens, value];
    const expression = buildExpressionString(tokens, currentInput);
    const calcResult = evaluateTokens(allTokens);
    const resultStr = formatResult(calcResult);

    setLastExpression(expression);
    setResult(resultStr);
    setShowResult(true);
    setTokens([]);
    setCurrentInput("0");
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" || e.key === "-") {
        handleOperator(e.key);
      } else if (e.key === "*") {
        handleOperator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Backspace") {
        deleteLast();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        clear();
      } else if (e.key === "%") {
        handlePercent();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, currentInput, showResult, result]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 디스플레이 텍스트 결정
  const expressionText = showResult ? lastExpression : "";
  const mainDisplayText = showResult
    ? result
    : buildExpressionString(tokens, currentInput) || "0";

  const buttons = [
    { label: "C", action: clear, variant: "ghost" as const, className: "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 font-semibold" },
    { label: "±", action: toggleSign, variant: "ghost" as const, className: "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25" },
    { label: "%", action: handlePercent, variant: "ghost" as const, className: "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25" },
    { label: "÷", action: () => handleOperator("÷"), variant: "ghost" as const, className: "bg-[#3366FF]/90 backdrop-blur-sm border border-[#3366FF]/30 text-white hover:bg-[#3366FF]" },

    { label: "7", action: () => inputDigit("7"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "8", action: () => inputDigit("8"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "9", action: () => inputDigit("9"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "×", action: () => handleOperator("×"), variant: "ghost" as const, className: "bg-[#3366FF]/90 backdrop-blur-sm border border-[#3366FF]/30 text-white hover:bg-[#3366FF]" },

    { label: "4", action: () => inputDigit("4"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "5", action: () => inputDigit("5"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "6", action: () => inputDigit("6"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "-", action: () => handleOperator("-"), variant: "ghost" as const, className: "bg-[#3366FF]/90 backdrop-blur-sm border border-[#3366FF]/30 text-white hover:bg-[#3366FF]" },

    { label: "1", action: () => inputDigit("1"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "2", action: () => inputDigit("2"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "3", action: () => inputDigit("3"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "+", action: () => handleOperator("+"), variant: "ghost" as const, className: "bg-[#3366FF]/90 backdrop-blur-sm border border-[#3366FF]/30 text-white hover:bg-[#3366FF]" },

    { label: "⌫", action: deleteLast, variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "0", action: () => inputDigit("0"), variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: ".", action: inputDecimal, variant: "ghost" as const, className: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20" },
    { label: "=", action: handleEquals, variant: "ghost" as const, className: "bg-[#3366FF]/90 backdrop-blur-sm border border-[#3366FF]/30 text-white hover:bg-[#3366FF] font-semibold" },
  ];

  return (
    <Card className="w-full max-w-sm rounded-2xl border border-white/20 bg-[#010101]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg text-white">Calculating Machine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Expression display — = 후 수식 표시 */}
        <div className="text-right text-base text-[#94A3B8] h-5 px-2 truncate">
          {expressionText}
        </div>

        {/* Main display — 입력 중 수식, = 후 결과 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-right overflow-hidden">
          <span
            className={`font-bold tracking-wide text-white block truncate ${
              showResult ? "text-3xl" : mainDisplayText.length > 12 ? "text-xl" : "text-3xl"
            }`}
          >
            {mainDisplayText}
          </span>
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant={btn.variant}
              className={`h-14 text-2xl font-medium ${btn.className ?? ""}`}
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
