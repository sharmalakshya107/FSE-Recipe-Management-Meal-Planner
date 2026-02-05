import { useForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface UseAppFormProps<S extends z.ZodSchema> {
  schema: S;
  defaultValues?: DefaultValues<z.infer<S>>;
}

export function useAppForm<S extends z.ZodSchema>({
  schema,
  defaultValues,
}: UseAppFormProps<S>): UseFormReturn<z.infer<S>> {
  return useForm<z.infer<S>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
