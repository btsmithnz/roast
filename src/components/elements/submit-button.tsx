"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

type Props = ButtonProps & {
  icon?: ReactNode;
};

export function SubmitButton({ icon, children, disabled, ...props }: Props) {
  const status = useFormStatus();

  return (
    <Button disabled={status.pending || disabled} type="submit" {...props}>
      {status.pending ? <Spinner /> : icon}
      {children}
    </Button>
  );
}
