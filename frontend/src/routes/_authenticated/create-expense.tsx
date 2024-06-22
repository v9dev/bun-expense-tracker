import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "@tanstack/react-form";
import {
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createExpenseSchema } from "@server/sharedTypes";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpenses,
});

function CreateExpenses() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toDateString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      );

      navigate({ to: "/expenses" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value,
      });

      try {
        const newExpense = await createExpense({ value });
        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        });

        toast("Expenes Created", {
          description: `Successfully created new expense:${newExpense.id}`,
        });
      } catch (error) {
        toast("Error", {
          description: "Failed to create new expense",
        });
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }
    },
  });
  return (
    <div className="p-2 max-w-xl m-auto">
      <h2>Create Expenses!</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-y-4"
      >
        <form.Field
          name="title"
          validators={{ onChange: createExpenseSchema.shape.title }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Title:</Label>
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
              </div>
            );
          }}
        />
        <form.Field
          name="amount"
          validators={{ onChange: createExpenseSchema.shape.amount }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div>
                <Label htmlFor={field.name}>Amount:</Label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
              </div>
            );
          }}
        />
        <form.Field
          name="date"
          validators={{ onChange: createExpenseSchema.shape.date }}
          children={(field) => {
            return (
              <div className="self-center">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date ?? new Date()).toDateString())
                  }
                  className="rounded-md border"
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
              </div>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
