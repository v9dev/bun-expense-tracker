import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateExpense } from "@server/sharedTypes";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const response = await api.me.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function getAllExpenses() {
  // await new Promise((r) => setTimeout(r, 2000));
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
});

export async function createExpense({ value }: { value: CreateExpense }) {
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) {
    throw new Error("server error");
  }
  const newExpense = await res.json();
  return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: CreateExpense;
}>({
  queryKey: ["loading-create-data"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}
