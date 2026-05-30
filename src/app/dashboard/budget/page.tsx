"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HandCoins, Plus, Trash2, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Transaction = {
  id: string;
  date: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  note: string;
};

type SplitEntry = {
  id: string;
  date: string;
  direction: "i_owe" | "owes_me";
  person: string;
  amount: number;
  reason: string;
  settled: boolean;
};

const categories = [
  "Food",
  "Transport",
  "Books",
  "Health",
  "Subscriptions",
  "Events",
  "Savings",
  "Grant",
  "Other",
];

const colors = ["#EC3A7A", "#F48FB1", "#F7931E", "#F15A24", "#1E9CD7", "#0D47A1", "#8B5CF6", "#10B981", "#6F4B5D"];

function currency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [splits, setSplits] = useState<SplitEntry[]>([]);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<Transaction["type"]>("Expense");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [splitDate, setSplitDate] = useState(new Date().toISOString().slice(0, 10));
  const [direction, setDirection] = useState<SplitEntry["direction"]>("i_owe");
  const [person, setPerson] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const savedTransactions = localStorage.getItem("hercatalyst_budget_transactions");
    const savedSplits = localStorage.getItem("hercatalyst_split_entries");

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedSplits) setSplits(JSON.parse(savedSplits));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("hercatalyst_split_entries", JSON.stringify(splits));
  }, [splits]);

  function addTransaction() {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      date,
      type,
      category,
      amount: parsedAmount,
      note,
    };

    setTransactions([transaction, ...transactions]);
    setAmount("");
    setNote("");
  }

  function deleteTransaction(id: string) {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  }

  function addSplit() {
    const parsedAmount = Number(splitAmount);
    if (!person.trim() || !parsedAmount || parsedAmount <= 0) return;

    const entry: SplitEntry = {
      id: crypto.randomUUID(),
      date: splitDate,
      direction,
      person: person.trim(),
      amount: parsedAmount,
      reason,
      settled: false,
    };

    setSplits([entry, ...splits]);
    setPerson("");
    setSplitAmount("");
    setReason("");
  }

  function deleteSplit(id: string) {
    setSplits(splits.filter((split) => split.id !== id));
  }

  function toggleSettled(id: string) {
    setSplits(
      splits.map((split) =>
        split.id === id ? { ...split, settled: !split.settled } : split
      )
    );
  }

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const activeSplits = splits.filter((split) => !split.settled);

    const iOwe = activeSplits
      .filter((split) => split.direction === "i_owe")
      .reduce((sum, split) => sum + split.amount, 0);

    const owedToMe = activeSplits
      .filter((split) => split.direction === "owes_me")
      .reduce((sum, split) => sum + split.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      iOwe,
      owedToMe,
      netSplit: owedToMe - iOwe,
    };
  }, [transactions, splits]);

  const spendingByCategory = useMemo(() => {
    return categories
      .map((item) => {
        const total = transactions
          .filter((transaction) => transaction.type === "Expense" && transaction.category === item)
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
          category: item,
          amount: total,
        };
      })
      .filter((item) => item.amount > 0);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const grouped: Record<string, { month: string; income: number; expenses: number }> = {};

    transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      if (!grouped[month]) grouped[month] = { month, income: 0, expenses: 0 };

      if (transaction.type === "Income") grouped[month].income += transaction.amount;
      else grouped[month].expenses += transaction.amount;
    });

    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const splitByPerson = useMemo(() => {
    const people: Record<string, { person: string; net: number; iOwe: number; owedToMe: number }> = {};

    splits
      .filter((split) => !split.settled)
      .forEach((split) => {
        if (!people[split.person]) {
          people[split.person] = {
            person: split.person,
            net: 0,
            iOwe: 0,
            owedToMe: 0,
          };
        }

        if (split.direction === "i_owe") {
          people[split.person].iOwe += split.amount;
          people[split.person].net -= split.amount;
        } else {
          people[split.person].owedToMe += split.amount;
          people[split.person].net += split.amount;
        }
      });

    return Object.values(people).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }, [splits]);

  const biggestCategory = spendingByCategory.length
    ? [...spendingByCategory].sort((a, b) => b.amount - a.amount)[0]
    : null;

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <Wallet className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">Budget + Split Tracker</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            Track student spending, grants, savings, and friend IOUs in one place. Like a tiny
            Splitwise built for college life.
          </p>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-5">
          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Balance</p>
            <h2 className="mt-2 text-3xl font-black">{currency(summary.balance)}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Income</p>
            <h2 className="mt-2 text-3xl font-black">{currency(summary.income)}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Expenses</p>
            <h2 className="mt-2 text-3xl font-black">{currency(summary.expenses)}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">You owe</p>
            <h2 className="mt-2 text-3xl font-black">{currency(summary.iOwe)}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-[#26111D] p-5 text-white">
            <p className="text-sm font-bold text-[#F48FB1]">Owed to you</p>
            <h2 className="mt-2 text-3xl font-black">{currency(summary.owedToMe)}</h2>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Add transaction</h2>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value as Transaction["type"])}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Expense</option>
                    <option>Income</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Note</Label>
                  <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Lunch, grant, books..." />
                </div>

                <Button onClick={addTransaction} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Save transaction
                </Button>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-[#EC3A7A]" />
                <h2 className="text-2xl font-black">Add split / IOU</h2>
              </div>

              <p className="text-sm text-[#6F4B5D]">
                Use this when a friend paid for you, or when someone owes you money.
              </p>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={splitDate} onChange={(event) => setSplitDate(event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Direction</Label>
                  <select
                    value={direction}
                    onChange={(event) => setDirection(event.target.value as SplitEntry["direction"])}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option value="i_owe">I owe them</option>
                    <option value="owes_me">They owe me</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Person</Label>
                  <Input value={person} onChange={(event) => setPerson(event.target.value)} placeholder="Aanya" />
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    min="0"
                    value={splitAmount}
                    onChange={(event) => setSplitAmount(event.target.value)}
                    placeholder="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Cafe bill, auto, movie..." />
                </div>

                <Button onClick={addSplit} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Save split
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-black">Spending by category</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={spendingByCategory} dataKey="amount" nameKey="category" outerRadius={90}>
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={entry.category} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => currency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-sm text-[#6F4B5D]">
                  {biggestCategory ? `Most spending: ${biggestCategory.category}` : "Add an expense to see this chart."}
                </p>
              </Card>

              <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-black">Monthly flow</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => currency(Number(value))} />
                      <Bar dataKey="income" fill="#1E9CD7" radius={[12, 12, 0, 0]} />
                      <Bar dataKey="expenses" fill="#EC3A7A" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Split balances</h2>
                <Badge className={summary.netSplit >= 0 ? "bg-[#E9FFF5] text-[#047857]" : "bg-[#FFF0F5] text-[#EC3A7A]"}>
                  Net {currency(summary.netSplit)}
                </Badge>
              </div>

              <div className="space-y-3">
                {splitByPerson.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No active IOUs.
                  </div>
                ) : (
                  splitByPerson.map((personBalance) => (
                    <div key={personBalance.person} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-black">{personBalance.person}</p>
                          <p className="text-sm text-[#6F4B5D]">
                            {personBalance.net >= 0
                              ? `${personBalance.person} owes you ${currency(personBalance.net)}`
                              : `You owe ${personBalance.person} ${currency(Math.abs(personBalance.net))}`}
                          </p>
                        </div>
                        <Badge className={personBalance.net >= 0 ? "bg-[#E9FFF5] text-[#047857]" : "bg-[#FFF0F5] text-[#EC3A7A]"}>
                          {personBalance.net >= 0 ? "+" : "-"}
                          {currency(Math.abs(personBalance.net))}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Active split history</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {splits.length} saved
                </Badge>
              </div>

              <div className="space-y-3">
                {splits.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No split entries yet.
                  </div>
                ) : (
                  splits.map((split) => (
                    <div
                      key={split.id}
                      className={`rounded-2xl border p-4 ${
                        split.settled ? "border-[#D7D7D7] bg-white/60 opacity-60" : "border-[#F6C6D7] bg-[#FFF7FA]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black">
                            {split.direction === "i_owe" ? `You owe ${split.person}` : `${split.person} owes you`}{" "}
                            {currency(split.amount)}
                          </p>
                          <p className="mt-1 text-sm text-[#6F4B5D]">
                            {split.date}
                            {split.reason ? ` • ${split.reason}` : ""}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toggleSettled(split.id)}>
                            {split.settled ? "Reopen" : "Settle"}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteSplit(split.id)}>
                            <Trash2 className="h-4 w-4 text-[#F15A24]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Transactions</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {transactions.length} saved
                </Badge>
              </div>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No transactions yet.
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4"
                    >
                      <div>
                        <p className="font-black">
                          {transaction.category} • {currency(transaction.amount)}
                        </p>
                        <p className="mt-1 text-sm text-[#6F4B5D]">
                          {transaction.date} • {transaction.type}
                          {transaction.note ? ` • ${transaction.note}` : ""}
                        </p>
                      </div>

                      <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                        <Trash2 className="h-4 w-4 text-[#F15A24]" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}